// theme-switcher.js - Hook into your existing WordPress button

class ThemeSwitcher {
    constructor() {
        this.currentTheme = this.getSavedTheme();
        this.init();
    }
    
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            // Apply saved theme immediately
            this.applyTheme(this.currentTheme);
            
            // Find and hook existing button
            this.findAndHookButtons();
        });
    }
    
    findAndHookButtons() {
        // Try multiple selectors to find your existing button
        const possibleSelectors = [
            '#theme-toggle',
            '.theme-toggle',
            '[data-theme-toggle]',
            '.wp-theme-switcher',
            '#day-night-toggle',
            '.dark-mode-toggle'
        ];
        
        let buttons = [];
        
        // Find the button using various selectors
        for (let selector of possibleSelectors) {
            const selectorButtons = document.querySelectorAll(selector);
						for (let button of selectorButtons)
            if (button) {
								buttons.push(button);
                console.log(`Found theme button with selector: ${selector}`);
            }
        }
        
        // If no button found with common selectors, scan for buttons with theme-related text
        if (!buttons.length) {
            const allButtons = document.querySelectorAll('button, a, .btn');
            for (let btn of allButtons) {
                const text = btn.textContent.toLowerCase();
                const title = (btn.getAttribute('title') || '').toLowerCase();
                const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
                
                if (text.includes('theme') || text.includes('dark') || text.includes('light') ||
                    title.includes('theme') || title.includes('dark') || title.includes('light') ||
                    ariaLabel.includes('theme') || ariaLabel.includes('dark') || ariaLabel.includes('light')) {
                    buttons.push(btn);
                    console.log('Found theme button by content analysis:', btn);
                }
            }
        }
        
        if (buttons.length) {
						console.log(buttons);
            // Hook into the existing button
            buttons.forEach(button => {
							button.addEventListener('click', (e) => {
								e.preventDefault(); // Prevent any default action
								this.toggleTheme(e.target);
							});
            });
            
            console.log('Successfully hooked into existing theme button');
        } else {
            console.warn('Could not find existing theme toggle button');
            console.log('Available buttons:', document.querySelectorAll('button, a, .btn'));
        }
    }
    
    toggleTheme(btn) {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
        this.saveTheme();
				console.log(btn);
				const btnAnchor = btn.firstElementChild;
				console.log(btnAnchor);
				btnAnchor.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
        
        console.log(`Switched to ${this.currentTheme} theme`);
    }
    
    applyTheme(theme) {
        const body = document.body;
        const html = document.documentElement;
        
        // Remove existing theme classes
        body.classList.remove('light-theme', 'dark-theme', 'theme-light', 'theme-dark');
        html.classList.remove('light-theme', 'dark-theme', 'theme-light', 'theme-dark');
        
        // Apply new theme class
        if (theme === 'light') {
            body.classList.add('light-theme');
            html.classList.add('light-theme');
        } else {
            body.classList.add('dark-theme');
            html.classList.add('dark-theme');
        }
        
        // Set data attribute for CSS targeting
        body.setAttribute('data-theme', theme);
        html.setAttribute('data-theme', theme);
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
        
        // Dispatch custom event for other scripts that might need to know
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: theme }
        }));
    }
    
    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.setAttribute('name', 'theme-color');
            document.head.appendChild(metaThemeColor);
        }
        
        // Set appropriate theme color for mobile browsers
        const color = theme === 'light' ? '#ffffff' : '#1a1a1a';
        metaThemeColor.setAttribute('content', color);
    }
    
    getSavedTheme() {
        // Check localStorage first
        const saved = localStorage.getItem('portfolio-theme');
        if (saved) return saved;
        
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }
        
        // Default to dark
        return 'dark';
    }
    
    saveTheme() {
        try {
            localStorage.setItem('portfolio-theme', this.currentTheme);
        } catch (e) {
            console.warn('Could not save theme preference:', e);
        }
    }
}

// Initialize the theme switcher
new ThemeSwitcher();

// Also listen for system theme changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        console.log('System theme changed to:', e.matches ? 'dark' : 'light');
        // Optionally auto-switch based on system preference
        // Uncomment the next lines if you want automatic system sync
        // const switcher = new ThemeSwitcher();
        // switcher.currentTheme = e.matches ? 'dark' : 'light';
        // switcher.applyTheme(switcher.currentTheme);
    });
}