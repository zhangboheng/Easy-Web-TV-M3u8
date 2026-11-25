// Verify every hot-linked game and official-page URL in the manifest is reachable.
// Usage: node scripts/checks/check-webgame-urls.js
// Covers the generic WEBGAME_REGISTRY plus every iframe/new-tab URL declared in
// scripts/checks/hotlink-pages.json. Card images are covered by
// check-remote-images.js; this closes the dependency that would otherwise show
// a blank iframe while every static check stays green.
// Uses Node 18+ built-in fetch; no dependencies.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const manifestPages = JSON.parse(read('scripts/checks/hotlink-pages.json'));
const scriptCache = new Map();
function scriptSource(rel) {
    if (!scriptCache.has(rel)) scriptCache.set(rel, read(rel));
    return scriptCache.get(rel);
}

// Extract a JavaScript object/array literal assigned to a top-level var.
// Quote-aware bracket matching is enough for these hand-written registries.
function extractLiteral(src, name) {
    const marker = new RegExp('\\bvar\\s+' + name + '\\s*=\\s*');
    const match = marker.exec(src);
    if (!match) return null;
    const start = match.index + match[0].length;
    const open = src[start];
    if (open !== '{' && open !== '[') return null;
    const close = open === '{' ? '}' : ']';
    let depth = 0;
    let quote = null;
    let escaped = false;
    for (let i = start; i < src.length; i += 1) {
        const ch = src[i];
        if (quote) {
            if (escaped) escaped = false;
            else if (ch === '\\') escaped = true;
            else if (ch === quote) quote = null;
            continue;
        }
        if (ch === "'" || ch === '"' || ch === '`') { quote = ch; continue; }
        if (ch === open) depth += 1;
        else if (ch === close) {
            depth -= 1;
            if (depth === 0) return src.slice(start, i + 1);
        }
    }
    return null;
}

const targets = [];
const seen = new Set();
function addTarget(key, url) {
    if (typeof url !== 'string' || !/^https:\/\//.test(url)) {
        targets.push({ key, url: String(url), bad: true });
        return 0;
    }
    if (!seen.has(url)) {
        seen.add(url);
        targets.push({ key, url, bad: false });
    }
    return 1;
}

const collectedResolvers = new Set();
// Same-origin SW-proxied playback paths are intentionally not Node-fetchable.
// They are still declared in the manifest; the upstream origin is audited via
// the corresponding new-tab resolver (e.g. RUSTPAL_UPSTREAM).
const PROXIED_RESOLVERS = new Set(['RUSTPAL_BASE']);
function collectResolver(page, role, resolver) {
    const src = scriptSource(page.script);
    const label = page.route + ' ' + role;
    const name = resolver && resolver.name;
    if (!name) return 0;
    if (PROXIED_RESOLVERS.has(name)) {
        const proxyMatch = src.match(new RegExp('\\bvar\\s+' + name + "\\s*=\\s*'(/[^']+)'"));
        if (proxyMatch) {
            collectedResolvers.add(name);
            return 1;
        }
        return 0;
    }
    let count = 0;
    if (resolver.type === 'const' || resolver.type === 'prefix') {
        const match = src.match(new RegExp('\\bvar\\s+' + name + "\\s*=\\s*'(https:\\/\\/[^']+)'"));
        count = match ? addTarget(label + ' ' + name, match[1]) : 0;
    } else if (resolver.type === 'registry') {
        const literal = extractLiteral(src, name);
        if (!literal) return 0;
        const value = eval('(' + literal + ')');
        const items = Array.isArray(value) ? value : Object.keys(value).map((k) => value[k]);
        items.forEach((item, i) => {
            count += addTarget(label + ' ' + name + '[' + i + ']', item && item[resolver.field]);
        });
    }
    if (count) collectedResolvers.add(name);
    return count;
}

manifestPages.forEach((page) => {
    collectResolver(page, 'frame', page.resolver);
    collectResolver(page, 'new tab', page.newTabResolver);
});

