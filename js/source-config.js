/**
 * Unified source catalogue for Settings > Source Control.
 *
 * Two responsibilities:
 *   1. BUILTIN_SOURCES - the read-only catalogue behind the settings panel's
 *      per-tab lists (name + URL + enable checkbox). The ids match each page's
 *      own source map (movieSources/pornSources in tocomprehensive.js and
 *      toadult.js, NOVEL_SOURCES in tonovel.js, MANGA_SOURCES in tomanga.js,
 *      MUSIC_SOURCES in apiproxy.js) so the saved localStorage keys stay
 *      compatible.
 *   2. Custom sources - Apple CMS "vod" collection APIs the user adds for the
 *      movie and porn tabs (the only consumers whose fetch path accepts an
 *      arbitrary endpoint of that shape). Stored in localStorage as
 *      { movie: [{id,name,url,enabled}], porn: [...] }.
 *
 * Load this script BEFORE js/index.js and any consumer page script. Plain
 * global, no module system, matching the codebase style.
 */
const BUILTIN_SOURCES = {
    movie: [
        { id: 'archive_classic', name: 'Classic Movies (Public Domain)', lang: 'en', url: 'https://archive.org' },
        { id: 'youtube_blender', name: 'YouTube (Blender open movies)', lang: 'en', url: 'https://youtube-nocookie.com' },
        { id: 'hnzy', name: '红牛资源', lang: 'zh', url: 'https://www.hongniuzy2.com/api.php/provide/vod/at/json/' },
        { id: 'bjy', name: '如意资源', lang: 'zh', url: 'https://cj.rycjapi.com/api.php/provide/vod/at/json/' },
        { id: 'ikun', name: '爱坤资源', lang: 'zh', url: 'https://ikunzyapi.com/api.php/provide/vod/at/json' },
        { id: 'c621', name: '360资源', lang: 'zh', url: 'https://360zy.com/api.php/provide/vod/' }
    ],
    porn: [
        { id: 'slapibf', name: '森林资源站', url: 'https://slapibf.com/api.php/provide/vod/at/json' },
        { id: 'lbapi9', name: '乐播资源站', url: 'https://lbapi9.com/api.php/provide/vod/at/json' },
        { id: '155api', name: '155资源站', url: 'https://155api.com/api.php/provide/vod/at/json' },
        { id: 'apilsbzy2', name: '老色逼', url: 'https://apilsbzy2.com/api.php/provide/vod/at/json' },
        { id: 'nxx', name: '奶昔资源站', url: 'https://naixxzy.com/api.php/provide/vod/at/json' },
        { id: 'sk', name: '艾欧资源站', url: 'https://aosikazy.com/api.php/provide/vod/at/json' },
        { id: 'ck', name: 'CK资源站', url: 'https://ckzy.me/api.php/provide/vod/at/json' },
        { id: 'cj', name: '初见资源站', url: 'http://chujia.cc/api.php/provide/vod/at/json' }
    ],
    novel: [
        { id: 'gutendex', name: 'Gutendex (Gutenberg)', url: 'https://gutendex.com/books' },
        { id: 'openlibrary', name: 'Open Library', url: 'https://openlibrary.org/search.json' },
        { id: 'poetrydb', name: 'PoetryDB', url: 'https://poetrydb.org' },
        { id: 'bible', name: 'Bible API', url: 'https://bible-api.com' }
    ],
    manga: [
        { id: 'jikan', name: 'Jikan (Manga)', url: 'https://api.jikan.moe/v4' },
        { id: 'xkcd', name: 'xkcd Comics', url: 'https://xkcd.com' }
    ],
    music: [
        { id: 'netease', name: 'NetEase Cloud Music', url: 'http://iwenwiki.com:3000' }
    ]
};

const SourceConfig = {
    KEY: 'ewtv-custom-sources',
    TYPES: ['movie', 'porn'],

    getBuiltins: function(type) {
        return (BUILTIN_SOURCES[type] || []).slice();
    },

    getAll: function() {
        try {
            var raw = window.localStorage.getItem(this.KEY);
            var data = raw ? JSON.parse(raw) : null;
            return (data && typeof data === 'object' && !Array.isArray(data)) ? data : {};
        } catch (e) {
            return {};
        }
    },

    get: function(type) {
        var all = this.getAll();
        return Array.isArray(all[type]) ? all[type] : [];
    },

    save: function(type, list) {
        var all = this.getAll();
        all[type] = list;
        try {
            window.localStorage.setItem(this.KEY, JSON.stringify(all));
            return true;
        } catch (e) {
            return false;
        }
    },

    add: function(type, name, url) {
        var item = {
            id: 'custom-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
            name: String(name || '').trim() || 'Custom source',
            url: String(url || '').trim(),
            enabled: true
        };
        var list = this.get(type);
        list.push(item);
        this.save(type, list);
        return item;
    },

    update: function(type, id, patch) {
        var list = this.get(type);
        for (var i = 0; i < list.length; i++) {
            if (list[i].id === id) {
                if (patch.name !== undefined) list[i].name = String(patch.name).trim() || list[i].name;
                if (patch.url !== undefined) list[i].url = String(patch.url).trim();
                if (patch.enabled !== undefined) list[i].enabled = !!patch.enabled;
                break;
            }
        }
        this.save(type, list);
    },

    remove: function(type, id) {
        this.save(type, this.get(type).filter(function(item) { return item.id !== id; }));
    },

    // Enabled custom sources of a type, for the consumer pages.
    getEnabled: function(type) {
        return this.get(type).filter(function(item) {
            return item && item.enabled && item.url;
        });
    },

    // Basic validation for user-entered collection API endpoints.
    isValidUrl: function(url) {
        try {
            var u = new URL(String(url));
            return (u.protocol === 'https:' || u.protocol === 'http:');
        } catch (e) {
            return false;
        }
    }
};
