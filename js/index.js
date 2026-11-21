/**
 * Easy Web TV - Main Application
 * Native JavaScript (No jQuery)
 * @version 8.5.6
 */

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
            // Ignore shortcuts when typing in input fields
            if (e.target.matches('input, textarea, select')) {
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
        var popupbox = DOM.$('#popupbox');
        var sourcebox = DOM.$('#sourcebox');
        var logbox = DOM.$('#logbox');
        var infobox = DOM.$('#infobox');
        
        if (popupbox && DOM.isVisible(popupbox)) {
            window.location.href = '#';
        }
        if (sourcebox && DOM.isVisible(sourcebox)) {
            window.location.href = '#';
        }
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
        
        // Back buttons - use direct event binding for reliability
        var backBtns = DOM.$$('#settings-modal .back-btn');
        backBtns.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                SettingsModal.showPage('main');
            });
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
            this.showPage('main');
            
            // Update button aria-expanded
            var btn = DOM.$('#menu-toggle-btn');
            if (btn) {
                btn.setAttribute('aria-expanded', 'true');
                btn.setAttribute('aria-label', 'Close settings');
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
            }
            return;
        }
        
        if (targetPage && currentPageEl !== targetPage) {
            DOM.removeClass(currentPageEl, 'active');
            DOM.addClass(currentPageEl, 'exiting');
            
            setTimeout(function() {
                DOM.removeClass(currentPageEl, 'exiting');
            }, 300);
            
            DOM.addClass(targetPage, 'active');
            this.currentPage = pageName;
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
                var sourceType = this.getAttribute('data-source-type');
                var targetOptions = DOM.$('.source-options[data-source-type="' + sourceType + '"]');
                if (targetOptions) {
                    DOM.removeClass(targetOptions, 'hidden');
                }
            });
        });
        
        // Load saved sources from localStorage
        this.loadSavedSources();
        
        // Save button click handler
        DOM.on('#save-source-btn', 'click', function() {
            SettingsModal.saveSources();
        });
    },
    
    loadSavedSources: function() {
        var sourceTypes = ['movie', 'novel', 'manga', 'music', 'porn'];
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
        var sourceTypes = ['movie', 'novel', 'manga', 'music', 'porn'];
        var hasError = false;
        
        sourceTypes.forEach(function(type) {
            var checked = [];
            document.querySelectorAll('input[name="settings-' + type + '"]:checked').forEach(function(cb) {
                checked.push(cb.value);
            });
            
            if (checked.length === 0) {
                hasError = true;
            } else {
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
                version: '8.5.6',
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
                <option value="hr">Croatian - hrvatski</option>
                <option value="cs">Czech - čeština</option>
                <option value="da">Danish - dansk</option>
                <option value="nl">Dutch - Nederlands</option>
                <option value="et">Estonian - eesti</option>
                <option value="fi">Finnish - suomi</option>
                <option value="el">Greek - Ελληνικά</option>
                <option value="hu">Hungarian - magyar</option>
                <option value="is">Icelandic - íslenska</option>
                <option value="ga">Irish - Gaeilge</option>
                <option value="it">Italian - italiano</option>
                <option value="lv">Latvian - latviešu</option>
                <option value="lt">Lithuanian - lietuvių</option>
                <option value="mk">Macedonian - македонски</option>
                <option value="mt">Maltese - Malti</option>
                <option value="no">Norwegian - norsk</option>
                <option value="pl">Polish - polski</option>
                <option value="ro">Romanian - română</option>
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
                <option value="gu">Gujarati - ગુજરાતી</option>
                <option value="he">Hebrew - עברית</option>
                <option value="id">Indonesian - Indonesia</option>
                <option value="kk">Kazakh - қазақ тілі</option>
                <option value="km">Khmer - ខ្មែរ</option>
                <option value="ky">Kyrgyz - кыргызча</option>
                <option value="lo">Lao - ລາວ</option>
                <option value="ms">Malay - Bahasa Melayu</option>
                <option value="mr">Marathi - मराठी</option>
                <option value="mn">Mongolian - монгол</option>
                <option value="ne">Nepali - नेपाली</option>
                <option value="pa">Punjabi - ਪੰਜਾਬੀ</option>
                <option value="si">Sinhala - සිංහල</option>
                <option value="ta">Tamil - தமிழ்</option>
                <option value="te">Telugu - తెలుగు</option>
                <option value="th">Thai - ไทย</option>
                <option value="ur">Urdu - اردو</option>
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
                <option value="fa">Persian - فارسی</option>
                <option value="sw">Swahili - Kiswahili</option>
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
    
    // If user back refresh page
    var link = window.location.href;
    if (link.indexOf('popupbox') > -1) {
        window.location.replace('https://zhangboheng.github.io/Easy-Web-TV-M3u8/');
    }
    
    // Set attributes to button
    var stylebtns = DOM.$$('.stylebtn');
    if (stylebtns.length > 2) {
        stylebtns[2].addEventListener('click', function() {
            this.setAttribute('title', 'selected');
            if (stylebtns.length > 4) {
                stylebtns[4].removeAttribute('title');
            }
        });
    }
    if (stylebtns.length > 4) {
        stylebtns[4].addEventListener('click', function() {
            this.setAttribute('title', 'selected');
            if (stylebtns.length > 2) {
                stylebtns[2].removeAttribute('title');
            }
        });
    }
    
    // Select TV Options
    if (stylebtns.length > 0) {
        stylebtns[0].addEventListener('click', function() {
            var selectform = DOM.$('#selectform');
            if (!selectform) return;
            
            var radioName = selectform.querySelector('input[name="radioName"]:checked');
            var btn2 = stylebtns.length > 2 ? stylebtns[2] : null;
            var btn4 = stylebtns.length > 4 ? stylebtns[4] : null;
            
            var radioValue = radioName ? radioName.value : null;
            var isBtn2Selected = btn2 ? btn2.getAttribute('title') === 'selected' : false;
            var isBtn4Selected = btn4 ? btn4.getAttribute('title') === 'selected' : false;
            
            if (radioValue == 1 && isBtn2Selected) {
                window.location.href = "routes/countries.html";
            } else if (radioValue == 2 && isBtn2Selected) {
                window.location.href = "routes/language.html";
            } else if (radioValue == 3 && isBtn2Selected) {
                window.location.href = "routes/category.html";
            } else if (radioValue == 1 && isBtn4Selected) {
                window.location.href = "routes/radio.html?t=1";
            } else if (radioValue == 2 && isBtn4Selected) {
                window.location.href = "routes/radio.html?t=2";
            } else if (radioValue == 3 && isBtn4Selected) {
                window.location.href = "routes/radio.html?t=3";
            }
        });
    }
    
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
function goToSource() {
    var sourceName = document.querySelector('input[name="sourceName"]:checked');
    if (!sourceName) return;
    
    var sourceitem = DOM.$('#sourceitem');
    if (!sourceitem) return;
    
    // Clear existing content
    sourceitem.innerHTML = '';
    
    if (sourceName.value == 1) {
        sourceitem.innerHTML = `
            <div id="selectform" style="display:flex;">
                <input type="checkbox" name="movie" value="archive_classic" checked />
                <label for="movie"> Classic Movies (EN)</label><br />
                <input type="checkbox" name="movie" value="hyzy" checked />
                <label for="movie"> 虎牙资源</label><br />
                <input type="checkbox" name="movie" value="gszy" checked />
                <label for="movie"> 光速资源</label><br />
            </div>
            <div id="selectform" style="display:flex;">
                <input type="checkbox" name="movie" value="hnzy" checked />
                <label for="movie"> 红牛资源</label><br />
                <input type="checkbox" name="movie" value="tky" checked />
                <label for="movie"> 茅台资源</label><br />
                <input type="checkbox" name="movie" value="bjy" checked />
                <label for="movie"> 如意资源</label><br />
            </div>
            <button class="stylebtn" onclick="returnSource()"><img src="./images/return.svg" style="width:30px;"></button>
        `;
        var ms = window.localStorage.getItem('movie');
        if (ms) {
            ms = ms.split(",");
            var arr = ["archive_classic", "hyzy", "gszy", "hnzy", "tky", "bjy"];
            var lst = arr.filter(function(x) { return ms.includes(x); }).map(function(x) { return arr.indexOf(x); });
            var cat = arr.filter(function(x) { return !ms.includes(x); }).map(function(x) { return arr.indexOf(x); });
            var checkboxes = document.querySelectorAll('input[name="movie"]');
            lst.forEach(function(i) {
                if (checkboxes[i]) checkboxes[i].checked = true;
            });
            cat.forEach(function(i) {
                if (checkboxes[i]) checkboxes[i].checked = false;
            });
        }
    } else if (sourceName.value == 2) {
        sourceitem.innerHTML = `
            <div id="selectform" style="display:flex;">
                <input type="checkbox" name="novel" value="novelonlinefull" checked />
                <label for="novel"> novelonlinefull</label><br />
                <input type="checkbox" name="novel" value="95sb" checked />
                <label for="novel"> 95书包</label><br />
            </div>
            <button class="stylebtn" onclick="returnSource()"><img src="./images/return.svg" style="width:30px;"></button>
        `;
        var ms = window.localStorage.getItem('novel');
        if (ms) {
            ms = ms.split(",");
            var arr = ["novelonlinefull", "95sb"];
            var lst = arr.filter(function(x) { return ms.includes(x); }).map(function(x) { return arr.indexOf(x); });
            var cat = arr.filter(function(x) { return !ms.includes(x); }).map(function(x) { return arr.indexOf(x); });
            var checkboxes = document.querySelectorAll('input[name="novel"]');
            lst.forEach(function(i) {
                if (checkboxes[i]) checkboxes[i].checked = true;
            });
            cat.forEach(function(i) {
                if (checkboxes[i]) checkboxes[i].checked = false;
            });
        }
    } else if (sourceName.value == 3) {
        sourceitem.innerHTML = `
            <div id="selectform" style="display:flex;">
                <input type="checkbox" name="manga" value="mangabuddy" checked />
                <label for="manga"> mangabuddy</label><br />
                <input type="checkbox" name="manga" value="mangadex" checked />
                <label for="manga"> mangadex</label><br />
            </div>
            <div id="selectform" style="display:flex;">
                <input type="checkbox" name="manga" value="dmmh" checked>
                <label for="manga"> 耽美漫画(PC端)</label><br />
            </div>
            <button class="stylebtn" onclick="returnSource()"><img src="./images/return.svg" style="width:30px;"></button>
        `;
        var ms = window.localStorage.getItem('manga');
        if (ms) {
            ms = ms.split(",");
            var arr = ["mangabuddy", "mangadex", "dmmh"];
            var lst = arr.filter(function(x) { return ms.includes(x); }).map(function(x) { return arr.indexOf(x); });
            var cat = arr.filter(function(x) { return !ms.includes(x); }).map(function(x) { return arr.indexOf(x); });
            var checkboxes = document.querySelectorAll('input[name="manga"]');
            lst.forEach(function(i) {
                if (checkboxes[i]) checkboxes[i].checked = true;
            });
            cat.forEach(function(i) {
                if (checkboxes[i]) checkboxes[i].checked = false;
            });
        }
    } else if (sourceName.value == 4) {
        sourceitem.innerHTML = `
            <div id="selectform" style="display:flex;">
                <input type="checkbox" name="music" value="wymusic" checked>
                <label for="music"> 网易云音乐</label><br />
            </div>
            <button class="stylebtn" onclick="returnSource()"><img src="./images/return.svg" style="width:30px;"></button>
        `;
        var ms = window.localStorage.getItem('music');
        if (ms) {
            ms = ms.split(",");
            var arr = ["wymusic"];
            var lst = arr.filter(function(x) { return ms.includes(x); }).map(function(x) { return arr.indexOf(x); });
            var cat = arr.filter(function(x) { return !ms.includes(x); }).map(function(x) { return arr.indexOf(x); });
            var checkboxes = document.querySelectorAll('input[name="music"]');
            lst.forEach(function(i) {
                if (checkboxes[i]) checkboxes[i].checked = true;
            });
            cat.forEach(function(i) {
                if (checkboxes[i]) checkboxes[i].checked = false;
            });
        }
    } else if (sourceName.value == 5) {
        sourceitem.innerHTML = `
            <div id="selectform" style="display:flex;">
                <input type="checkbox" name="porn" value="zmwzy" checked>
                <label for="porn"> 字幕网</label><br />
                <input type="checkbox" name="porn" value="fedzy" checked>
                <label for="porn"> 富二代</label><br />
                <input type="checkbox" name="porn" value="javmy" checked>
                <label for="porn"> JAV名优</label><br />
            </div>
            <div id="selectform" style="display:flex;">
                <input type="checkbox" name="porn" value="hyzy" checked>
                <label for="porn"> 环亚</label><br />
                <input type="checkbox" name="porn" value="sszy" checked>
                <label for="porn"> 色色</label><br />
                <input type="checkbox" name="porn" value="jjzy" checked>
                <label for="porn"> 玖玖</label><br />
            </div>
            <div id="selectform" style="display:flex;">
                <input type="checkbox" name="porn" value="lsnzy" checked>
                <label for="porn"> 狼少年</label><br />
                <input type="checkbox" name="porn" value="bttzy" checked>
                <label for="porn"> 博天堂</label><br />
                <input type="checkbox" name="porn" value="llzy" checked>
                <label for="porn"> 利来</label><br />
            </div>
            <button class="stylebtn" onclick="returnSource()"><img src="./images/return.svg" style="width:30px;"></button>
        `;
        var ms = window.localStorage.getItem('porn');
        if (ms) {
            ms = ms.split(",");
            var arr = ["zmwzy", "fedzy", "javmy", "hyzy", "sszy", "jjzy", "lsnzy", "bttzy", "llzy"];
            var lst = arr.filter(function(x) { return ms.includes(x); }).map(function(x) { return arr.indexOf(x); });
            var cat = arr.filter(function(x) { return !ms.includes(x); }).map(function(x) { return arr.indexOf(x); });
            var checkboxes = document.querySelectorAll('input[name="porn"]');
            lst.forEach(function(i) {
                if (checkboxes[i]) checkboxes[i].checked = true;
            });
            cat.forEach(function(i) {
                if (checkboxes[i]) checkboxes[i].checked = false;
            });
        }
    }
}

// Return source homepage
function returnSource() {
    var arr = [];
    
    document.querySelectorAll('input[name="movie"]:checked').forEach(function(el) {
        arr[0] = "movie";
        arr.push(el.value);
    });
    document.querySelectorAll('input[name="novel"]:checked').forEach(function(el) {
        arr[0] = "novel";
        arr.push(el.value);
    });
    document.querySelectorAll('input[name="manga"]:checked').forEach(function(el) {
        arr[0] = "manga";
        arr.push(el.value);
    });
    document.querySelectorAll('input[name="music"]:checked').forEach(function(el) {
        arr[0] = "music";
        arr.push(el.value);
    });
    document.querySelectorAll('input[name="porn"]:checked').forEach(function(el) {
        arr[0] = "porn";
        arr.push(el.value);
    });
    
    if (arr.length == 0) {
        ErrorToast.show('Please select at least one source...', 3000);
    } else {
        if (arr[0] == "movie") {
            window.localStorage.setItem('movie', arr.slice(1).join(","));
        } else if (arr[0] == "novel") {
            window.localStorage.setItem('novel', arr.slice(1).join(","));
        } else if (arr[0] == "manga") {
            window.localStorage.setItem('manga', arr.slice(1).join(","));
        } else if (arr[0] == "music") {
            window.localStorage.setItem('music', arr.slice(1).join(","));
        } else if (arr[0] == "porn") {
            window.localStorage.setItem('porn', arr.slice(1).join(","));
        }
        
        var sourceitem = DOM.$('#sourceitem');
        if (sourceitem) {
            sourceitem.innerHTML = `
                <div id="selectform">
                    <input type="radio" name="sourceName" value="1" checked/> <span>Moive</span> <br />
                    <input type="radio" name="sourceName" value="2" /> <span>Novel</span> <br />
                    <input type="radio" name="sourceName" value="3" /> <span>Manga</span> <br />
                    <input type="radio" name="sourceName" value="4" /> <span>Music</span> <br />
                    <input type="radio" name="sourceName" value="5" /> <span>Porn</span> <br />
                </div>
                <button class="stylebtn" onclick="goToSource()"><img src="./images/nextselect.svg" style="width:30px;"></button>
            `;
        }
    }
}

// Hide the Sensitive Content toggle in settings for banned countries
function hideSensitiveContent() {
    var sensitiveSetting = DOM.$('#sensitive-setting');
    if (sensitiveSetting) sensitiveSetting.style.display = 'none';
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
