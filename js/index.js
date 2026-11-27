/**
 * Easy Web TV - Main Application
 * Native JavaScript (No jQuery)
 * @version 8.6.3
 */

// Keep the visible version badge in sync with js/version.js (v8.6.3).
document.addEventListener('DOMContentLoaded', function () {
    var el = document.getElementById('app-version');
    if (el && window.EWTV_VERSION) el.textContent = window.EWTV_VERSION;
});

// Adult content translations for all supported languages
const AdultTranslations = {
    getButtonText: function(lang) {
        var translations = {
            'default': 'Enter',
            'zh': '进入', 'zh-CN': '进入', 'zh-HK': '進入', 'zh-TW': '進入',
            'ja': '入力', 'ko': '입력하다', 'vi': 'Vào', 'th': 'เข้า',
            'es': 'Ingresar', 'pt': 'Digitar', 'pt-BR': 'Digitar', 'pt-PT': 'Digitar',
            'fr': 'Entrer', 'fr-CA': 'Entrer', 'fr-FR': 'Entrer', 'fr-CH': 'Entrer',
            'de': 'Eintreten', 'de-AT': 'Eintreten', 'de-DE': 'Eintreten', 'de-CH': 'Eintreten',
            'it': 'accedere', 'it-IT': 'accedere', 'it-CH': 'accedere',
            'ru': 'Входить', 'ar': 'يدخل', 'hi': 'प्रवेश करना',
            'tr': 'Girmek', 'pl': 'Wejść', 'nl': 'Binnenkomen', 'sv': 'Stiga på',
            'da': 'Gå ind', 'no': 'Tast inn', 'nb': 'Tast inn', 'nn': 'Tast inn',
            'fi': 'Tulla sisään', 'el': 'Εισαγω', 'cs': 'Vstupte', 'sk': 'Zadajte',
            'hu': 'Belép', 'ro': 'introduce', 'bg': 'Въведете', 'uk': 'Введіть',
            'id': 'Memasuki', 'ms': 'Masukkan', 'fil': 'Pasok', 'vi': 'Vào',
            'he': 'להיכנס', 'fa': 'وارد', 'ur': 'داخل کریں۔', 'bn': 'প্রবেশ করুন',
            'ta': 'உள்ளிடவும்', 'te': 'నమోదు చేయండి', 'ml': 'നൽകുക', 'kn': 'ನಮೂದಿಸಿ',
            'mr': 'एंटर करा', 'gu': 'દાખલ કરો', 'pa': 'ਦਾਖਲ ਕਰੋ', 'or': 'ପ୍ରବେଶ କରନ୍ତୁ |'
        };
        return translations[lang] || translations['default'];
    },
    
    getDescriptionText: function(lang) {
        var translations = {
            'default': 'Porn Videos...',
            'zh': '色情视频...', 'zh-CN': '色情视频...', 'zh-HK': '色情影片...', 'zh-TW': '色情影片...',
            'ja': 'ポルノビデオ...', 'ko': '포르노 비디오...', 'vi': 'Video khiêu dâm ...', 'th': 'วิดีโอโป๊...',
            'es': 'Vídeos porno ...', 'pt': 'Vídeos pornôs ...', 'pt-BR': 'Vídeos pornô...', 'pt-PT': 'Vídeos pornô...',
            'fr': 'Vidéos porno...', 'fr-CA': 'Vidéos porno...', 'fr-FR': 'Vidéos porno...', 'fr-CH': 'Vidéos porno...',
            'de': 'Pornovideos...', 'de-AT': 'Pornovideos...', 'de-DE': 'Pornovideos...', 'de-CH': 'Pornovideos...',
            'it': 'Video porno...', 'it-IT': 'Video porno...', 'it-CH': 'Video porno...',
            'ru': 'Порно видео ...', 'ar': 'أشرطة الفيديو الإباحية ...', 'hi': 'अश्लील वीडियो...',
            'tr': 'Video porno...', 'pl': 'Filmy porno...', 'nl': 'Video porno...', 'sv': 'Videoporr ...',
            'da': 'Videoporno ...', 'no': 'Video porno ...', 'nb': 'Video porno ...', 'nn': 'Video porno ...',
            'fi': 'Video porno ...', 'el': 'Βίντεο πορνό ...', 'cs': 'Video porno ...', 'sk': 'Video porno ...',
            'hu': 'Videó pornó ...', 'ro': 'Video porno ...', 'bg': 'Порно видео ...', 'uk': 'Відео порно ...',
            'id': 'Video porno...', 'ms': 'Video lucah ...', 'fil': 'Video porn ...',
            'he': 'פורנו וידאו ...', 'fa': 'فیلم پورنو ...', 'ur': 'ویڈیو فحش ...', 'bn': 'ভিডিও পর্ন ...',
            'ta': 'வீடியோ ஆபாச ...', 'te': 'వీడియో పోర్న్ ...', 'ml': 'വീഡിയോ പോൺ ...', 'kn': 'ವಿಡಿಯೋ ಪೋರ್ನ್ ...',
            'mr': 'व्हिडिओ पॉर्न ...', 'gu': 'વિડિઓ પોર્ન ...', 'pa': 'ਵੀਡੀਓ ਪੋਰਨ ...'
        };
        return translations[lang] || translations['default'];
    }
};

const ConfirmDialog = {
    hasModal: function() {
        return false;
    },

    show: function(title, message, onConfirm, confirmLabel, cancelLabel, danger) {
        // The themed ConfirmModal is attached to window by the app shell.
        if (typeof window.ConfirmModal !== 'undefined' && typeof window.ConfirmModal.show === 'function') {
            window.ConfirmModal.show(title, message, onConfirm, confirmLabel, cancelLabel, danger);
        } else if (onConfirm) {
            onConfirm();
        }
    }
};

// Themed confirmation modal - replaces browser-native confirm/alert dialogs.
const ConfirmModal = {
    onConfirm: null,

    init: function() {
        DOM.on('#confirm-modal-ok', 'click', function() {
            var callback = ConfirmModal.onConfirm;
            ConfirmModal.hide();
            if (callback) callback();
        });
        DOM.on('#confirm-modal-cancel', 'click', function() {
            ConfirmModal.hide();
        });
        DOM.on('#confirm-modal-overlay', 'click', function() {
            ConfirmModal.hide();
        });
        document.addEventListener('keydown', function(e) {
            if (e.key !== 'Escape' || !DOM.hasClass('#confirm-modal', 'show')) return;
            e.preventDefault();
            ConfirmModal.hide();
        });
    },

    show: function(title, message, onConfirm, confirmLabel, cancelLabel, danger) {
        var modal = DOM.$('#confirm-modal');
        var overlay = DOM.$('#confirm-modal-overlay');
        if (!modal || !overlay) {
            // Should never happen in the app shell, but keep behavior sane.
            if (onConfirm) onConfirm();
            return;
        }
        this.onConfirm = onConfirm || null;
        var titleEl = DOM.$('#confirm-modal-title');
        var messageEl = DOM.$('#confirm-modal-message');
        var okBtn = DOM.$('#confirm-modal-ok');
        var cancelBtn = DOM.$('#confirm-modal-cancel');
        if (titleEl) titleEl.textContent = title || 'Confirm';
        if (messageEl) messageEl.textContent = message || '';
        if (okBtn) okBtn.textContent = confirmLabel || 'Confirm';
        if (cancelBtn) cancelBtn.textContent = cancelLabel || 'Cancel';
        DOM.toggleClass(okBtn, 'danger', Boolean(danger));
        DOM.toggleClass(modal, 'danger', Boolean(danger));
        DOM.addClass(overlay, 'show');
        DOM.addClass(modal, 'show');
        modal.setAttribute('aria-hidden', 'false');
        overlay.setAttribute('aria-hidden', 'false');
        if (okBtn) okBtn.focus();
    },

    hide: function() {
        var modal = DOM.$('#confirm-modal');
        var overlay = DOM.$('#confirm-modal-overlay');
        this.onConfirm = null;
        DOM.removeClass(modal, 'show');
        DOM.removeClass(overlay, 'show');
        if (modal) modal.setAttribute('aria-hidden', 'true');
        if (overlay) overlay.setAttribute('aria-hidden', 'true');
    }
};

// Expose for catalogues (novel/music) that do not load the app shell.
window.ConfirmModal = ConfirmModal;

// Catalogues include this file without style.css; keep the shared modal themed.
if (!DOM.$('#confirm-modal-styles')) {
    var modalStyle = document.createElement('style');
    modalStyle.id = 'confirm-modal-styles';
    modalStyle.textContent = [
        '.confirm-modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.8);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);z-index:11000;display:none}',
        '.confirm-modal-overlay.show{display:block}',
        '.confirm-modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(.95);width:calc(100% - 40px);max-width:420px;padding:28px 24px 24px;border-radius:20px;background:linear-gradient(180deg,#1f1f1f,#1a1a1a);border:1px solid rgba(255,255,255,.08);box-shadow:0 20px 60px rgba(0,0,0,.6),0 0 0 1px rgba(163,0,27,.25);color:#fff;text-align:center;z-index:11001;display:none;opacity:0;transition:opacity .2s ease,transform .2s ease}',
        '.confirm-modal.show{display:block;opacity:1;transform:translate(-50%,-50%) scale(1)}',
        '.confirm-modal-icon{display:flex;align-items:center;justify-content:center;width:56px;height:56px;margin:0 auto 16px;border-radius:50%;background:rgba(163,0,27,.16);color:#ff4d5e}',
        '.confirm-modal h3{margin:0 0 12px;font-size:20px}',
        '.confirm-modal p{margin:0 0 24px;color:rgba(255,255,255,.7);font-size:14px;line-height:1.6}',
        '.confirm-modal-actions{display:flex;gap:12px;justify-content:center}',
        '.confirm-modal-btn{min-width:110px;padding:10px 18px;border:1px solid rgba(255,255,255,.14);border-radius:10px;background:rgba(255,255,255,.06);color:#fff;font-size:14px;cursor:pointer}',
        '.confirm-modal-btn:hover{background:rgba(255,255,255,.12)}',
        '.confirm-modal-btn.primary{background:#a3001b;border-color:#a3001b}',
        '.confirm-modal-btn.primary:hover{background:#c40022}',
        '[data-theme="dark"] .confirm-modal{background:linear-gradient(180deg,#2a2a2a,#202020)}'
    ].join('');
    (document.head || document.documentElement).appendChild(modalStyle);
}
if (!DOM.$('#confirm-modal')) {
    var modalOverlay = document.createElement('div');
    modalOverlay.id = 'confirm-modal-overlay';
    modalOverlay.className = 'confirm-modal-overlay';
    modalOverlay.setAttribute('aria-hidden', 'true');
    var modal = document.createElement('div');
    modal.id = 'confirm-modal';
    modal.className = 'confirm-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-labelledby', 'confirm-modal-title');
    modal.innerHTML = '<div class="confirm-modal-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg></div><h3 id="confirm-modal-title">Confirm</h3><p id="confirm-modal-message"></p><div class="confirm-modal-actions"><button id="confirm-modal-cancel" class="confirm-modal-btn">Cancel</button><button id="confirm-modal-ok" class="confirm-modal-btn primary">Confirm</button></div>';
    if (document.body) {
        document.body.appendChild(modalOverlay);
        document.body.appendChild(modal);
    }
}
// Loading and Error handling utilities
const LoadingManager = {
    show: function() {
        DOM.addClass('#loading-overlay', 'active');
    },
    hide: function() {
        DOM.removeClass('#loading-overlay', 'active');
    }
};

