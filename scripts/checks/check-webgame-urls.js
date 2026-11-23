// Verify every hot-linked web game URL is reachable (v8.6.1).
// Usage: node scripts/checks/check-webgame-urls.js
// The generic player routes/webgame.html?game=<key> loads these URLs in an
// iframe. Card images are covered by check-remote-images.js; this closes the
// other half of the dependency: a dead upstream would otherwise show a blank
// iframe while every static check stays green.
// Uses Node 18+ built-in fetch; no dependencies.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const src = fs.readFileSync(path.join(root, 'js/towebgame.js'), 'utf8');
const registryMatch = src.match(/var WEBGAME_REGISTRY = (\{[\s\S]*?\n\});/);
if (!registryMatch) {
    console.log('FAIL: WEBGAME_REGISTRY not found in js/towebgame.js');
    process.exit(1);
}
const registry = eval('(' + registryMatch[1] + ')');
const keys = Object.keys(registry);
if (!keys.length) {
    console.log('FAIL: WEBGAME_REGISTRY is empty');
    process.exit(1);
}

// Deduplicate: several entries can share one host.
const targets = [];
const seen = new Set();
keys.forEach((key) => {
    const url = registry[key] && registry[key].url;
    if (typeof url !== 'string' || !/^https:\/\//.test(url)) {
        targets.push({ key, url: String(url), bad: true });
        return;
    }
    if (!seen.has(url)) {
        seen.add(url);
        targets.push({ key, url, bad: false });
    }
});

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
    let index = 0;
    async function worker() {
        while (index < targets.length) {
            const target = targets[index++];
            if (target.bad) {
                failures.push(target.key + ' -> not an https URL: ' + target.url);
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
    console.log('checked ' + targets.length + ' hot-linked game URLs (' + keys.length + ' registry entries) | ALL OK');
})();