const webgameLiteral = extractLiteral(scriptSource('js/towebgame.js'), 'WEBGAME_REGISTRY');
const registryKeys = webgameLiteral ? Object.keys(eval('(' + webgameLiteral + ')')) : [];

// Every manifest resolver must contribute at least one reachable URL.
const preflightFailures = [];
manifestPages.forEach((page) => {
    [page.resolver, page.newTabResolver].forEach((resolver) => {
        if (resolver && resolver.name && !collectedResolvers.has(resolver.name)) {
            preflightFailures.push('URL checker could not resolve ' + resolver.name + ' from ' + page.route);
        }
    });
});
if (preflightFailures.length) {
    preflightFailures.forEach((f) => console.log('FAIL: ' + f));
    process.exit(1);
}

// itch.io rejects direct Node fetch connections in this environment (verified
// reachable through a normal browser/HTTP client). Do not call those upstreams
// dead; report them as unverifiable instead of failing the whole audit.
const UNVERIFIABLE_HOSTS = new Set(['itch.io']);
function isUnverifiable(url) {
    try {
        const host = new URL(url).hostname.toLowerCase();
        return UNVERIFIABLE_HOSTS.has(host) || host.endsWith('.itch.io');
    } catch (e) {
        return false;
    }
}

const TIMEOUT_MS = 25000;
const CONCURRENCY = 6;

async function checkUrlOnce(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
        const response = await fetch(url, {
            method: 'GET',
            redirect: 'follow',
            signal: controller.signal,
            headers: { 'User-Agent': 'EWTV-url-check/1.0' }
        });
        // Read only the first few KB: these are game pages, not images, and a
        // full download of every build would be wasteful in CI.
        let text = '';
        if (response.body) {
            const reader = response.body.getReader();
            let bytes = 0;
            while (bytes < 8192) {
                const chunk = await reader.read();
                if (chunk.done) break;
                bytes += chunk.value.length;
                text += new TextDecoder('utf-8', { fatal: false }).decode(chunk.value);
            }
            await reader.cancel().catch(() => {});
        }
        if (!response.ok) return url + ' -> HTTP ' + response.status;
        if (!text.length) return url + ' -> empty response body';
        // GitHub Pages serves a "Page not found" body for a missing path, and a
        // SPA fallback can answer 200 for one; some working builds ship no
        // <title> at all, so match the explicit not-found markers only.
        if (/Page not found|404\s*:\s*Not Found|File not found|There isn.t a GitHub Page here/i.test(text)) {
            return url + ' -> not-found page (status was ' + response.status + ')';
        }
        return null;
    } catch (e) {
        return url + ' -> ' + (e && e.name === 'AbortError' ? 'timeout' : (e && e.message) || 'network error');
    } finally {
        clearTimeout(timer);
    }
}

// Retry once so a single transient network hiccup does not fail CI.
async function checkUrl(url) {
    let result = await checkUrlOnce(url);
    if (result) {
        await new Promise((r) => setTimeout(r, 1000));
        result = await checkUrlOnce(url);
    }
    return result;
}

(async () => {
    const failures = [];
    const skipped = [];
    let index = 0;
    async function worker() {
        while (index < targets.length) {
            const target = targets[index++];
            if (target.bad) {
                failures.push(target.key + ' -> not an https URL: ' + target.url);
                continue;
            }
            if (isUnverifiable(target.url)) {
                skipped.push(target.key + ' ' + target.url);
                continue;
            }
            const result = await checkUrl(target.url);
            if (result) failures.push(target.key + ' ' + result);
        }
    }
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, targets.length) }, worker));
    if (failures.length) {
        failures.forEach((f) => console.log('FAIL: ' + f));
        process.exit(1);
    }
    console.log('checked ' + targets.length + ' hot-linked game/new-tab URLs across ' + manifestPages.length + ' pages (' + registryKeys.length + ' registry entries) | ALL OK' + (skipped.length ? ' (' + skipped.length + ' itch.io URLs unverifiable by Node fetch)' : ''));
})();