const ErrorToast = {
    show: function(message, duration) {
        duration = duration || 3000;
        var toast = DOM.$('#error-toast');
        var errorMsg = DOM.find(toast, '.error-message');
        if (errorMsg) {
            errorMsg.textContent = message;
        }
        DOM.addClass(toast, 'show');
        setTimeout(function() {
            DOM.removeClass(toast, 'show');
        }, duration);
    },
    hide: function() {
        DOM.removeClass('#error-toast', 'show');
    }
};

// Keyboard Navigation Manager
const KeyboardManager = {
    modalVisible: false,
    
    // Category routes for quick navigation
    categoryRoutes: {
        1: 'routes/tv.html',              // TV Channels
        2: 'routes/comprehensive.html',   // Movies & Series
        3: 'routes/radio.html?t=1',       // Radio Stations
        4: 'routes/novel.html',           // Novels
        5: 'routes/manga.html',           // Manga
        6: 'routes/music.html',           // Music
        7: 'routes/game.html'             // Games
    },
    
    init: function() {
        this.bindEvents();
        this.checkFirstVisit();
    },
    
    bindEvents: function() {
        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // Ignore shortcuts when typing in input fields.
            // e.target may be a Document/Window when the event is dispatched
            // programmatically, and those do not implement matches().
            var target = e.target;
            if (target instanceof Element && target.matches('input, textarea, select')) {
                return;
            }
            
            // Number keys 1-7 for quick navigation
            if (e.key >= '1' && e.key <= '7') {
                KeyboardManager.navigateToCategory(parseInt(e.key));
                e.preventDefault();
                return;
            }
            
            // Show keyboard help with ?
            if (e.key === '?' && !KeyboardManager.modalVisible) {
                KeyboardManager.showModal();
                e.preventDefault();
                return;
            }
            
            // Close modal/menu with ESC
            if (e.key === 'Escape') {
                KeyboardManager.closeAll();
                return;
            }
            
            // Toggle menu with M
            if (e.key === 'm' || e.key === 'M') {
                KeyboardManager.toggleMenu();
                e.preventDefault();
                return;
            }
            
            // Toggle theme with T
            if (e.key === 't' || e.key === 'T') {
                ThemeManager.toggleTheme();
                e.preventDefault();
                return;
            }
            
            // Share with S
            if (e.key === 's' || e.key === 'S') {
                ShareManager.share();
                e.preventDefault();
                return;
            }
        });
        
        // Close modal on overlay click
        DOM.on('#keyboard-modal-overlay', 'click', function() {
            KeyboardManager.hideModal();
        });
        
        // Close modal on close button click
        DOM.on('#keyboard-modal .close-btn', 'click', function() {
            KeyboardManager.hideModal();
        });
        
        // Close guide tooltip
        DOM.on('#guide-tooltip .close-guide', 'click', function() {
            KeyboardManager.hideGuide();
            localStorage.setItem('guideShown', 'true');
        });
        
        // Keyboard help button in header
        DOM.on('#keyboard-help-btn', 'click', function(e) {
            e.stopPropagation();
            KeyboardManager.showModal();
        });
    },
    
    navigateToCategory: function(index) {
        var route = this.categoryRoutes[index];
        if (route) {
            // Show loading indicator
            LoadingManager.show();
            // Navigate to the category
            window.location.href = route;
        }
    },
    
    showModal: function() {
        DOM.addClass('#keyboard-modal', 'show');
        DOM.addClass('#keyboard-modal-overlay', 'show');
        this.modalVisible = true;
    },
    
    hideModal: function() {
        DOM.removeClass('#keyboard-modal', 'show');
        DOM.removeClass('#keyboard-modal-overlay', 'show');
        this.modalVisible = false;
    },
    
    closeAll: function() {
        // Close keyboard modal
        this.hideModal();
        
        // Close side navigation
        var sidenav = DOM.$('#mySidenav');
        var main = DOM.$('#main');
        var btn = DOM.$('#menu-toggle-btn');
        
        if (DOM.isVisible(sidenav)) {
            main.style.marginRight = '0';
            DOM.hide(sidenav);
            btn.setAttribute('aria-expanded', 'false');
        }
        
        // Close any open dialogs
        var logbox = DOM.$('#logbox');
        var infobox = DOM.$('#infobox');
        
        if (logbox && DOM.isVisible(logbox)) {
            window.location.href = '#';
        }
        if (infobox && DOM.isVisible(infobox)) {
            window.location.href = '#';
        }
        
        // Close age confirmation modal
        var ageModal = DOM.$('#age-confirm-modal');
        var ageOverlay = DOM.$('#age-confirm-overlay');
        if (DOM.hasClass(ageModal, 'show')) {
            DOM.removeClass(ageModal, 'show');
            DOM.removeClass(ageOverlay, 'show');
        }
    },
    
    toggleMenu: function() {
        var sidenav = DOM.$('#mySidenav');
        var main = DOM.$('#main');
        var btn = DOM.$('#menu-toggle-btn');
        
        if (DOM.isVisible(sidenav)) {
            main.style.marginRight = '0';
            DOM.hide(sidenav);
            btn.setAttribute('aria-expanded', 'false');
        } else {
            if (window.innerWidth > 640) {
                main.style.marginRight = '400px';
            } else {
                main.style.marginRight = '250px';
            }
            DOM.show(sidenav);
            btn.setAttribute('aria-expanded', 'true');
        }
    },
    
    checkFirstVisit: function() {
        // Show guide tooltip on first visit
        if (!localStorage.getItem('guideShown')) {
            setTimeout(function() {
                DOM.addClass('#guide-tooltip', 'show');
                // Auto hide after 8 seconds (longer for better visibility)
                setTimeout(function() {
                    KeyboardManager.hideGuide();
                    localStorage.setItem('guideShown', 'true');
                }, 8000);
            }, 1500);
        }
    },
    
    hideGuide: function() {
        DOM.removeClass('#guide-tooltip', 'show');
    }
};

// Theme Manager - Dark/Light mode toggle
const ThemeManager = {
    init: function() {
        this.loadSavedTheme();
        this.bindEvents();
    },
    
    loadSavedTheme: function() {
        var savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    },
    
    setTheme: function(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        localStorage.setItem('theme', theme);
    },
    
    toggleTheme: function() {
        var currentTheme = localStorage.getItem('theme') || 'light';
        var newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    },
    
    bindEvents: function() {
        // Theme toggle button in menu
        DOM.on('#theme-toggle-menu', 'click', function() {
            ThemeManager.toggleTheme();
        });
        
        // Theme toggle button in header
        DOM.on('#theme-toggle', 'click', function(e) {
            e.stopPropagation();
            ThemeManager.toggleTheme();
        });
    }
};

// Share Manager - Web Share API
const ShareManager = {
    init: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
        // Share button in menu
        DOM.on('#share-btn-menu', 'click', function() {
            ShareManager.share();
        });
        
        // Share button in header
        DOM.on('#share-btn', 'click', function(e) {
            e.stopPropagation();
            ShareManager.share();
        });
    },
    
    share: function() {
        var shareData = {
            title: 'Easy Web TV - Online SmartTV',
            text: 'Watch 6000+ TV channels, movies, series, anime, listen to 28000+ radio stations, read novels, manga, and play games!',
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData)
                .then(function() {
                    console.log('Shared successfully');
                })
                .catch(function(err) {
                    console.error('Share failed:', err);
                    ShareManager.fallbackShare();
                });
        } else {
            ShareManager.fallbackShare();
        }
    },
    
    fallbackShare: function() {
        // Fallback: copy URL to clipboard
        var url = window.location.href;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url)
                .then(function() {
                    ErrorToast.show('Link copied to clipboard!', 2000);
                })
                .catch(function(err) {
                    console.error('Clipboard write failed:', err);
                    ShareManager.legacyCopy(url);
                });
        } else {
            ShareManager.legacyCopy(url);
        }
    },
    
    legacyCopy: function(text) {
        var textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            ErrorToast.show('Link copied to clipboard!', 2000);
        } catch (err) {
            console.error('Legacy copy failed:', err);
            ErrorToast.show('Share not supported on this device', 3000);
        }
        
        document.body.removeChild(textArea);
    }
};

// PWA Install Manager
const InstallManager = {
    deferredPrompt: null,
    
    init: function() {
        this.bindEvents();
        this.listenForPrompt();
    },
    
    listenForPrompt: function() {
        window.addEventListener('beforeinstallprompt', function(e) {
            e.preventDefault();
            InstallManager.deferredPrompt = e;
            
            // Show install prompt after a delay
            setTimeout(function() {
                if (!localStorage.getItem('pwaInstallDismissed')) {
                    DOM.addClass('#install-prompt', 'show');
                }
            }, 3000);
        });
        
        // Listen for successful installation
        window.addEventListener('appinstalled', function() {
            InstallManager.deferredPrompt = null;
            DOM.removeClass('#install-prompt', 'show');
            ErrorToast.show('App installed successfully!', 3000);
        });
    },
    
    bindEvents: function() {
        DOM.on('#install-accept', 'click', function() {
            InstallManager.install();
        });
        
        DOM.on('#install-dismiss', 'click', function() {
            InstallManager.dismiss();
        });
    },
    
    install: function() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            this.deferredPrompt.userChoice
                .then(function(choiceResult) {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    } else {
                        console.log('User dismissed the install prompt');
                    }
                    InstallManager.deferredPrompt = null;
                    DOM.removeClass('#install-prompt', 'show');
                });
        }
    },
    
    dismiss: function() {
        DOM.removeClass('#install-prompt', 'show');
        localStorage.setItem('pwaInstallDismissed', 'true');
    }
};

// Scroll Animation Manager
const ScrollAnimationManager = {
    init: function() {
        this.observeElements();
    },
    
    observeElements: function() {
        // Use Intersection Observer for fade-in animations
        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            DOM.$$('.fade-in').forEach(function(el) {
                observer.observe(el);
            });
        } else {
            // Fallback for browsers without Intersection Observer
            DOM.$$('.fade-in').forEach(function(el) {
                el.classList.add('visible');
            });
        }
    }
};

// Update Adult Content Item text when language changes
function updateAdultContentItem(lang) {
    var adultItem = document.querySelector('li[data-adult="true"]');
    if (adultItem) {
        var buttonText = AdultTranslations.getButtonText(lang);
        var descText = AdultTranslations.getDescriptionText(lang);
        
        // Update button text
        var button = adultItem.querySelector('button.stylebtn');
        if (button) {
            button.textContent = buttonText;
        }
        
        // Update description text
        var desc = adultItem.querySelector('p');
        if (desc) {
            desc.textContent = descText;
        }
    }
}

// Expose function globally for translator.js to call
window.updateAdultContentItem = updateAdultContentItem;

