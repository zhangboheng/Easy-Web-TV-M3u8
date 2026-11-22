/**
 * Multi-language translator
 * Responsible for detecting browser language and applying corresponding translations
 */

(function() {
    'use strict';

    /**
     * Get browser preferred language
     * @returns {string} Language code
     */
    function getBrowserLanguage() {
        const lang = navigator.language || navigator.userLanguage || 'en';
        return lang;
    }

    /**
     * Get stored language or browser language
     * @returns {string} Language code
     */
    function getStoredLanguage() {
        // Check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang) {
            localStorage.setItem('preferredLanguage', urlLang);
            localStorage.setItem('languages', urlLang);
            return urlLang;
        }
        
        // Check localStorage - try both keys for compatibility
        const preferredLang = localStorage.getItem('preferredLanguage');
        const languagesLang = localStorage.getItem('languages');
        
        // Use preferredLanguage if set, otherwise use languages, otherwise browser language
        if (preferredLang) {
            return preferredLang;
        }
        if (languagesLang) {
            // Sync preferredLanguage with languages for consistency
            localStorage.setItem('preferredLanguage', languagesLang);
            return languagesLang;
        }
        
        // Use browser language
        const browserLang = getBrowserLanguage();
        // Save to both keys for consistency
        localStorage.setItem('preferredLanguage', browserLang);
        localStorage.setItem('languages', browserLang);
        return browserLang;
    }

    /**
     * Initialize language selector
     */
    function initLanguageSelector() {
        // Initialize both language selectors (main page and settings modal)
        const mainSelector = document.getElementById('languages');
        const settingsSelector = document.getElementById('settings-languages');
        
        // Set current selected item
        const currentLang = getStoredLanguage();
        const normalizedLang = typeof getNormalizedLanguage === 'function' 
            ? getNormalizedLanguage(currentLang) 
            : currentLang;
        
        // Sync both selectors with the same value
        if (mainSelector) {
            mainSelector.value = normalizedLang;
            
            // Bind change event for main selector
            mainSelector.addEventListener('change', function() {
                const selectedLang = this.value;
                window.setLanguage(selectedLang);
                // Sync settings selector
                if (settingsSelector) {
                    settingsSelector.value = selectedLang;
                }
            });
        }
        
        if (settingsSelector) {
            settingsSelector.value = normalizedLang;
            
            // Bind change event for settings selector
            settingsSelector.addEventListener('change', function() {
                const selectedLang = this.value;
                window.setLanguage(selectedLang);
                // Sync main selector
                if (mainSelector) {
                    mainSelector.value = selectedLang;
                }
            });
        }
    }

    /**
     * Initialize translation
     */
    function initTranslation() {
        const lang = getStoredLanguage();
        if (typeof applyTranslation === 'function') {
            applyTranslation(lang);
        }
        // Initialize language selector
        initLanguageSelector();
    }

    // Initialize after DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTranslation);
    } else {
        initTranslation();
    }

    // Expose global methods for external calls
    window.setLanguage = function(lang) {
        // Save to both keys for consistency across the application
        localStorage.setItem('preferredLanguage', lang);
        localStorage.setItem('languages', lang);
        
        if (typeof applyTranslation === 'function') {
            applyTranslation(lang);
        }
        
        // Re-render the settings lists whose texts are built inline via
        // ProxySettings.t() (proxy + source control pages): applyTranslation
        // only covers static [data-i18n] elements, so a language switch would
        // otherwise leave these rendered texts in the previous language.
        if (typeof ProxySettings !== 'undefined' && ProxySettings.render) {
            ProxySettings.render();
        }
        if (typeof SourceSettings !== 'undefined' && SourceSettings.render) {
            SourceSettings.render();
            // render() rebuilds the checkbox DOM with all boxes checked. Restore
            // the user's saved source selection so a language switch never
            // silently changes which sources are enabled.
            if (typeof SettingsModal !== 'undefined' && SettingsModal.loadSavedSources) {
                SettingsModal.loadSavedSources();
            }
        }
        
        // Update both selectors display
        const mainSelector = document.getElementById('languages');
        const settingsSelector = document.getElementById('settings-languages');
        if (mainSelector) {
            mainSelector.value = lang;
        }
        if (settingsSelector) {
            settingsSelector.value = lang;
        }
    };

    window.getCurrentLanguage = function() {
        return getStoredLanguage();
    };

})();
