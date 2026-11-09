// Shared helper: keeps the --header-height CSS variable in sync with the
// actual rendered height of the fixed page header.
//
// Problem: on narrow screens the fixed header wraps to multiple rows and grows
// taller than the hardcoded 70px offset, so fixed-position content (cards,
// sidebars) gets covered by the header.
//
// Fix: pages use var(--header-height, 70px) for content offsets; this script
// measures the real header height (including wrapped rows) and updates the
// variable whenever it changes (viewport resize, orientation change, reflow).
(function() {
    var HEADER_SELECTOR = '.header, .top-header, .tv-header, .radio-header';

    function getHeader() {
        return document.querySelector(HEADER_SELECTOR);
    }

    function updateHeaderHeight() {
        var header = getHeader();
        if (!header) return;
        var h = header.offsetHeight;
        if (h > 0) {
            document.documentElement.style.setProperty('--header-height', h + 'px');
        }
    }

    function init() {
        updateHeaderHeight();

        // React to any header size change (text wrap, font load, rotation...)
        if (typeof ResizeObserver !== 'undefined') {
            var header = getHeader();
            if (header) {
                new ResizeObserver(updateHeaderHeight).observe(header);
            }
        }

        window.addEventListener('resize', updateHeaderHeight);
        window.addEventListener('orientationchange', updateHeaderHeight);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