// Age Confirmation Modal Manager
const AgeConfirmModal = {
    pendingCheckbox: null,
    
    init: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
        // Yes button click
        DOM.on('#age-confirm-yes', 'click', function() {
            AgeConfirmModal.confirmYes();
        });
        
        // No button click
        DOM.on('#age-confirm-no', 'click', function() {
            AgeConfirmModal.confirmNo();
        });
        
        // Close on overlay click
        DOM.on('#age-confirm-overlay', 'click', function() {
            AgeConfirmModal.confirmNo();
        });
        
        // Close on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && DOM.hasClass('#age-confirm-modal', 'show')) {
                AgeConfirmModal.confirmNo();
            }
        });
    },
    
    show: function(checkbox) {
        this.pendingCheckbox = checkbox;
        DOM.addClass('#age-confirm-modal', 'show');
        DOM.addClass('#age-confirm-overlay', 'show');
        var modal = DOM.$('#age-confirm-modal');
        var overlay = DOM.$('#age-confirm-overlay');
        if (modal) modal.setAttribute('aria-hidden', 'false');
        if (overlay) overlay.setAttribute('aria-hidden', 'false');
    },
    
    hide: function() {
        DOM.removeClass('#age-confirm-modal', 'show');
        DOM.removeClass('#age-confirm-overlay', 'show');
        var modal = DOM.$('#age-confirm-modal');
        var overlay = DOM.$('#age-confirm-overlay');
        if (modal) modal.setAttribute('aria-hidden', 'true');
        if (overlay) overlay.setAttribute('aria-hidden', 'true');
        this.pendingCheckbox = null;
    },
    
    confirmYes: function() {
        if (this.pendingCheckbox) {
            this.pendingCheckbox.checked = true;
            var currentLang = window.localStorage.getItem('languages') || 'en';
            var buttonText = AdultTranslations.getButtonText(currentLang);
            var descText = AdultTranslations.getDescriptionText(currentLang);
            var mobile = DOM.$('.mobile');
            if (mobile) {
                DOM.append(mobile, `<li data-adult="true"><img src="images/sex.svg" /><dd><a href="routes/adult.html"><button class="stylebtn">${buttonText}</button></a></dd><p>${descText}</p></li>`);
            }
            window.localStorage.setItem('adult', 'open');
            SettingsModal.syncPornVisibility();
        }
        this.hide();
    },
    
    confirmNo: function() {
        if (this.pendingCheckbox) {
            this.pendingCheckbox.checked = false;
        }
        // Remove the adult content item by its unique identifier
        var mobile = DOM.$('.mobile');

        if (mobile) {
            var adultItem = mobile.querySelector('li[data-adult="true"]');
            if (adultItem) adultItem.remove();
        }
        localStorage.removeItem('adult');
        this.hide();
    }
};

// Version history modal: shows the update log when the version badge in
// Settings > About is clicked. The log entries live in .scrollidbar and are
// filled on DOMContentLoaded, so this module only handles presentation.
const VersionHistoryModal = {
    isOpen: false,

    show: function() {
        var modal = DOM.$('#version-history-modal');
        var overlay = DOM.$('#version-history-overlay');
        var content = DOM.$('#version-history-content');
        var source = DOM.$('#logbox .scrollidbar') || DOM.$('.scrollidbar');
        if (!modal || !overlay || !content) return;

        if (source && !content.innerHTML.trim()) {
            content.innerHTML = source.innerHTML;
        }
        // Localize the close button's accessible label using the active language.
        var closeBtn = modal.querySelector('.version-history-close');
        if (closeBtn && typeof translations !== 'undefined') {
            var lang = window.localStorage.getItem('preferredLanguage') ||
                       window.localStorage.getItem('languages') || 'en';
            var dict = translations[lang] || translations['en'];
            if (dict && dict.version_history_close) {
                closeBtn.setAttribute('aria-label', dict.version_history_close);
            }
        }
        DOM.addClass(overlay, 'show');
        DOM.addClass(modal, 'show');
        this.isOpen = true;

        if (closeBtn) closeBtn.focus();
    },

    hide: function() {
        var modal = DOM.$('#version-history-modal');
        var overlay = DOM.$('#version-history-overlay');
        if (!modal || !overlay) return;
        DOM.removeClass(overlay, 'show');
        DOM.removeClass(modal, 'show');
        this.isOpen = false;
    },

    bindEvents: function() {
        var btn = DOM.$('#version-history-btn');
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                VersionHistoryModal.show();
            });
        }
        DOM.on('#version-history-overlay', 'click', function() {
            VersionHistoryModal.hide();
        });
        DOM.on('#version-history-modal .version-history-close', 'click', function() {
            VersionHistoryModal.hide();
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && VersionHistoryModal.isOpen) {
                e.preventDefault();
                e.stopPropagation();
                VersionHistoryModal.hide();
            }
        }, true);
    }
};

