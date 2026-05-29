/**
 * i18n.js - Professional Translation System
 * Handles instant language switching, RTL/LTR layout, and persistent storage.
 */

class I18nManager {
    constructor() {
        this.currentLang = localStorage.getItem('selectedLanguage') || 'en';
        this.translations = {};
        this.init();
    }

    async init() {
        await this.loadTranslations(this.currentLang);
        this.applyTranslations();
        this.applyLayout(this.currentLang);
        this.setupEventListeners();
    }

    async loadTranslations(lang) {
        try {
            const response = await fetch(`/static/js/translations/${lang}.json`);
            this.translations = await response.json();
        } catch (error) {
            console.error(`Failed to load translations for ${lang}:`, error);
        }
    }

    applyTranslations() {
        // Translate text content and placeholders
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (this.translations[key]) {
                const translation = this.translations[key];
                
                if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && el.hasAttribute('placeholder')) {
                    el.placeholder = translation;
                } else if (el.tagName === 'INPUT' && (el.type === 'button' || el.type === 'submit')) {
                    el.value = translation;
                } else {
                    // Smart translation: only update the text nodes to preserve icons/HTML
                    let foundTextNode = false;
                    el.childNodes.forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                            node.textContent = translation;
                            foundTextNode = true;
                        }
                    });
                    
                    // Fallback for elements with no text nodes yet
                    if (!foundTextNode && el.children.length === 0) {
                        el.textContent = translation;
                    }
                }
            }
        });

        // Translate titles (tooltips)
        const titleElements = document.querySelectorAll('[data-i18n-title]');
        titleElements.forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (this.translations[key]) {
                el.setAttribute('title', this.translations[key]);
            }
        });
    }

    applyLayout(lang) {
        const html = document.documentElement;
        const isAr = lang === 'ar';
        
        html.setAttribute('lang', lang);
        html.setAttribute('dir', isAr ? 'rtl' : 'ltr');
        
        // Apply Arabic-friendly fonts and general body adjustments
        if (isAr) {
            html.style.fontFamily = "'Cairo', 'Tajawal', sans-serif";
            document.body.classList.add('rtl-active');
        } else {
            html.style.fontFamily = ""; // Reset to default
            document.body.classList.remove('rtl-active');
        }

        // Trigger custom event for other components to react
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang, isAr } }));
    }

    async switchLanguage(lang) {
        if (lang === this.currentLang) return;
        
        // Add a smooth fade-out transition
        document.body.style.opacity = '0.5';
        document.body.style.transition = 'opacity 0.2s ease';
        
        setTimeout(async () => {
            this.currentLang = lang;
            localStorage.setItem('selectedLanguage', lang);
            
            await this.loadTranslations(lang);
            this.applyTranslations();
            this.applyLayout(lang);
            
            // Fade back in
            document.body.style.opacity = '1';
        }, 200);
    }

    setupEventListeners() {
        // Find all elements that should trigger language switch
        const switchers = document.querySelectorAll('[data-switch-lang]');
        switchers.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = btn.getAttribute('data-switch-lang');
                this.switchLanguage(lang);
            });
        });
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.i18n = new I18nManager();
});
