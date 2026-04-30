class MixController {
    constructor() {
        this.activeTracks = new Map();
        this.onTrackChange = null;
    }

    addTrack(sound) {
        if (this.activeTracks.has(sound.id)) {
            return false;
        }

        const audio = new Audio(sound.url);
        audio.loop = true;
        audio.volume = sound.defaultVolume;

        this.activeTracks.set(sound.id, {
            sound: sound,
            audio: audio,
            volume: sound.defaultVolume
        });

        audio.play().catch(e => {
            console.log('音频播放失败:', e);
        });

        this._notifyChange();
        return true;
    }

    removeTrack(soundId) {
        const track = this.activeTracks.get(soundId);
        if (track) {
            track.audio.pause();
            track.audio.currentTime = 0;
            this.activeTracks.delete(soundId);
            this._notifyChange();
            return true;
        }
        return false;
    }

    setVolume(soundId, volume) {
        const track = this.activeTracks.get(soundId);
        if (track) {
            track.audio.volume = volume;
            track.volume = volume;
            return true;
        }
        return false;
    }

    getVolume(soundId) {
        const track = this.activeTracks.get(soundId);
        return track ? track.volume : 0;
    }

    toggleTrack(sound) {
        if (this.activeTracks.has(sound.id)) {
            this.removeTrack(sound.id);
            return false;
        } else {
            this.addTrack(sound);
            return true;
        }
    }

    isActive(soundId) {
        return this.activeTracks.has(soundId);
    }

    getActiveTracks() {
        return Array.from(this.activeTracks.values());
    }

    getActiveSoundIds() {
        return Array.from(this.activeTracks.keys());
    }

    pauseAll() {
        this.activeTracks.forEach(track => {
            track.audio.pause();
        });
    }

    resumeAll() {
        this.activeTracks.forEach(track => {
            track.audio.play().catch(e => {
                console.log('音频恢复播放失败:', e);
            });
        });
    }

    stopAll() {
        const soundIds = Array.from(this.activeTracks.keys());
        soundIds.forEach(id => this.removeTrack(id));
    }

    setOnTrackChange(callback) {
        this.onTrackChange = callback;
    }

    _notifyChange() {
        if (this.onTrackChange) {
            this.onTrackChange(this.getActiveTracks());
        }
    }

    getCurrentMixState() {
        const tracks = this.getActiveTracks();
        return {
            tracks: tracks.map(track => ({
                soundId: track.sound.id,
                soundName: track.sound.name,
                volume: track.volume,
                icon: track.sound.icon
            })),
            timestamp: Date.now()
        };
    }

    restoreMixState(state, soundLibrary) {
        if (!state || !state.tracks) return;
        
        this.stopAll();
        
        state.tracks.forEach(trackState => {
            const sound = soundLibrary.getSoundById(trackState.soundId);
            if (sound) {
                this.addTrack(sound);
                this.setVolume(trackState.soundId, trackState.volume);
            }
        });
    }
}

export default MixController;
