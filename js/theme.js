/**
 * js/theme.js
 * LarasLogika Dark Mode & Theme Management System
 * Handles persistent Dark/Light mode switching with instant DOM hydration (zero-FOUC).
 */

const ThemeManager = {
    STORAGE_KEY: 'laraslogika_theme',

    init() {
        const savedTheme = localStorage.getItem(this.STORAGE_KEY);
        let activeTheme = 'light';

        if (savedTheme === 'dark' || savedTheme === 'light') {
            activeTheme = savedTheme;
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // Default to dark if system prefers dark
            activeTheme = 'dark';
        }

        this.applyTheme(activeTheme, false);

        // Listen for OS theme preference changes if user hasn't explicitly chosen
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem(this.STORAGE_KEY)) {
                    this.applyTheme(e.matches ? 'dark' : 'light', true);
                }
            });
        }
    },

    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || 'light';
    },

    applyTheme(theme, save = true) {
        document.documentElement.setAttribute('data-theme', theme);
        if (save) {
            localStorage.setItem(this.STORAGE_KEY, theme);
        }
        this.updateButtons(theme);

        // Dispatch custom event for visual components / charts
        window.dispatchEvent(new CustomEvent('laraslogika:themechange', { detail: { theme } }));
    },

    toggleTheme() {
        const current = this.getCurrentTheme();
        const next = current === 'dark' ? 'light' : 'dark';
        this.applyTheme(next, true);

        // Visual toast if UI is ready
        if (window.UI && typeof UI.showToast === 'function') {
            UI.showToast(next === 'dark' ? '🌙 Mode Gelap diaktifkan' : '☀️ Mode Terang diaktifkan', 'info');
        }
    },

    updateButtons(theme) {
        const isDark = theme === 'dark';
        const buttons = document.querySelectorAll('.theme-toggle-btn');
        buttons.forEach(btn => {
            const iconEl = btn.querySelector('.theme-toggle-icon');
            const textEl = btn.querySelector('.theme-toggle-text');
            
            if (iconEl) {
                iconEl.textContent = isDark ? '☀️' : '🌙';
            }
            if (textEl) {
                textEl.textContent = isDark ? 'Mode Terang' : 'Mode Gelap';
            }
            
            btn.setAttribute('title', isDark ? 'Beralih ke Mode Terang (Light Mode)' : 'Beralih ke Mode Gelap (Dark Mode)');
            btn.setAttribute('aria-label', isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap');
            
            if (isDark) {
                btn.classList.add('is-dark');
            } else {
                btn.classList.remove('is-dark');
            }
        });
    }
};

// Immediate early execution to prevent Flash of Unstyled Content (FOUC)
(function() {
    try {
        const saved = localStorage.getItem('laraslogika_theme');
        if (saved === 'dark' || (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    } catch (e) {
        // localStorage might fail in restricted iframe environments
    }
})();

// Attach to DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
} else {
    ThemeManager.init();
}

window.ThemeManager = ThemeManager;
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}