// Proxy settings UI: manage user-defined CORS proxies in localStorage.
// Built-in proxies are shown read-only from ProxyConfig.getBuiltins().
const ProxySettings = {
    // In-memory probe results, keyed by custom proxy id. Rendered as badges;
    // deliberately not persisted so a fresh visit re-checks live status.
    _testResults: {},

    t: function(key, fallback) {
        try {
            if (typeof translations !== 'undefined') {
                var lang = window.localStorage.getItem('preferredLanguage') ||
                           window.localStorage.getItem('languages') || 'en';
                // Resolve aliases (e.g. 'zh' -> 'zh-CN') the same way
                // applyTranslation() does, otherwise inline-rendered settings
                // texts fall back to the English fallback under alias codes.
                if (typeof getNormalizedLanguage === 'function') {
                    lang = getNormalizedLanguage(lang);
                }
                var dict = translations[lang] || translations['en'];
                if (dict && dict[key]) return dict[key];
            }
        } catch (e) { /* ignore */ }
        return fallback;
    },

    escapeHtml: function(text) {
        return String(text == null ? '' : text)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    },

    showError: function(key, fallback) {
        var el = DOM.$('#proxy-error');
        if (el) el.textContent = this.t(key, fallback);
    },

    clearError: function() {
        var el = DOM.$('#proxy-error');
        if (el) el.textContent = '';
    },

    render: function() {
        var self = this;
        var builtinEl = DOM.$('#proxy-builtin-list');
        var customEl = DOM.$('#proxy-custom-list');
        if (!builtinEl || !customEl || typeof ProxyConfig === 'undefined') return;

        // Read the health cache once per render (not once per row): getHealth()
        // parses localStorage, and the list can hold several built-ins.
        var health = (typeof ProxyConfig.getHealth === 'function') ? ProxyConfig.getHealth() : [];

        var dragHint = self.escapeHtml(self.t('settings_drag_hint', 'Drag to reorder'));
        var builtinHandleTitle = self.escapeHtml(self.t('settings_drag_handle', 'Drag handle'));
        builtinEl.innerHTML = ProxyConfig.getBuiltins().map(function(item) {
            // Show the cooldown state so the user can tell why a proxy is being
            // skipped (see ProxyConfig.getHealth()).
            var rec = null;
            for (var i = 0; i < health.length; i++) {
                if (health[i].url === item.url) { rec = health[i]; break; }
            }
            var badge = '';
            if (rec && rec.coolingDown) {
                var mins = Math.max(1, Math.ceil(rec.remainingMs / 60000));
                badge = '<span class="proxy-badge proxy-badge-cooldown" title="' +
                    self.escapeHtml(self.t('settings_proxy_cooldown', 'Temporarily skipped after a failure')) +
                    '">⏳ ' + mins + ' min</span>';
            }
            return '<div class="proxy-item proxy-item-builtin proxy-item-draggable" data-id="' + self.escapeHtml(item.id) + '" draggable="true" title="' + dragHint + '">' +
                '<span class="proxy-drag-handle" title="' + builtinHandleTitle + '">⠿</span>' +
                '<span class="proxy-lock" title="' + self.escapeHtml(self.t('settings_proxy_builtin', 'Built-in (read-only)')) + '">🔒</span>' +
                '<div class="proxy-item-body">' +
                    '<div class="proxy-item-name">' + self.escapeHtml(item.name) + badge + '</div>' +
                    '<div class="proxy-item-url">' + self.escapeHtml(item.url) + '</div>' +
                '</div>' +
            '</div>';
        }).join('');

        var custom = ProxyConfig.getCustom();
        customEl.innerHTML = custom.map(function(item) {
            var toggleLabel = item.enabled ? self.t('settings_proxy_disable', 'Disable') : self.t('settings_proxy_enable', 'Enable');
            var result = self._testResults[item.id];
            var testBadge = '';
            if (result) {
                var cls = result.ok ? 'ok' : 'fail';
                var label = result.ok
                    ? self.t('settings_proxy_test_ok', 'OK')
                    : self.t('settings_proxy_test_fail', 'Failed');
                testBadge = '<span class="proxy-test-badge ' + cls + '" title="' +
                    (result.via ? self.escapeHtml(result.via) : '') + '">' +
                    (result.ok ? '✓ ' : '✗ ') + self.escapeHtml(label) + ' · ' + result.ms + 'ms</span>';
            }
            var dragHint = self.escapeHtml(self.t('settings_drag_hint', 'Drag to reorder'));
            return '<div class="proxy-item proxy-item-draggable" data-id="' + self.escapeHtml(item.id) + '" draggable="true" title="' + dragHint + '">' +
                '<span class="proxy-drag-handle" title="' + self.escapeHtml(self.t('settings_drag_handle', 'Drag handle')) + '">⠿</span>' +
                '<div class="proxy-item-body">' +
                    '<div class="proxy-item-name">' + self.escapeHtml(item.name) + testBadge + '</div>' +
                    '<div class="proxy-item-url">' + self.escapeHtml(item.url) + '</div>' +
                '</div>' +
                '<div class="proxy-item-actions">' +
                    '<button type="button" class="proxy-mini-btn" data-act="test" title="' + self.escapeHtml(self.t('settings_proxy_test', 'Test')) + '">⚡</button>' +
                    '<button type="button" class="proxy-mini-btn" data-act="toggle" title="' + self.escapeHtml(toggleLabel) + '">' + (item.enabled ? '⏸' : '▶') + '</button>' +
                    '<button type="button" class="proxy-mini-btn" data-act="edit" title="' + self.escapeHtml(self.t('settings_proxy_edit', 'Edit')) + '">✎</button>' +
                    '<button type="button" class="proxy-mini-btn danger" data-act="delete" title="' + self.escapeHtml(self.t('settings_proxy_delete', 'Delete')) + '">✕</button>' +
                '</div>' +
            '</div>';
        }).join('');
        if (!custom.length) {
            customEl.innerHTML = '<div class="proxy-empty">' + self.escapeHtml(self.t('settings_proxy_empty', 'No custom proxies yet.')) + '</div>';
        }
    },


    applyPlaceholders: function() {
        DOM.$$('[data-i18n-placeholder]').forEach(function(el) {
            var key = el.getAttribute('data-i18n-placeholder');
            var val = ProxySettings.t(key, el.getAttribute('placeholder') || '');
            el.setAttribute('placeholder', val);
        });
    },

    bindEvents: function() {
        var self = this;
        this.applyPlaceholders();
        this.render();

        var addBtn = DOM.$('#proxy-add-btn');
        function commit(mode) {
            var nameEl = DOM.$('#proxy-name-input');
            var urlEl = DOM.$('#proxy-url-input');
            var url = (urlEl && urlEl.value || '').trim();
            if (!ProxyConfig.isValidUrl(url)) {
                self.showError('settings_proxy_invalid', 'Please enter a valid http(s) proxy URL.');
                return;
            }
            if (mode === 'edit') {
                ProxyConfig.update(addBtn.getAttribute('data-id'), {
                    name: (nameEl && nameEl.value || '').trim(), url: url
                });
                addBtn.removeAttribute('data-mode');
                addBtn.removeAttribute('data-id');
                addBtn.textContent = self.t('settings_proxy_add', 'Add proxy');
            } else {
                ProxyConfig.add((nameEl && nameEl.value || '').trim(), url);
            }
            if (nameEl) nameEl.value = '';
            if (urlEl) urlEl.value = '';
            self.clearError();
            self.render();
        }

        if (addBtn) {
            addBtn.addEventListener('click', function() {
                commit(addBtn.getAttribute('data-mode') === 'edit' ? 'edit' : 'add');
            });
        }

        DOM.on('#proxy-custom-list', 'click', function(e) {
            var btn = e.target.closest('.proxy-mini-btn');
            if (!btn) return;
            var itemEl = btn.closest('.proxy-item');
            var id = itemEl && itemEl.getAttribute('data-id');
            var act = btn.getAttribute('data-act');
            if (!id || !act) return;
            if (act === 'test') {
                var target = ProxyConfig.getCustom().filter(function(x) { return x.id === id; })[0];
                if (!target) return;
                btn.disabled = true;
                var nameElForBadge = itemEl.querySelector('.proxy-item-name');
                var testingBadge = null;
                if (nameElForBadge) {
                    testingBadge = document.createElement('span');
                    testingBadge.className = 'proxy-test-badge testing';
                    testingBadge.textContent = self.t('settings_proxy_testing', 'Testing...');
                    nameElForBadge.appendChild(testingBadge);
                }
                if (typeof SettingsProbe === 'undefined') { btn.disabled = false; return; }
                SettingsProbe.testProxy(target.url).then(function(res) {
                    self._testResults[id] = res;
                    self.render(); // re-render restores badge from _testResults and refreshes cooldown badges
                });
                return;
            }
            if (act === 'delete') {
                ProxyConfig.remove(id);
                self.render();
            } else if (act === 'toggle') {
                var item = ProxyConfig.getCustom().filter(function(x) { return x.id === id; })[0];
                if (item) { ProxyConfig.update(id, { enabled: !item.enabled }); self.render(); }
            } else if (act === 'edit') {
                var current = ProxyConfig.getCustom().filter(function(x) { return x.id === id; })[0];
                if (!current) return;
                var nameEl = DOM.$('#proxy-name-input');
                var urlEl = DOM.$('#proxy-url-input');
                if (nameEl) nameEl.value = current.name;
                if (urlEl) urlEl.value = current.url;
                if (addBtn) {
                    addBtn.textContent = self.t('settings_proxy_save', 'Save changes');
                    addBtn.setAttribute('data-mode', 'edit');
                    addBtn.setAttribute('data-id', id);
                }
                // The edit form lives on this same Advanced page - scroll to it.
                var form = DOM.$('.proxy-form');
                if (form && form.scrollIntoView) form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });

        // Drag-to-reorder for both built-in and custom proxies. Bind on the
        // shared parent so it survives re-renders of either inner list; each
        // dragend persists into the matching order (builtin vs custom).
        var proxyWrap = DOM.$('.proxy-settings-lists') || DOM.$('#proxy-builtin-list').parentNode;
        if (proxyWrap) {
            var draggedId = null;
            var draggedBuiltin = false;
            proxyWrap.addEventListener('dragstart', function(e) {
                var row = e.target.closest('.proxy-item-draggable');
                if (!row) { e.preventDefault(); return; }
                draggedId = row.getAttribute('data-id');
                draggedBuiltin = !!(row.closest('#proxy-builtin-list'));
                row.classList.add('dragging');
                if (e.dataTransfer) {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', draggedId);
                }
            });
            proxyWrap.addEventListener('dragover', function(e) {
                if (!draggedId) return;
                var row = e.target.closest('.proxy-item-draggable');
                if (!row || row.getAttribute('data-id') === draggedId) return;
                var rowBuiltin = !!(row.closest('#proxy-builtin-list'));
                if (rowBuiltin !== draggedBuiltin) return; // never mix built-in/custom groups
                e.preventDefault();
                var box = row.getBoundingClientRect();
                var before = (e.clientY - box.top) < box.height / 2;
                var listEl = draggedBuiltin ? DOM.$('#proxy-builtin-list') : DOM.$('#proxy-custom-list');
                var draggedRow = listEl.querySelector('.proxy-item[data-id="' + draggedId + '"]');
                if (draggedRow) listEl.insertBefore(draggedRow, before ? row : row.nextSibling);
            });
            proxyWrap.addEventListener('dragend', function() {
                if (!draggedId) return;
                var listEl = draggedBuiltin ? DOM.$('#proxy-builtin-list') : DOM.$('#proxy-custom-list');
                var ids = [].map.call(listEl.querySelectorAll('.proxy-item[data-id]'), function(el) {
                    return el.getAttribute('data-id');
                });
                if (draggedBuiltin) ProxyConfig.reorderBuiltins(ids);
                else ProxyConfig.reorder(ids);
                draggedId = null;
                self.render();
            });
        }
    }
};


// Source Control UI: renders the read-only built-in catalogue per tab
// (SourceConfig.getBuiltins) with an enable checkbox, and manages the user's
// custom collection-API sources for the movie and porn tabs, mirroring the
// ProxySettings pattern.
const SourceSettings = {
    // In-memory probe results per type -> id. Not persisted; re-checked on visit.
    _testResults: {},

    render: function() {
        if (typeof SourceConfig === 'undefined') return;
        var builtinTitle = ProxySettings.t('source_builtin_title', 'Built-in sources (read-only)');
        var lockTitle = ProxySettings.t('source_builtin_title', 'Built-in (read-only)');
        var customTitle = ProxySettings.t('source_custom_title', 'My custom sources');
        var emptyText = ProxySettings.t('source_custom_empty', 'No custom sources yet.');
        var deleteTitle = ProxySettings.t('settings_proxy_delete', 'Delete');
        var namePh = ProxySettings.t('source_custom_name_ph', 'Name (e.g. My source)');
        var ytUrlPh = 'https://www.youtube.com/feeds/videos.xml?channel_id=UC...';

        var self = SourceSettings;
        ['movie', 'novel', 'manga', 'music', 'porn', 'youtube'].forEach(function(type) {
            var container = DOM.$('.source-options[data-source-type="' + type + '"]');
            if (!container) return;

            var html = '<div class="proxy-section-title proxy-subtitle">' + self.escape(builtinTitle) + '</div>';
            html += '<div class="proxy-list" data-builtin-list="' + type + '">';
            var builtinDragHint = self.escape(ProxySettings.t('settings_drag_hint', 'Drag to reorder'));
            var builtinHandleTitle = self.escape(ProxySettings.t('settings_drag_handle', 'Drag handle'));
            SourceConfig.getBuiltins(type).forEach(function(src) {
                var urlRow = src.url ? '<div class="proxy-item-url">' + self.escape(src.url) + '</div>' : '';
                html += '<label class="proxy-item source-item-builtin proxy-item-draggable" data-id="' + self.escape(src.id) + '" draggable="true" title="' + builtinDragHint + '">' +
                    '<span class="proxy-drag-handle" title="' + builtinHandleTitle + '">⠿</span>' +
                    '<input type="checkbox" name="settings-' + type + '" value="' + self.escape(src.id) + '" checked>' +
                    '<div class="proxy-item-body">' +
                        '<div class="proxy-item-name">' + self.escape(src.name) +
                            ' <span class="proxy-lock" title="' + self.escape(lockTitle) + '">🔒</span></div>' +
                        urlRow +
                    '</div>' +
                '</label>';
            });
            html += '</div>';

            if (SourceConfig.TYPES.indexOf(type) !== -1) {
                var custom = SourceConfig.get(type);
                html += '<div class="proxy-section-title proxy-subtitle">' + self.escape(customTitle) + '</div>';
                html += '<div class="proxy-list" id="custom-source-list-' + type + '">';
                if (custom.length) {
                    custom.forEach(function(item) {
                        var toggleLabel = item.enabled
                            ? ProxySettings.t('settings_proxy_disable', 'Disable')
                            : ProxySettings.t('settings_proxy_enable', 'Enable');
                        var results = self._testResults[type] || {};
                        var result = results[item.id];
                        var testBadge = '';
                        if (result) {
                            var cls = result.ok ? 'ok' : 'fail';
                            var label = result.ok
                                ? ProxySettings.t('settings_proxy_test_ok', 'OK')
                                : ProxySettings.t('settings_proxy_test_fail', 'Failed');
                            testBadge = '<span class="proxy-test-badge ' + cls + '">' +
                                (result.ok ? '✓ ' : '✗ ') + self.escape(label) + ' · ' + result.ms + 'ms</span>';
                        }
                        var dragHint = self.escape(ProxySettings.t('settings_drag_hint', 'Drag to reorder'));
                        html += '<div class="proxy-item proxy-item-draggable" data-id="' + self.escape(item.id) + '" draggable="true" title="' + dragHint + '">' +
                            '<span class="proxy-drag-handle" title="' + self.escape(ProxySettings.t('settings_drag_handle', 'Drag handle')) + '">⠿</span>' +
                            '<div class="proxy-item-body">' +
                                '<div class="proxy-item-name">' + self.escape(item.name) + testBadge + '</div>' +
                                '<div class="proxy-item-url">' + self.escape(item.url) + '</div>' +
                            '</div>' +
                            '<div class="proxy-item-actions">' +
                                '<button type="button" class="proxy-mini-btn" data-act="test" title="' + self.escape(ProxySettings.t('settings_proxy_test', 'Test')) + '">⚡</button>' +
                                '<button type="button" class="proxy-mini-btn" data-act="toggle" title="' + self.escape(toggleLabel) + '">' + (item.enabled ? '⏸' : '▶') + '</button>' +
                                '<button type="button" class="proxy-mini-btn danger" data-act="delete" title="' + self.escape(deleteTitle) + '">✕</button>' +
                            '</div>' +
                        '</div>';
                    });
                } else {
                    html += '<div class="proxy-empty">' + self.escape(emptyText) + '</div>';
                }
                html += '</div>';
                html += '<div class="proxy-form">' +
                    '<div class="proxy-form-row">' +
                        '<input type="text" id="custom-source-name-' + type + '" class="settings-input" placeholder="' + self.escape(namePh) + '" maxlength="40">' +
                        '<input type="url" id="custom-source-url-' + type + '" class="settings-input" placeholder="' + self.escape(type === 'youtube' ? ytUrlPh : 'https://host/api.php/provide/vod/at/json') + '" spellcheck="false">' +
                    '</div>' +
                    '<div class="proxy-form-actions">' +
                        '<button type="button" class="settings-btn" id="custom-source-add-' + type + '">' + self.escape(ProxySettings.t('source_custom_add', 'Add source')) + '</button>' +
                    '</div>' +
                    '<div id="custom-source-error-' + type + '" class="proxy-error" role="alert"></div>' +
                '</div>';
            }
            container.innerHTML = html;
        });
    },

    escape: function(text) {
        return ProxySettings.escapeHtml(text);
    },

    clearError: function(type) {
        var el = DOM.$('#custom-source-error-' + type);
        if (el) el.textContent = '';
    },

    bindEvents: function() {
        var self = this;
        // Delegate on the static .source-options containers: render() replaces
        // their innerHTML (and every button inside), so per-element listeners
        // would die on the first re-render.
        // Render() builds built-in rows (now draggable) for ALL six tabs; bind
        // on each static container so novel/manga/music built-ins are sortable
        // too. Custom-source form/button logic only exists for SourceConfig.TYPES.
        ['movie', 'novel', 'manga', 'music', 'porn', 'youtube'].forEach(function(type) {
            var container = DOM.$('.source-options[data-source-type="' + type + '"]');
            if (!container) return;
            container.addEventListener('click', function(e) {
                var addBtn = e.target.closest('#custom-source-add-' + type);
                if (addBtn) {
                    var nameEl = DOM.$('#custom-source-name-' + type);
                    var urlEl = DOM.$('#custom-source-url-' + type);
                    var url = (urlEl && urlEl.value || '').trim();
                    var valid = type === 'youtube'
                        ? SourceConfig.isValidYouTubeFeedUrl(url)
                        : SourceConfig.isValidUrl(url);
                    if (!valid) {
                        // Reuse the translated "invalid URL" text and append the
                        // YouTube RSS format (a URL needs no translation).
                        var baseMsg = ProxySettings.t('source_custom_invalid', 'Please enter a valid http(s) source URL.');
                        var msg = type === 'youtube'
                            ? baseMsg + ': https://www.youtube.com/feeds/videos.xml?channel_id=UC...'
                            : baseMsg;
                        var errEl = DOM.$('#custom-source-error-' + type);
                        if (errEl) errEl.textContent = msg;
                        return;
                    }
                    SourceConfig.add(type, nameEl && nameEl.value || '', url);
                    if (nameEl) nameEl.value = '';
                    if (urlEl) urlEl.value = '';
                    self.clearError(type);
                    self.render();
                    SettingsModal.loadSavedSources();
                    return;
                }
                var btn = e.target.closest('.proxy-mini-btn');
                if (!btn) return;
                var itemEl = btn.closest('.proxy-item');
                var id = itemEl && itemEl.getAttribute('data-id');
                var act = btn.getAttribute('data-act');
                if (!id || !act) return;
                if (act === 'test') {
                    var source = SourceConfig.get(type).filter(function(x) { return x.id === id; })[0];
                    if (!source) return;
                    btn.disabled = true;
                    var nameElForBadge = itemEl.querySelector('.proxy-item-name');
                    if (nameElForBadge) {
                        var testingBadge = document.createElement('span');
                        testingBadge.className = 'proxy-test-badge testing';
                        testingBadge.textContent = ProxySettings.t('settings_proxy_testing', 'Testing...');
                        nameElForBadge.appendChild(testingBadge);
                    }
                    if (typeof SettingsProbe === 'undefined') { btn.disabled = false; return; }
                    SettingsProbe.testSource(type, source.url).then(function(res) {
                        self._testResults[type] = self._testResults[type] || {};
                        self._testResults[type][id] = res;
                        self.render();
                        SettingsModal.loadSavedSources();
                    });
                    return;
                }
                if (act === 'delete') {
                    SourceConfig.remove(type, id);
                } else if (act === 'toggle') {
                    var item = SourceConfig.get(type).filter(function(x) { return x.id === id; })[0];
                    if (item) SourceConfig.update(type, id, { enabled: !item.enabled });
                } else {
                    return;
                }
                self.render();
                SettingsModal.loadSavedSources();
            });

            // Drag-to-reorder for both built-in and custom sources of this tab.
            // Bind on the STATIC .source-options container: render() rebuilds the
            // inner lists each time, so listeners on them would die.
            var draggedId = null;
            var draggedBuiltin = false;
            container.addEventListener('dragstart', function(e) {
                var row = e.target.closest('.proxy-item-draggable');
                if (!row) { e.preventDefault(); return; }
                var builtinList = container.querySelector('.proxy-list[data-builtin-list="' + type + '"]');
                var customList = DOM.$('#custom-source-list-' + type);
                draggedBuiltin = !!(builtinList && builtinList.contains(row));
                if (!draggedBuiltin && !(customList && customList.contains(row))) { e.preventDefault(); return; }
                draggedId = row.getAttribute('data-id');
                row.classList.add('dragging');
                if (e.dataTransfer) {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', draggedId);
                }
            });
            container.addEventListener('dragover', function(e) {
                if (!draggedId) return;
                var row = e.target.closest('.proxy-item-draggable');
                if (!row || row.getAttribute('data-id') === draggedId) return;
                var builtinList = container.querySelector('.proxy-list[data-builtin-list="' + type + '"]');
                var customList = DOM.$('#custom-source-list-' + type);
                var rowBuiltin = !!(builtinList && builtinList.contains(row));
                if (rowBuiltin !== draggedBuiltin) return; // never mix built-in/custom groups
                e.preventDefault();
                var box = row.getBoundingClientRect();
                var before = (e.clientY - box.top) < box.height / 2;
                var listEl = draggedBuiltin ? builtinList : customList;
                var draggedRow = listEl.querySelector('.proxy-item[data-id="' + draggedId + '"]');
                if (draggedRow) listEl.insertBefore(draggedRow, before ? row : row.nextSibling);
            });
            container.addEventListener('dragend', function() {
                if (!draggedId) return;
                var builtinList = container.querySelector('.proxy-list[data-builtin-list="' + type + '"]');
                var customList = DOM.$('#custom-source-list-' + type);
                var listEl = draggedBuiltin ? builtinList : customList;
                if (listEl) {
                    var ids = [].map.call(listEl.querySelectorAll('.proxy-item[data-id]'), function(el) {
                        return el.getAttribute('data-id');
                    });
                    if (draggedBuiltin) SourceConfig.reorderBuiltins(type, ids);
                    else SourceConfig.reorder(type, ids);
                }
                draggedId = null;
                self.render();
                SettingsModal.loadSavedSources();
            });
        });
    }
};

// Settings Modal Manager - Paginated Settings
const SettingsModal = {
    currentPage: 'main',
    isOpen: false,
    
    init: function() {
        this.bindEvents();
        this.syncLanguageSelect();
        this.syncThemeToggle();
    },
    
    bindEvents: function() {
        // Open settings modal via menu toggle button
        var menuToggleBtn = DOM.$('#menu-toggle-btn');
        if (menuToggleBtn) {
            menuToggleBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                if (SettingsModal.isOpen) {
                    SettingsModal.hide();
                } else {
                    SettingsModal.show();
                }
            });
        }
        
        // Close settings modal on overlay click
        DOM.on('#settings-modal-overlay', 'click', function() {
            SettingsModal.hide();
        });
        
        // Close button
        DOM.on('#settings-modal .close-btn', 'click', function() {
            SettingsModal.hide();
        });

        // Navigation items
        DOM.$$('.settings-nav-item').forEach(function(item) {
            item.addEventListener('click', function() {
                var target = this.getAttribute('data-target');
                if (target) {
                    SettingsModal.showPage(target);
                }
            });
        });
        
        // Clear cache button
        DOM.on('#clear-cache-btn', 'click', function() {
            SettingsModal.clearCache();
        });
        
        // v8.5.0: data backup / restore
        DOM.on('#export-data-btn', 'click', function() {
            SettingsModal.exportData();
        });
        DOM.on('#import-data-btn', 'click', function() {
            var input = DOM.$('#import-data-input');
            if (input) input.click();
        });
        DOM.on('#import-data-input', 'change', function() {
            if (this.files && this.files[0]) {
                SettingsModal.importData(this.files[0]);
                this.value = '';
            }
        });
        
        // Theme toggle in settings
        DOM.on('#settings-theme-toggle', 'change', function() {
            ThemeManager.setTheme(this.checked ? 'dark' : 'light');
        });
        
        // Language change in settings - use direct event binding for reliability
        var settingsLangSelect = DOM.$('#settings-languages');
        if (settingsLangSelect) {
            settingsLangSelect.addEventListener('change', function(e) {
                var selectedLang = this.value;
                // Use window.setLanguage to ensure proper language switching
                if (window.setLanguage) {
                    window.setLanguage(selectedLang);
                } else {
                    // Fallback: save to both keys for compatibility
                    window.localStorage.setItem('preferredLanguage', selectedLang);
                    window.localStorage.setItem('languages', selectedLang);
                    if (typeof applyTranslation === 'function') {
                        applyTranslation(selectedLang);
                    }
                }
                // Sync with main language selector
                var mainLangSelect = DOM.$('#languages');
                if (mainLangSelect) {
                    mainLangSelect.value = selectedLang;
                }
            });
        }
        
        // Adult content toggle in settings
        var adultbanToggle = DOM.$('#adultban');
        if (adultbanToggle) {
            // Initialize state from localStorage
            if (window.localStorage.getItem('adult') === 'open') {
                adultbanToggle.checked = true;
            }
            
            adultbanToggle.addEventListener('change', function() {
                if (this.checked) {
                    // Prevent the checkbox from being checked immediately
                    this.checked = false;
                    // Show custom modal
                    AgeConfirmModal.show(this);
                } else {
                    var mobile = DOM.$('.mobile');
                    if (mobile) {
                        // Remove the adult content item by its unique identifier
                        var adultItem = mobile.querySelector('li[data-adult="true"]');
                        if (adultItem) adultItem.remove();
                    }
                    localStorage.removeItem('adult');
                    SettingsModal.syncPornVisibility();
                }
            });
        }
        
        // ESC key to close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && SettingsModal.isOpen) {
                SettingsModal.hide();
            }
        });
    },
    
    show: function() {
        var overlay = DOM.$('#settings-modal-overlay');
        var modal = DOM.$('#settings-modal');
        
        if (overlay && modal) {
            // Use only CSS classes for proper transition handling
            DOM.addClass(overlay, 'show');
            DOM.addClass(modal, 'show');
            
            this.isOpen = true;
            this.syncPornVisibility();
            this.showPage('basic');

            // Update button aria-expanded
            var btn = DOM.$('#menu-toggle-btn');
            if (btn) {
                btn.setAttribute('aria-expanded', 'true');
                btn.setAttribute('aria-label', 'Close settings');
            }
        }
    },

    // Hide/show the Porn source category based on Sensitive Content toggle state
    syncPornVisibility: function() {
        var adultEnabled = window.localStorage.getItem('adult') === 'open';
        var pornBtn = DOM.$('#porn-source-btn');
        var pornPanel = DOM.$('.source-options[data-source-type="porn"]');
        if (pornBtn) {
            pornBtn.style.display = adultEnabled ? '' : 'none';
        }
        if (pornPanel) {
            pornPanel.style.display = adultEnabled ? '' : 'none';
            // If adult is disabled and porn panel was active, switch back to movie
            if (!adultEnabled && pornPanel.classList.contains('hidden') === false) {
                DOM.addClass(pornPanel, 'hidden');
                var movieBtn = DOM.$('.source-type-btn[data-source-type="movie"]');
                var moviePanel = DOM.$('.source-options[data-source-type="movie"]');
                if (movieBtn) { DOM.$$('.source-type-btn').forEach(function(b) { DOM.removeClass(b, 'active'); }); DOM.addClass(movieBtn, 'active'); }
                if (moviePanel) DOM.removeClass(moviePanel, 'hidden');
            }
        }
    },

    hide: function() {
        var overlay = DOM.$('#settings-modal-overlay');
        var modal = DOM.$('#settings-modal');
        
        if (overlay && modal) {
            // Use only CSS classes for proper transition handling
            DOM.removeClass(overlay, 'show');
            DOM.removeClass(modal, 'show');
            
            this.isOpen = false;
            if (typeof VersionHistoryModal !== 'undefined' && VersionHistoryModal.isOpen) {
                VersionHistoryModal.hide();
            }
            
            // Update button aria-expanded
            var btn = DOM.$('#menu-toggle-btn');
            if (btn) {
                btn.setAttribute('aria-expanded', 'false');
                btn.setAttribute('aria-label', 'Open menu');
            }
        }
    },
    
    showPage: function(pageName) {
        var currentPageEl = DOM.$('.settings-page.active');
        var targetPage = DOM.$('.settings-page[data-page="' + pageName + '"]');
        
        // If no current page is active, just activate the target
        if (!currentPageEl) {
            if (targetPage) {
                DOM.addClass(targetPage, 'active');
                this.currentPage = pageName;
                this.highlightNav(pageName);
            }
            return;
        }
        
        if (targetPage && currentPageEl !== targetPage) {
            DOM.removeClass(currentPageEl, 'active');
            DOM.addClass(targetPage, 'active');
        }
        // Keep the navigation highlight in sync even when the target page is
        // already active in the DOM (e.g. the default page on first open).
        if (targetPage) {
            this.currentPage = pageName;
            this.highlightNav(pageName);
        }
    },

    highlightNav: function(pageName) {
        DOM.$$('.settings-nav-item').forEach(function(item) {
            DOM.removeClass(item, 'active');
        });
        var target = DOM.$('.settings-nav-item[data-target="' + pageName + '"]');
        if (target) {
            DOM.addClass(target, 'active');
        }
    },

    syncLanguageSelect: function() {
        var settingsLang = DOM.$('#settings-languages');
        var mainLang = DOM.$('#languages');
        
        // Get saved language from both keys for compatibility
        var savedLang = window.localStorage.getItem('preferredLanguage') || 
                        window.localStorage.getItem('languages') || 'en';
        
        // Sync both selectors with the same value
        if (settingsLang) {
            settingsLang.value = savedLang;
        }
        if (mainLang) {
            mainLang.value = savedLang;
        }
    },
    
    syncThemeToggle: function() {
        var themeToggle = DOM.$('#settings-theme-toggle');
        if (themeToggle) {
            var currentTheme = window.localStorage.getItem('theme') || 'light';
            themeToggle.checked = currentTheme === 'dark';
        }
    },
    
    initSourceControl: function() {
        // Source type button click handler
        DOM.$$('.source-type-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var sourceType = this.getAttribute('data-source-type');
                // Guard: do not allow Porn category when Sensitive Content is off
                if (sourceType === 'porn' && window.localStorage.getItem('adult') !== 'open') {
                    return;
                }
                // Remove active class from all buttons
                DOM.$$('.source-type-btn').forEach(function(b) {
                    DOM.removeClass(b, 'active');
                });
                // Add active class to clicked button
                DOM.addClass(this, 'active');
                
                // Hide all source options
                DOM.$$('.source-options').forEach(function(opt) {
                    DOM.addClass(opt, 'hidden');
                });
                
                // Show selected source options
                var targetOptions = DOM.$('.source-options[data-source-type="' + sourceType + '"]');
                if (targetOptions) {
                    DOM.removeClass(targetOptions, 'hidden');
                }
            });
        });
        
        // Render the per-tab lists (built-ins + custom forms), bind the
        // custom-source handlers, then re-apply the saved checkbox state.
        SourceSettings.render();
        SourceSettings.bindEvents();
        this.loadSavedSources();
        
        // Save button click handler
        DOM.on('#save-source-btn', 'click', function() {
            SettingsModal.saveSources();
        });
    },
    
    loadSavedSources: function() {
        var sourceTypes = ['movie', 'novel', 'manga', 'music', 'porn', 'youtube'];
        sourceTypes.forEach(function(type) {
            var saved = window.localStorage.getItem(type);
            if (saved) {
                var savedArr = saved.split(',');
                var checkboxes = document.querySelectorAll('input[name="settings-' + type + '"]');
                checkboxes.forEach(function(cb) {
                    cb.checked = savedArr.includes(cb.value);
                });
            }
        });
    },
    
    saveSources: function() {
        var sourceTypes = ['movie', 'novel', 'manga', 'music', 'porn', 'youtube'];
        var hasError = false;
        
        sourceTypes.forEach(function(type) {
            // The YouTube tab's built-in rows are informational (Theater
            // always exposes built-in RSS channels regardless of checkbox
            // state), so an unchecked YouTube row is fine; only the real
            // content-source tabs require a selection.
            var checked = [];
            document.querySelectorAll('input[name="settings-' + type + '"]:checked').forEach(function(cb) {
                checked.push(cb.value);
            });
            
            if (checked.length === 0 && type !== 'youtube') {
                hasError = true;
            } else if (checked.length > 0) {
                window.localStorage.setItem(type, checked.join(','));
            }
        });
        
        if (hasError) {
            ErrorToast.show('Please select at least one source for each category', 3000);
        } else {
            ErrorToast.show('Sources saved successfully!', 2000);
        }
    },
    
    clearCache: function() {
        ConfirmDialog.show(
            'Clear cache',
            'Are you sure you want to clear all cache?',
            function() {
                localStorage.clear();
                ErrorToast.show('Cache cleared successfully!', 2000);
                // Reset theme and other settings
                ThemeManager.setTheme('light');
                this.syncThemeToggle();
            }.bind(this)
        );
    },
    
    // v8.5.0: export a full localStorage snapshot as a JSON backup file
    exportData: function() {
        try {
            var data = {};
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                data[key] = localStorage.getItem(key);
            }
            var payload = {
                app: 'easy-web-tv',
                version: (window.EWTV_VERSION || '8.6.3'),
                exportedAt: new Date().toISOString(),
                data: data
            };
            var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            var d = new Date();
            var stamp = d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2);
            a.href = url;
            a.download = 'easy-web-tv-backup-' + stamp + '.json';
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
            ErrorToast.show('Backup exported successfully!', 2000);
        } catch (e) {
            console.error('Export failed:', e);
            ErrorToast.show('Export failed: ' + e.message, 3000);
        }
    },
    
    // v8.5.0: import a backup file and merge it into localStorage
    importData: function(file) {
        var self = this;
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function() {
            try {
                var payload = JSON.parse(reader.result);
                if (!payload || payload.app !== 'easy-web-tv' || typeof payload.data !== 'object' || payload.data === null) {
                    ErrorToast.show('Invalid backup file', 3000);
                    return;
                }
                var keys = Object.keys(payload.data);
                if (!keys.length) {
                    ErrorToast.show('Backup file is empty', 3000);
                    return;
                }
                ConfirmDialog.show(
                    'Import data',
                    'Import ' + keys.length + ' entries? Existing entries with the same name will be overwritten.',
                    function() {
                        keys.forEach(function(k) {
                            localStorage.setItem(k, payload.data[k]);
                        });
                        ErrorToast.show('Data imported successfully!', 2000);
                        setTimeout(function() { window.location.reload(); }, 1200);
                    }
                );
            } catch (e) {
                console.error('Import failed:', e);
                ErrorToast.show('Import failed: invalid JSON', 3000);
            }
        };
        reader.onerror = function() {
            ErrorToast.show('Import failed: cannot read file', 3000);
        };
        reader.readAsText(file);
    }
};

