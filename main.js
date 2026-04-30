import AudioLibrary from './js/AudioLibrary.js';
import MixController from './js/MixController.js';
import TimerManager from './js/TimerManager.js';
import DynamicBackground from './js/DynamicBackground.js';
import FavoritesManager from './js/FavoritesManager.js';

class NatureWhiteNoiseApp {
    constructor() {
        this.audioLibrary = new AudioLibrary();
        this.mixController = new MixController();
        this.timerManager = new TimerManager();
        this.dynamicBackground = new DynamicBackground('dynamic-background');
        this.favoritesManager = new FavoritesManager();
        
        this.elements = {
            soundGrid: document.getElementById('soundGrid'),
            activeTracks: document.getElementById('activeTracks'),
            timerDisplay: document.getElementById('timerDisplay'),
            timerOptions: document.getElementById('timerOptions'),
            favoritesGrid: document.getElementById('favoritesGrid')
        };
        
        this.init();
    }

    init() {
        this.renderSoundLibrary();
        this.renderFavorites();
        
        this.setupEventListeners();
        this.setupCallbacks();
        
        this.dynamicBackground.startAnimation();
    }

    renderSoundLibrary() {
        const sounds = this.audioLibrary.getAllSounds();
        this.elements.soundGrid.innerHTML = '';

        sounds.forEach(sound => {
            const soundCard = document.createElement('div');
            soundCard.className = 'sound-card';
            soundCard.dataset.soundId = sound.id;
            soundCard.innerHTML = `
                <span class="sound-icon">${sound.icon}</span>
                <h3 class="sound-name">${sound.name}</h3>
                <p class="sound-description">${sound.description}</p>
            `;
            soundCard.addEventListener('click', () => this.toggleSound(sound.id));
            this.elements.soundGrid.appendChild(soundCard);
        });
    }

    renderActiveTracks() {
        const activeTracks = this.mixController.getActiveTracks();
        
        if (activeTracks.length === 0) {
            this.elements.activeTracks.innerHTML = `
                <p class="no-tracks-message">点击声音库中的声音开始播放</p>
            `;
            return;
        }

        let html = '';
        activeTracks.forEach(track => {
            const volumePercent = Math.round(track.volume * 100);
            html += `
                <div class="track-item" data-sound-id="${track.sound.id}">
                    <span class="track-icon">${track.sound.icon}</span>
                    <div class="track-info">
                        <span class="track-name">${track.sound.name}</span>
                    </div>
                    <div class="volume-control">
                        <input type="range" 
                               class="volume-slider" 
                               min="0" 
                               max="100" 
                               value="${volumePercent}"
                               data-sound-id="${track.sound.id}">
                        <span class="volume-value">${volumePercent}%</span>
                    </div>
                    <button class="remove-track-btn" data-sound-id="${track.sound.id}">×</button>
                </div>
            `;
        });

        const currentMix = this.mixController.getCurrentMixState();
        const hasActiveTracks = currentMix.tracks.length > 0;
        
        if (hasActiveTracks) {
            html += `
                <div class="save-favorite-container">
                    <input type="text" class="save-favorite-input" id="favoriteNameInput" placeholder="为此混音组合命名...">
                    <button class="save-favorite-btn" id="saveFavoriteBtn">保存收藏</button>
                </div>
            `;
        }

        this.elements.activeTracks.innerHTML = html;

        this.setupTrackEventListeners();

        if (hasActiveTracks) {
            this.setupSaveFavoriteListener();
        }
    }

    renderFavorites() {
        const favorites = this.favoritesManager.getAllFavorites();
        
        if (favorites.length === 0) {
            this.elements.favoritesGrid.innerHTML = `
                <p class="no-favorites-message">暂无收藏的混音组合</p>
            `;
            return;
        }

        let html = '';
        favorites.forEach(favorite => {
            const soundTags = favorite.mixState.tracks.map(track => 
                `<span class="favorite-sound-tag">${track.icon} ${track.soundName}</span>`
            ).join('');

            html += `
                <div class="favorite-item" data-favorite-id="${favorite.id}">
                    <h3 class="favorite-name">${favorite.name}</h3>
                    <div class="favorite-sounds">
                        ${soundTags}
                    </div>
                    <div class="favorite-actions">
                        <button class="favorite-btn play" data-favorite-id="${favorite.id}">播放</button>
                        <button class="favorite-btn remove" data-favorite-id="${favorite.id}">删除</button>
                    </div>
                </div>
            `;
        });

        this.elements.favoritesGrid.innerHTML = html;
        
        this.setupFavoritesEventListeners();
    }

