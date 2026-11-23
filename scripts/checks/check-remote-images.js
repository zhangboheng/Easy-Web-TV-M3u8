// Verify every remote game card image is reachable (v8.6.0).
// Usage: node scripts/checks/check-remote-images.js
// Uses Node 20's built-in fetch; no dependencies.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const src = fs.readFileSync(path.join(root, 'js/togame.js'), 'utf8');
const gamesMatch = src.match(/var games = \[([\s\S]*?)\n\];/);
if (!gamesMatch) {
    console.log('FAIL: games array not found in js/togame.js');
    process.exit(1);
}
const games = eval('[' + gamesMatch[1] + ']');
const urls = Array.from(new Set(
    games.map((g) => g.image).filter((u) => typeof u === 'string' && /^https?:\/\//.test(u))
));

const TIMEOUT_MS = 20000;
const CONCURRENCY = 8;

async function checkUrlOnce(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
        const response = await fetch(url, {
            method: 'GET',
            redirect: 'follow',
            signal: controller.signal,
            headers: { 'User-Agent': 'EWTV-image-check/1.0' }
        });
        // Drain the body so sockets are released for the next requests.
        try { await response.arrayBuffer(); } catch (e) { /* ignore */ }
        return response.ok ? null : url + ' -> HTTP ' + response.status;
    } catch (e) {
        return url + ' -> ' + (e && e.name === 'AbortError' ? 'timeout' : (e && e.message) || 'network error');
    } finally {
        clearTimeout(timer);
    }
}

// Retry transient failures (429 rate-limit, 5xx, network hiccups) with
// exponential backoff. Wikimedia and GitHub may rate-limit under load, so a
// single short retry is not enough for CI reliability.
async function checkUrl(url) {
    // Attempt schedule: 0ms, 1s, 3s, 8s.
    const backoffs = [0, 1000, 3000, 8000];
    let result = null;
    for (const delay of backoffs) {
        if (delay > 0) {
            await new Promise((r) => setTimeout(r, delay));
        }
        result = await checkUrlOnce(url);
        if (!result) {
            return null;
        }
        const status = result.match(/HTTP (\d{3})/);
        // Only retry on rate-limit or server-side transient errors.
        const retryable = status && (status[1] === '429' || (status[1] >= '500' && status[1] < '600'));
        if (!retryable) {
            return result;
        }
    }
    return result;
}

(async () => {
    const failures = [];
    let index = 0;
    async function worker() {
        while (index < urls.length) {
            const url = urls[index++];
            const result = await checkUrl(url);
            if (result) failures.push(result);
        }
    }
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, urls.length) }, worker));
    if (failures.length) {
        failures.forEach((f) => console.log('FAIL: ' + f));
        process.exit(1);
    }
    console.log('checked ' + urls.length + ' unique remote images | ALL OK');
})();