// Initialize application
DOM.ready(function() {
    // Initialize Settings Modal FIRST (to properly bind menu button)
    SettingsModal.init();
    VersionHistoryModal.bindEvents();
    if (typeof ProxySettings !== 'undefined') ProxySettings.bindEvents();
    
    // Initialize keyboard navigation (will use SettingsModal for menu toggle)
    KeyboardManager.init();
    
    ConfirmModal.init();
    // Initialize scroll animations
    ScrollAnimationManager.init();
    
    // Initialize theme manager
    ThemeManager.init();
    
    // Initialize share manager
    ShareManager.init();
    
    // Initialize PWA install manager
    InstallManager.init();
    
    // Initialize Age Confirmation Modal
    AgeConfirmModal.init();
    
    // Initialize Source Control in Settings Modal
    SettingsModal.initSourceControl();
    
    // Check user IP belongs to if in China, Hong Kong, Macau, North Korea
    if (window.localStorage.getItem('bannedcountries') == 'true') {
        // Previously detected as a banned country - hide sensitive content immediately
        hideSensitiveContent();
    } else {
        getUserIp();
    }
    
    // Append select language options - Grouped and optimized
    var languages = DOM.$('#languages');
    var settingsLanguages = DOM.$('#settings-languages');
    var languagesHtml = `
            <option value="selectbox">==Select==</option>
            <optgroup label="🌍 Common">
                <option value="en">English</option>
                <option value="zh">Chinese - 中文</option>
                <option value="zh-CN">Chinese (Simplified) - 中文（简体）</option>
                <option value="zh-TW">Chinese (Traditional) - 中文（繁體）</option>
                <option value="ja">Japanese - 日本語</option>
                <option value="ko">Korean - 한국어</option>
                <option value="es">Spanish - español</option>
                <option value="fr">French - français</option>
                <option value="de">German - Deutsch</option>
                <option value="pt">Portuguese - português</option>
                <option value="ru">Russian - русский</option>
                <option value="ar">Arabic - العربية</option>
                <option value="hi">Hindi - हिन्दी</option>
            </optgroup>
            <optgroup label="🇪🇺 European">
                <option value="sq">Albanian - shqip</option>
                <option value="hy">Armenian - հայերեն</option>
                <option value="az">Azerbaijani - azərbaycan dili</option>
                <option value="be">Belarusian - беларуская</option>
                <option value="bs">Bosnian - bosanski</option>
                <option value="bg">Bulgarian - български</option>
                <option value="ca">Catalan - català</option>
                <option value="co">Corsican - corsu</option>
                <option value="hr">Croatian - hrvatski</option>
                <option value="cs">Czech - čeština</option>
                <option value="da">Danish - dansk</option>
                <option value="nl">Dutch - Nederlands</option>
                <option value="et">Estonian - eesti</option>
                <option value="fi">Finnish - suomi</option>
                <option value="fy">Frisian - Frysk</option>
                <option value="gl">Galician - galego</option>
                <option value="el">Greek - Ελληνικά</option>
                <option value="hu">Hungarian - magyar</option>
                <option value="is">Icelandic - íslenska</option>
                <option value="ga">Irish - Gaeilge</option>
                <option value="it">Italian - italiano</option>
                <option value="la">Latin - Latina</option>
                <option value="lv">Latvian - latviešu</option>
                <option value="lt">Lithuanian - lietuvių</option>
                <option value="mk">Macedonian - македонски</option>
                <option value="mt">Maltese - Malti</option>
                <option value="no">Norwegian - norsk</option>
                <option value="pl">Polish - polski</option>
                <option value="ro">Romanian - română</option>
                <option value="gd">Scottish Gaelic - Gàidhlig</option>
                <option value="sr">Serbian - српски</option>
                <option value="sk">Slovak - slovenčina</option>
                <option value="sl">Slovenian - slovenščina</option>
                <option value="sv">Swedish - svenska</option>
                <option value="tr">Turkish - Türkçe</option>
                <option value="uk">Ukrainian - українська</option>
                <option value="cy">Welsh - Cymraeg</option>
            </optgroup>
            <optgroup label="🌏 Asian">
                <option value="bn">Bangla - বাংলা</option>
                <option value="ka">Georgian - ქართული</option>
                <option value="gu">Gujarati - ગુજરાતી</option>
                <option value="he">Hebrew - עברית</option>
                <option value="id">Indonesian - Bahasa Indonesia</option>
                <option value="kk">Kazakh - қазақ тілі</option>
                <option value="km">Khmer - ខ្មែរ</option>
                <option value="ku">Kurdish - kurdî</option>
                <option value="ky">Kyrgyz - кыргызча</option>
                <option value="lo">Lao - ລາວ</option>
                <option value="ms">Malay - Bahasa Melayu</option>
                <option value="mr">Marathi - मराठी</option>
                <option value="mn">Mongolian - монгол</option>
                <option value="ne">Nepali - नेपाली</option>
                <option value="ps">Pashto - پښتو</option>
                <option value="pa">Punjabi - ਪੰਜਾਬੀ</option>
                <option value="sd">Sindhi - سنڌي</option>
                <option value="si">Sinhala - සිංහල</option>
                <option value="tg">Tajik - тоҷикӣ</option>
                <option value="ta">Tamil - தமிழ்</option>
                <option value="tt">Tatar - татарча</option>
                <option value="te">Telugu - తెలుగు</option>
                <option value="th">Thai - ไทย</option>
                <option value="tk">Turkmen - türkmençe</option>
                <option value="ur">Urdu - اردو</option>
                <option value="ug">Uyghur - ئۇيغۇرچە</option>
                <option value="uz">Uzbek - o'zbek</option>
                <option value="vi">Vietnamese - Tiếng Việt</option>
            </optgroup>
            <optgroup label="🌍 Other">
                <option value="af">Afrikaans</option>
                <option value="am">Amharic - አማርኛ</option>
                <option value="eu">Basque - euskara</option>
                <option value="fil">Filipino</option>
                <option value="ha">Hausa</option>
                <option value="haw">Hawaiian - ʻŌlelo Hawaiʻi</option>
                <option value="kn">Kannada - ಕನ್ನಡ</option>
                <option value="ml">Malayalam - മലയാളം</option>
                <option value="od">Odia - ଓଡ଼ିଆ</option>
                <option value="fa">Persian - فارسی</option>
                <option value="sn">Shona - chiShona</option>
                <option value="so">Somali - Soomaali</option>
                <option value="st">Sotho - Sesotho</option>
                <option value="su">Sundanese - Basa Sunda</option>
                <option value="sw">Swahili - Kiswahili</option>
                <option value="xh">Xhosa - isiXhosa</option>
                <option value="yi">Yiddish - ייִדיש</option>
                <option value="yo">Yoruba - Èdè Yorùbá</option>
                <option value="zu">Zulu - isiZulu</option>
            </optgroup>
        `;
    
    if (languages) {
        languages.innerHTML = languagesHtml;
    }
    
    if (settingsLanguages) {
        settingsLanguages.innerHTML = languagesHtml;
        // Sync selected value
        var savedLang = window.localStorage.getItem('languages') || 'en';
        settingsLanguages.value = savedLang;
    }
    
    // Note: Menu toggle event is handled by SettingsModal.bindEvents()
    
    // Set adult content default
    if (window.localStorage.getItem('bannedcountries') != 'true' && window.localStorage.getItem('adult') == 'open') {
        var adultban = DOM.$('#adultban');
        if (adultban) adultban.checked = true;
        
        var currentLang = window.localStorage.getItem('languages') || 'en';
        var buttonText = AdultTranslations.getButtonText(currentLang);
        var descText = AdultTranslations.getDescriptionText(currentLang);
        var mobile = DOM.$('.mobile');
        if (mobile) {
            DOM.append(mobile, `<li data-adult="true"><img src="images/sex.svg" /><dd><a href="routes/adult.html"><button class="stylebtn">${buttonText}</button></a></dd><p>${descText}</p></li>`);
        }
    }
    
    // Check sensitive content if or not - updated to use custom modal
    var adultban = DOM.$('#adultban');
    if (adultban) {
            adultban.addEventListener('change', function() {
            if (this.checked) {
                // Prevent the checkbox from being checked immediately
                this.checked = false;
                // Show custom modal
                AgeConfirmModal.show(this);
            } else {
                var mobile = DOM.$('.mobile');
                if (mobile) {
                    // Remove the adult content item by its unique identifier
                    var adultItem = mobile.querySelector('li[data-adult="true"]');
                    if (adultItem) adultItem.remove();
                }
                localStorage.removeItem('adult');
            }
        });
    }
    
    // Append log history
    var scrollidbar = DOM.$('.scrollidbar');
    if (scrollidbar) {
        scrollidbar.innerHTML = '';
        DOM.append(scrollidbar, `
            <p>[2026-11-27] V8.6.3 release Rebuild the Games catalogue UI: every card is a wrapper div with an inner link, so the favourite star and the "..." actions menu (copy link, open in a new tab) are siblings instead of being nested inside the link, with lazy-decoded images, escaped card copy, per-category counters, Recently Played and Favorites views, IME-safe debounced search mirrored into ?q=, a persisted sort order mirrored into ?sort=, and d-pad/arrow navigation that only walks rows and cards the user can actually see, with a visible focus ring, aria-current/aria-expanded state, a language-aware tab title and a storage-safe language read; the four local web games (Square Obstacles, Pong, Breakout, Tic Tac Toe) now play in the standalone catalogues/gameplay.html shell, which reports an unknown ?game= key instead of launching the first game, delegates the iframe lifecycle to the shared hot-link helper, keeps back/home keyboard operable, follows the real fullscreen state and grants in-frame fullscreen/autoplay; CI gains check-gameplay-shell.js plus deep-link-to-registry, i18n key coverage and storage-guard assertions</p>
            <p>[2026-11-25] V8.6.2 update Add a YouTube tab to Settings > Source Control with two built-in channels (Blender, Blender Studio) listed by their official RSS URLs plus user-added channel feeds; picking any YouTube channel in Theater now loads its latest videos live from that RSS feed through the configurable CORS proxy pool and plays them via YouTube's official nocookie embed</p>
            <p>[2026-11-25] V8.6.2 release Harden the hot-linked player routes: the J2ME demo now launches inside the page's embedded iframe, jar URLs run in the same player, and the broken parent-origin blob local-jar path is replaced by the official installer inside the player; BBC Micro and Apple II stop lazy-loading their iframes after the shared player reveals them from display:none, so their src assignment is no longer skipped; the Service Worker bypasses the browser HTTP cache for normal document/script/style requests and the isolated PS2/Vita/Mac/N64/rustpal route navigations while leaving images, media and Range requests on the normal cache path, rustpal falls back to the upstream site when no service worker controls the page, and the version check now guards the isolated-route cache path and the settings changelog entry</p>
            <p>[2026-11-22] V8.6.1 update Add five text games to Web Games via the generic hot-link player: A Dark Room (MPL-2.0), Life Restart 人生重开模拟器 (MIT), Candy Box 2 (GPL-3.0), Antimatter Dimensions (MIT) and 文字修仙 Xiuxian Cultivation (CC BY-NC 4.0) - each runs from its author's official hosted build in an iframe with card art hot-linked from the project repositories; regression checks now parse the game registry and the 8-language texts instead of grepping file text, a new CI check verifies every hot-linked game URL is reachable, the catalogue check replaces a tautological assertion with category floors and cross-file consistency (route pages, category tabs, local images), the player notice says works are open source or free-licensed because CC BY-NC is not open source, and the CI check scripts moved out of docs/superpowers into scripts/checks so docs/ is now local-only skill scratch space that git ignores, and a regression check guards that directory contract so a future move cannot silently drop a check from CI</p>
            <p>[2026-11-22] V8.6.0 release Harden the app before adding more content: hot-linked game card images are now cached by the service worker (including opaque cross-origin responses) and fall back to the built-in Games icon when an upstream fails, with a CI check for every remote image URL; centralise the cross-origin-isolation reload dance in a shared hot-link player helper used by all isolated player pages; make js/version.js the single source of truth for the settings badge and backup export (a consistency check keeps the manifest, service-worker cache name and changelog in sync); shrink nine oversized screenshots to right-sized WebP images (~3MB saved); and move the 24 i18n page pairs into one JSON manifest so adding a page no longer means editing the workflow</p>
            <p>[2026-11-22] V8.5.9 update Add Legend of Sword and Fairy (DOS) to Recomp with a Rust/WASM engine port shown in a hot-linked iframe (per-page COOP/COEP via the service worker, no game files bundled), move 112 of 123 game card images to hot-linked public URLs and remove 106 unused local SVGs, restore the missing Recomp card image with a working URL, keep dark-background icons visible with white/brand-coloured Simple Icons, and cover the new player page in the CI i18n pairing check</p>
            <p>[2026-11-22] V8.5.9 release Redesign Source Control with a proxy-row layout: built-in sources are now listed per tab with their URLs and enable checkboxes, and Movie/Adult support adding custom Apple CMS collection APIs that feed straight into the source dropdowns; unify the top bar across every module (TV/Radio fixed 70px headers, frosted-glass player toolbars on all game and player pages), fix the few-result card-stretch grid bug in Novel/Manga/Adult, translate the new inline settings texts in all 96 languages, and fix a language-switch regression that reset saved source selections</p>
            <p>[2026-11-21] V8.5.8 release Consolidate every CORS proxy into one unified pool with a persistent health cache: a proxy that just failed is demoted for 1-30 minutes instead of stalling the next request, binary-corrupting proxies get a long cooldown and are skipped by the downloaders, every fetch path re-reads the pool per request so demotions and proxies added in Settings take effect without a page reload, and each failover attempt now has its own timeout so a hung proxy can no longer freeze the page; also reorder the built-in proxies by measured health (corsmirror, corsfix, luckydesigner, cors.lol) and translate the whole interface into 96 languages</p>
            <p>[2026-11-21] V8.5.7 release Refresh the Theatre and Adult source line-ups (drop dead APIs, add working ones and a YouTube source), rebuild the Settings modal as a full-screen two-column panel with persistent navigation, keep the Porn source category in sync with the Sensitive Content toggle and the Basic settings badge, localize the source-type tabs in every UI language with a safe fallback, and harden the global keyboard handler against non-element event targets</p>
            <p>[2026-11-21] V8.5.6 release Add a curated YouTube source to Theatre: 7 Blender Foundation / Blender Studio open movies (Big Buck Bunny, Sintel, Tears of Steel, Elephants Dream, Cosmos Laundromat, Agent 327 and Spring) play through YouTube's official privacy-enhanced iframe with controls, branding and channel links intact; the small hand-picked white list needs no API key, never fetches or stores a direct video URL, supports category filters and local search, and its source picker is fully translated into all 8 UI languages; also hot-link the AI-generated 3D game Mist Gate in Web Games and fix Theatre cards stretching into tall strips when only a few results are shown</p>
            <p>[2026-11-20] V8.5.5 release Add PDF support to the local manga reader: .pdf files are accepted alongside images and each PDF becomes one chapter, rendered page by page with a vendored pdf.js copy (CDN fallback only) so it works offline; a single open is capped at 400 pages and yields to the browser every 4 pages with progress shown, switching chapters cancels the running render and frees its page images, and a truncated book says so; also harden local storage (quota-aborted writes no longer report success, one cached IndexedDB connection, unambiguous file ids), surface partially-resolved chapters and scan truncation instead of silently dropping files, fix large-file text decoding (stack overflow, strict GB18030 fallback, real error messages), and unify every route header</p>
            <p>[2026-11-19] V8.5.4 release Add a browser-local media library to the Novel, Manga, Music and Video pages: pick your own files or a whole folder (TXT/Markdown, images, audio, video) and read or play them locally without uploading anything; folder grants and reading positions persist in IndexedDB, a whole folder is scanned once per chapter/playlist instead of once per file, playback progress is written at most once every 5 seconds, and every local panel is localized in 8 UI languages (zh, en, ja, ko, fr, de, es, ru)</p>
            <p>[2026-11-19] V8.5.3 release Embed the PS Vita emulator (vitaslop, MIT) and the PS2 emulator (TabStationToo, PCSX2 compiled to WebAssembly, GPL-3.0) in-app, replacing the PS2 external link - both hot-link their official hosted web apps inside the player page and run entirely client-side with your own files (nothing is bundled or uploaded); cross-origin isolation is granted per-page via a service-worker COOP/COEP injection on the two player routes with credentialless iframes and the cross-origin-isolated permission delegation, so SharedArrayBuffer works inside the embedded frames</p>
            <p>[2026-11-18] V8.5.2 release Add 10 open-source web games to Web Games via a generic ?game= hot-link player page (2048, Pac-Man, T-Rex Runner, Space Invaders, SkiFree, Flappy Bird, HexGL, Astray, Q1K3, Underrun); the Others category was renamed to Web Games</p>
            <p>[2026-11-18] V8.5.2 release Add Diablo (diabloweb WebAssembly port, shareware episode included, bring-your-own DIABDAT.MPQ for the full game) and Zelda II: The Adventure of Link (z2rs Rust/WebAssembly clean-room reconstruction, bring-your-own ROM) to the Recomp game category</p>
            <p>[2026-11-18] V8.5.1 release Add Palm OS and WIPI mobile emulators (CloudpilotEmu + WIE, hot-linked embeds) to the Mobile game category and Red Alert 2 (RA2 VM hot-link, bring-your-own-files, Alpha) to the new Recomp game category; fixed duplicate game card IDs that broke favorites and Continue Playing for the Retro PC/BBC Micro/Apple II/WASM-4/PICO-8/MSX/J2ME entries</p>
            <p>[2026-11-17] V8.5.0 release Add game favorites and Continue Playing section on game page, gamepad and keyboard navigation for the game hub, settings Backup &amp; Restore (export/import all app data as JSON), slimmed service worker precache to index shell for faster install, Tamaweb virtual pet game (vendored from autosam/Tamaweb, CC BY-NC-SA 4.0)</p>
            <p>[2026-11-17] V8.4.9 release Add MSX emulator (WebMSX embed, 3 open-source homebrew presets) and J2ME mobile games (J2meJS embed, jar URL/upload), new Computers and Mobile game categories, game page category deep-link fix, PICO-8 preset list alignment fix</p>
            <p>[2026-11-17] V8.4.8 release Fix invisible v86/WASM-4 emulator screens, Win30 auto-boot and centered 4:3 graphics, loading spinners for embedded BBC Micro/Apple II, mobile search input auto-zoom on iOS</p>
            <p>[2026-11-16] V8.4.7 release Add DOS game support (js-dos) with 100 preset games, x86 Retro PC (v86), BBC Micro (jsbeeb), Apple II (apple2js), WASM-4 fantasy console, ColecoVision BIOS upload, neon rebuilds of Breakout and Tic Tac Toe, removed 13 unused files</p>
            <p>[2026-11-16] V8.4.6 release Add Flash game player (Ruffle) with 100 preset games, 3DO BIOS upload, movie source selection dialog with archive.org classic movies</p>
            <p>[2026-11-10] V8.4.5 release Add second data sources for novels and manga</p>
            <p>[2026-09-25] V8.4.3 release Add dynamic ROM loading with 5000+ preset ROMs across 5 platforms</p>
            <p>[2026-05-18] V8.4.2 release change jQuery to JavaScript</p>
            <p>[2026-05-18] V8.4.1 release fixed some bugs</p>
            <p>[2026-05-18] V8.4.0 release improved podcast browsing and added podcast favorites</p>
            <p>[2026-05-17] V8.3.0 release Add retro console game emulator</p>
            <p>[2026-05-17] V8.2.3 release Add video autoplay next episode feature</p>
            <p>[2026-05-16] V8.2.2 release fixed some bugs</p>
            <p>[2026-05-16] V8.2.1 release beautify UI</p>
            <p>[2021-10-09] V8.2.0 release support to play one game</p>
            <p>[2021-10-06] V8.1.1 release Add about feature and fixed some bugs</p>
            <p>[2021-10-02] V8.1.0 release Add source control feature</p>
            <p>[2021-10-01] Delete one invalid manga source and add log history</p>
            <p>[2021-09-16] V8.0.0 release support to listen to music online</p>
            <p>[2021-09-15] V7.0.0 release support to read manga books</p>
            <p>[2021-09-13] V6.0.0 release support to read novel books</p>
            <p>[2021-09-08] V5.0.0 release support to listen 28000+ radio stations</p>
            <p>[2021-09-04] V4.0.0 release support to watch movies, series, cartoon...</p>
            <p>[2021-08-31] V3.0.0 release support to watch IPTV</p>
            <p>[2021-08-29] V2.0.0 release support to search IPTV channels</p>
            <p>[2021-08-29] V1.1.0 release pure code</p>
            <p>[2021-08-28] V1.0.3 release support to remark favorite channels</p>
            <p>[2021-04-21] V1.0.0 release</p>
        `);
    }
    
    // Show QRcode
    var circlesconLis = DOM.$$('.circlescon li');
    if (circlesconLis.length > 3) {
        circlesconLis[3].addEventListener('click', function() {
            var qrcode = DOM.$('.qrcode');
            if (qrcode) {
                qrcode.style.display = qrcode.style.display === 'block' ? 'none' : 'block';
            }
        });
        circlesconLis[3].addEventListener('mouseleave', function() {
            var qrcode = DOM.$('.qrcode');
            if (qrcode) {
                qrcode.style.display = 'none';
            }
        });
    }
});