    setupEventListeners() {
        const timerButtons = this.elements.timerOptions.querySelectorAll('.timer-btn');
        timerButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const duration = parseInt(e.target.dataset.duration);
                this.setTimer(duration);
                
                timerButtons.forEach(b => b.classList.remove('active'));
                if (duration > 0) {
                    e.target.classList.add('active');
                }
            });
        });
    }

    setupTrackEventListeners() {
        const volumeSliders = this.elements.activeTracks.querySelectorAll('.volume-slider');
        volumeSliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                const soundId = e.target.dataset.soundId;
                const volume = parseInt(e.target.value) / 100;
                this.mixController.setVolume(soundId, volume);
                
                const valueSpan = e.target.parentElement.querySelector('.volume-value');
                if (valueSpan) {
                    valueSpan.textContent = `${e.target.value}%`;
                }
            });
        });

        const removeButtons = this.elements.activeTracks.querySelectorAll('.remove-track-btn');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const soundId = e.target.dataset.soundId;
                this.mixController.removeTrack(soundId);
                this.updateSoundCardState(soundId, false);
            });
        });
    }

    setupSaveFavoriteListener() {
        const saveBtn = document.getElementById('saveFavoriteBtn');
        const nameInput = document.getElementById('favoriteNameInput');
        
        if (saveBtn && nameInput) {
            saveBtn.addEventListener('click', () => {
                const name = nameInput.value.trim();
                const currentMix = this.mixController.getCurrentMixState();
                
                if (currentMix.tracks.length > 0) {
                    this.favoritesManager.addFavorite(name || '我的混音', currentMix);
                    nameInput.value = '';
                }
            });
        }
    }

    setupFavoritesEventListeners() {
        const playButtons = this.elements.favoritesGrid.querySelectorAll('.favorite-btn.play');
        const removeButtons = this.elements.favoritesGrid.querySelectorAll('.favorite-btn.remove');

        playButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const favoriteId = e.target.dataset.favoriteId;
                this.favoritesManager.restoreFavorite(
                    favoriteId, 
                    this.mixController, 
                    this.audioLibrary
                );
            });
        });

        removeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const favoriteId = e.target.dataset.favoriteId;
                this.favoritesManager.removeFavorite(favoriteId);
            });
        });
    }

    setupCallbacks() {
        this.mixController.setOnTrackChange((tracks) => {
            this.renderActiveTracks();
            this.dynamicBackground.updateThemeByTracks(tracks);
            
            tracks.forEach(track => {
                this.updateSoundCardState(track.sound.id, true);
            });
            
            const activeIds = this.mixController.getActiveSoundIds();
            const allSoundIds = this.audioLibrary.getAllSounds().map(s => s.id);
            allSoundIds.forEach(id => {
                if (!activeIds.includes(id)) {
                    this.updateSoundCardState(id, false);
                }
            });
        });

        this.timerManager.setOnTimerUpdate((timerState) => {
            this.elements.timerDisplay.textContent = timerState.display;
        });

        this.timerManager.setOnTimerComplete(() => {
            this.mixController.stopAll();
            this.elements.timerDisplay.textContent = '--:--';
            
            const timerButtons = this.elements.timerOptions.querySelectorAll('.timer-btn');
            timerButtons.forEach(b => b.classList.remove('active'));
        });

        this.favoritesManager.setOnFavoritesChange(() => {
            this.renderFavorites();
        });
    }

    toggleSound(soundId) {
        const sound = this.audioLibrary.getSoundById(soundId);
        if (!sound) return;

        const isActive = this.mixController.toggleTrack(sound);
        this.updateSoundCardState(soundId, !isActive);
    }

    updateSoundCardState(soundId, isActive) {
        const soundCard = this.elements.soundGrid.querySelector(`[data-sound-id="${soundId}"]`);
        if (soundCard) {
            if (isActive) {
                soundCard.classList.add('active');
            } else {
                soundCard.classList.remove('active');
            }
        }
    }

    setTimer(durationMinutes) {
        if (durationMinutes === 0) {
            this.timerManager.stop();
            this.elements.timerDisplay.textContent = '--:--';
        } else {
            this.timerManager.start(durationMinutes);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NatureWhiteNoiseApp();
});
