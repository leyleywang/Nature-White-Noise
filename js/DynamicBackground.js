class DynamicBackground {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentTheme = 'night';
        this.animationInterval = null;
        this.colorIndex = 0;
        this.isAnimating = false;
        
        this.themes = {
            night: [
                'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                'linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #415a77 100%)',
                'linear-gradient(135deg, #1a1a2e 0%, #2d003d 50%, #16213e 100%)',
                'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2a2a5e 100%)'
            ],
            forest: [
                'linear-gradient(135deg, #1a4314 0%, #2d5a27 50%, #3d6b37 100%)',
                'linear-gradient(135deg, #1a3d1a 0%, #2a5a2a 50%, #3a7a3a 100%)',
                'linear-gradient(135deg, #0d2818 0%, #1a4d2e 50%, #2d6b45 100%)',
                'linear-gradient(135deg, #183d1f 0%, #2a5f33 50%, #3c7f47 100%)'
            ],
            ocean: [
                'linear-gradient(135deg, #023e8a 0%, #0077b6 50%, #0096c7 100%)',
                'linear-gradient(135deg, #03045e 0%, #023e8a 50%, #0077b6 100%)',
                'linear-gradient(135deg, #001219 0%, #005f73 50%, #0a9396 100%)',
                'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)'
            ],
            fire: [
                'linear-gradient(135deg, #1a0a0a 0%, #2d1a1a 50%, #3d2a2a 100%)',
                'linear-gradient(135deg, #2c0a0a 0%, #4a1a1a 50%, #6a2a2a 100%)',
                'linear-gradient(135deg, #1a0a00 0%, #3d1a00 50%, #5f2a00 100%)',
                'linear-gradient(135deg, #1a0a0a 0%, #3a1a1a 50%, #5a2a2a 100%)'
            ],
            sunset: [
                'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #ff9ff3 100%)',
                'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
                'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
                'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
            ],
            calm: [
                'linear-gradient(135deg, #e0e5ec 0%, #a3b1c6 50%, #6b7b8c 100%)',
                'linear-gradient(135deg, #d4d4d4 0%, #a8a8a8 50%, #787878 100%)',
                'linear-gradient(135deg, #c9d6ff 0%, #e2e2e2 50%, #f0f0f0 100%)',
                'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)'
            ]
        };
    }

    setTheme(themeName) {
        if (this.themes[themeName]) {
            this.currentTheme = themeName;
            this.colorIndex = 0;
            this._applyCurrentColor();
        }
    }

    startAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this._applyCurrentColor();
        
        this.animationInterval = setInterval(() => {
            this._nextColor();
        }, 8000);
    }

    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        this.isAnimating = false;
    }

    _nextColor() {
        const colors = this.themes[this.currentTheme];
        this.colorIndex = (this.colorIndex + 1) % colors.length;
        this._applyCurrentColor();
    }

    _applyCurrentColor() {
        const colors = this.themes[this.currentTheme];
        if (colors && colors[this.colorIndex]) {
            this.container.style.background = colors[this.colorIndex];
        }
    }

    determineThemeByActiveTracks(activeTracks) {
        if (activeTracks.length === 0) {
            return 'night';
        }

        const categories = activeTracks.map(track => track.sound.category);
        
        const hasWater = categories.some(cat => cat === 'water');
        const hasFire = categories.some(cat => cat === 'fire');
        const hasWind = categories.some(cat => cat === 'wind');
        const hasNature = categories.some(cat => cat === 'nature');
        const hasWeather = categories.some(cat => cat === 'weather');

        if (hasFire && !hasWater) {
            return 'fire';
        }
        if (hasWater && hasNature) {
            return 'forest';
        }
        if (hasWater && !hasFire) {
            return 'ocean';
        }
        if (hasNature && hasWind) {
            return 'forest';
        }
        if (hasWeather) {
            return 'sunset';
        }
        
        return 'night';
    }

    updateThemeByTracks(activeTracks) {
        const newTheme = this.determineThemeByActiveTracks(activeTracks);
        if (newTheme !== this.currentTheme) {
            this.setTheme(newTheme);
        }
    }

    getAvailableThemes() {
        return Object.keys(this.themes);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }
}

export default DynamicBackground;
