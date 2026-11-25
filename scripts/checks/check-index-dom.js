// Home page DOM guard (run with node)
// Usage: node check-index-dom.js [index.html] [js/index.js] [css/style.css]
//
// index.html is hand-maintained and has no build step, so structural mistakes
// survive forever: the category dialog and the source dialog both carried
// id="selectform" (duplicate id - getElementById only ever returns the first,
// and the category GO! button silently depended on document order), and the
// PWA prompt carried a .install-content wrapper with no CSS rule behind it.
// This check keeps those two fixed:
//   1) no duplicate id in index.html
//   2) no id="selectform" anywhere; the shared hook is class="selectform"
//   3) that class is styled, otherwise the dialogs lose their layout
//   4) every <label for="X"> in index.html points at an element that exists
//   5) no unstyled .install-content wrapper inside #install-prompt
//   6) no .stylebtn positional state machine and no links to the category pages
//      deleted in V8.2.1 (routes/countries.html, language.html, category.html):
//      that dead flow either did nothing or navigated to a 404.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const htmlPath = process.argv[2] || path.join(root, 'index.html');
const jsPath = process.argv[3] || path.join(root, 'js', 'index.js');
const cssPath = process.argv[4] || path.join(root, 'css', 'style.css');

let failed = 0;
function check(cond, msg) {
    if (!cond) { failed++; console.log('FAIL ' + msg); }
}

const html = fs.readFileSync(htmlPath, 'utf8');
const js = fs.existsSync(jsPath) ? fs.readFileSync(jsPath, 'utf8') : '';
const css = fs.readFileSync(cssPath, 'utf8');

// 1) Duplicate ids break getElementById and querySelector("#x") scoping.
const ids = [];
const idRe = /\sid="([^"]+)"/g;
let m;
while ((m = idRe.exec(html)) !== null) ids.push(m[1]);
const seen = {};
const duplicates = [];
ids.forEach((id) => {
    seen[id] = (seen[id] || 0) + 1;
    if (seen[id] === 2) duplicates.push(id);
});
check(duplicates.length === 0, 'index.html has duplicate id(s): ' + duplicates.join(', '));

// 2) The old #selectform hook (category/source dialogs) is fully gone.
check(!/id="selectform"/.test(html), 'index.html still uses id="selectform"');
check(!/id="selectform"/.test(js), 'js/index.js still emits id="selectform" in a template');
check(!/class="[^"]*\bselectform\b/.test(html), 'index.html still uses the removed class="selectform"');
check(!/\.selectform\s*\{/m.test(css), 'css/style.css still carries the orphaned .selectform rule');
check((html.match(/<div class="source-options" data-source-type="movie">/g) || []).length === 1,
    'index.html must declare exactly one movie source-options container');

// 4) label[for] must resolve, otherwise clicking the text does nothing.
const forTargets = [];
const forRe = /<label[^>]*\sfor="([^"]+)"/g;
while ((m = forRe.exec(html)) !== null) forTargets.push(m[1]);
const danglingFor = forTargets.filter((t) => ids.indexOf(t) === -1);
check(danglingFor.length === 0, 'index.html <label for> points at missing id(s): ' + danglingFor.join(', '));

// 5) The install prompt is a flat list; a wrapper div here has no CSS behind it.
check(!/class="install-content"/.test(html), 'index.html reintroduced the unstyled .install-content wrapper');

// 6) The GO! flow was removed: it indexed .stylebtn by position (0 = GO!, 2 =
//    TV entry, 4 = radio entry) and pointed at pages deleted in V8.2.1, so it
//    either did nothing or navigated to a 404.
check(!/stylebtns\[\d\]/.test(js), 'js/index.js indexes .stylebtn by position again (state machine is dead code)');
check(!/routes\/(countries|language|category)\.html/.test(js),
    'js/index.js links to routes/countries|language|category.html - those pages were deleted in V8.2.1');
check(!/id="popupbox"/.test(html), 'index.html reintroduced the dead #popupbox category dialog');

// 7) translations.js must not label buttons by position either: a positional
//    loop overwrote icon buttons with text (it turned the source dialog's
//    Next arrow into "GO!" once the first .stylebtn moved).
const transPath = path.join(root, 'js', 'translations.js');
const trans = fs.existsSync(transPath) ? fs.readFileSync(transPath, 'utf8') : '';
check(!/styleButtons\[\d\]/.test(trans), 'js/translations.js indexes .stylebtn by position again');
check(!/buttonFirst/.test(trans), 'js/translations.js reintroduced the unused buttonFirst (GO!) label');
check(/querySelector\('img, svg'\)|querySelector\("img, svg"\)/.test(trans),
    'js/translations.js must skip icon buttons when writing .stylebtn text');