// Go to source nextpage
// Hide the Sensitive Content toggle in settings for banned countries
function hideSensitiveContent() {
    var sensitiveSetting = DOM.$('#sensitive-setting');
    if (sensitiveSetting) sensitiveSetting.style.display = 'none';
    // Keep the Basic Settings badge in sync with the number of visible items.
    var basicPage = DOM.$('.settings-page[data-page="basic"]');
    var basicNav = DOM.$('.settings-nav-item[data-target="basic"]');
    if (basicPage && basicNav) {
        var badge = basicNav.querySelector('.nav-badge');
        var visibleItems = Array.prototype.filter.call(
            basicPage.querySelectorAll('.settings-item'),
            function (item) { return item.style.display !== 'none'; }
        ).length;
        if (badge) badge.textContent = String(visibleItems);
    }
    // Sensitive Content is unavailable here, so do not leave Porn sources
    // reachable from a previously saved "adult=open" state.
    window.localStorage.removeItem('adult');
    if (typeof SettingsModal !== 'undefined' && SettingsModal.syncPornVisibility) {
        SettingsModal.syncPornVisibility();
    }
}

// Get User IP
function getUserIp() {
    LoadingManager.show();
    
    fetch('https://api.ipdata.co/?api-key=7910661894e758448cbebb4a636485005498427178dea6ef0e911311', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(10000)
    })
    .then(function(response) {
        LoadingManager.hide();
        if (response.ok) {
            return response.json();
        }
        throw new Error('IP API request failed');
    })
    .then(function(data) {
        if (data && data.country_code) {
            var country = data.country_code.toLowerCase();
            if (['cn', 'hk', 'mo', 'kp'].indexOf(country) !== -1) {
                window.localStorage.setItem('bannedcountries', 'true');
                hideSensitiveContent();
            }
        }
    })
    .catch(function(error) {
        LoadingManager.hide();
        console.warn('IP API request failed, trying geolocation');
        getCoordintes();
    });
}

