// Settings connectivity probe check (run with node).
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..', '..');
const src = fs.readFileSync(path.join(root, 'js', 'settings-probe.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const proxyConf = fs.readFileSync(path.join(root, 'js', 'proxy-config.js'), 'utf8');
let ok = true;
function check(c, m) { if (!c) { console.log('FAIL: ' + m); ok = false; } }
check(/var SettingsProbe\s*=/.test(src), 'settings-probe.js must define SettingsProbe');
check(/AbortController/.test(src), 'probe must use a timeout');
check(/ProxyConfig\.getProxies\(\)/.test(src), 'proxy probe must use the live proxy pool');
check(/fetch\(/.test(src) && !/fetchJSONWithProxy/.test(src), 'probe must not depend on apiproxy.js');
check(/testProxy:\s*testProxy/.test(src) && /testSource:\s*testSource/.test(src), 'probe must expose testProxy/testSource');
check(/reportFailure/.test(src) && /reportSuccess/.test(src), 'probe must feed the health cache');
const probeTag = html.indexOf('settings-probe.js');
const indexTag = html.indexOf('js/index.js');
check(probeTag !== -1 && probeTag < indexTag, 'index.html must load settings-probe.js before index.js');
check(/\/js\/settings-probe\.js/.test(fs.readFileSync(path.join(root, 'sw.js'), 'utf8')),
      'sw.js must precache settings-probe.js for offline Settings');

// --- Runtime behaviour: testProxy(url) must probe THAT proxy only -----------
// Regression guard: an earlier version looped over the whole enabled pool,
// so clicking ⚡ on a broken custom proxy showed a false ✓ from a built-in.
(function () {
    const urls = [];
    const ctx = {
        fetch: function (u) { urls.push(u); return Promise.resolve({ ok: true, text: function () { return Promise.resolve('ok'); } }); },
        AbortController: function () { this.signal = {}; this.abort = function () {}; },
        setTimeout: setTimeout, clearTimeout: clearTimeout, Date: Date, Promise: Promise,
        ProxyConfig: {
            getProxies: function () { return ['https://builtin.example/?url=']; },
            reportSuccess: function () {}, reportFailure: function () {}
        }
    };
    require('vm').createContext(ctx);
    require('vm').runInContext(src, ctx);
    return ctx.SettingsProbe.testProxy('https://my-custom.example/?url=').then(function () {
        check(urls.length === 1 && urls[0].indexOf('my-custom.example') !== -1,
              'testProxy(url) must fetch through the passed proxy, not the shared pool');
    });
})().then(function () {
    console.log('settings probe check: ' + (ok ? 'ALL OK' : 'FAIL'));
    process.exit(ok ? 0 : 1);
}).catch(function (e) {
    console.log('FAIL: probe runtime check threw: ' + e.message);
    process.exit(1);
});