// 8) Source Control: the old #sourcebox dialog flow is gone, the settings
//    panel renders the source lists from SourceConfig, and the per-tab custom
//    sources exist only for movie and porn (the only consumers that accept an
//    arbitrary Apple CMS vod endpoint).
check(!/goToSource|returnSource/.test(js), 'js/index.js resurrected the deleted goToSource/returnSource flow');
check(!/id="sourcebox"/.test(html), 'index.html reintroduced the #sourcebox dialog');
check((html.match(/<div class="source-options(?: hidden)?" data-source-type="movie">/g) || []).length === 1,
    'index.html must declare exactly one movie source-options container');
const deadSourceIds = ['royalroad', 'hetushu', 'mangadex', 'mangapill', 'wymusic'];
const stillListed = deadSourceIds.filter((id) => html.indexOf('value="' + id + '"') !== -1 || trans.indexOf('"' + id + '":') !== -1);
check(stillListed.length === 0,
    'dead source ids with no consumer came back in index.html/translations.js: ' + stillListed.join(', '));
const srcConf = fs.existsSync(path.join(root, 'js', 'source-config.js'))
    ? fs.readFileSync(path.join(root, 'js', 'source-config.js'), 'utf8') : '';
check(!!srcConf, 'js/source-config.js is missing');
check(/getBuiltins: function/.test(srcConf) && /getEnabled: function/.test(srcConf) && /isValidUrl: function/.test(srcConf),
    'js/source-config.js lost its getBuiltins/getEnabled/isValidUrl API');
check(/getEnabled\('movie'\)/.test(fs.readFileSync(path.join(root, 'js', 'tocomprehensive.js'), 'utf8')) &&
      /getEnabled\('porn'\)/.test(fs.readFileSync(path.join(root, 'js', 'toadult.js'), 'utf8')),
    'tocomprehensive.js/toadult.js no longer merge enabled custom sources');
check(/getMusicApiBase/.test(fs.readFileSync(path.join(root, 'js', 'apiproxy.js'), 'utf8')),
    'js/apiproxy.js must source the music API base via getMusicApiBase()');
check(/SourceSettings\.render\(\)/.test(js) && /SourceSettings\.bindEvents\(\)/.test(js),
    'js/index.js must render and bind SourceSettings in initSourceControl');

// YouTube Source Control tab: custom channel RSS feeds power Theater's
// yt-rss: source, while the built-in Blender catalogue stays untouched.
check((html.match(/<div class="source-options(?: hidden)?" data-source-type="youtube">/g) || []).length === 1,
    'index.html must declare exactly one youtube source-options container');
check(/data-source-type="youtube"[^>]*data-i18n="source_type_youtube"/.test(html),
    'Source Control has no YouTube tab button');
check(/'youtube'/.test(srcConf) && /isValidYouTubeFeedUrl/.test(srcConf),
    'source-config.js lost the YouTube custom-source type/validator');
check(/channel_id=UCSMOQeBJ2RAnuFungnQOxLg/.test(srcConf) && /channel_id=UCz75RVbH8q2jdBJ4SnwuZZQ/.test(srcConf),
    'source-config.js is missing the two built-in YouTube channel RSS feeds');
check(/getBuiltins\('youtube'\)/.test(fs.readFileSync(path.join(root, 'js', 'tocomprehensive.js'), 'utf8')),
    'Theater does not expose the built-in YouTube channels as yt-rss sources');
check(/isValidYouTubeFeedUrl/.test(js), 'js/index.js does not validate YouTube RSS URLs');
check(/yt-rss:/.test(fs.readFileSync(path.join(root, 'js', 'tocomprehensive.js'), 'utf8')) &&
      /yt-rss:/.test(fs.readFileSync(path.join(root, 'js', 'comprehensive.js'), 'utf8')),
    'Theater does not handle yt-rss: YouTube channel sources');
check((trans.match(/source_type_youtube/g) || []).length >= 90,
    'source_type_youtube is missing from the translated languages');

console.log(failed === 0 ? 'index DOM check: ALL OK' : 'index DOM check: ' + failed + ' problem(s)');
process.exit(failed === 0 ? 0 : 1);