// Step 1: Get user coordinates
function getCoordintes() {
    LoadingManager.show();
    
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function success(pos) {
        var crd = pos.coords;
        var lat = crd.latitude.toString();
        var lng = crd.longitude.toString();
        
        fetch("https://us1.locationiq.com/v1/reverse.php?key=pk.dd067483fe694f72f04c0fdd2d312091&lat=" + lat + "&lon=" + lng + "&format=json", {
            signal: AbortSignal.timeout(8000)
        })
        .then(function(response) {
            LoadingManager.hide();
            if (response.ok) {
                return response.json();
            }
            throw new Error('Geolocation API request failed');
        })
        .then(function(data) {
            if (data && data.address && data.address.country_code) {
                var country = data.address.country_code.toLowerCase();
                if (['cn', 'hk', 'mo', 'kp'].indexOf(country) !== -1) {
                    window.localStorage.setItem('bannedcountries', 'true');
                    hideSensitiveContent();
                }
            }
        })
        .catch(function(error) {
            LoadingManager.hide();
            console.warn('Geolocation API request failed');
        });
    }

    function error(err) {
        LoadingManager.hide();
        console.warn('Geolocation error:', err.message);
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error, options);
    } else {
        LoadingManager.hide();
        console.warn('Geolocation is not supported by this browser');
    }
}
