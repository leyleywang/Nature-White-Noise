class MixController {
    constructor() {
        this.activeTracks = new Map();
        this.onTrackChange = null;
        this.audioContext = null;
        this.masterGain = null;
        this.noiseGenerator = null;
    }

    _initAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = 1;
            this.masterGain.connect(this.audioContext.destination);
        }
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    setNoiseGenerator(noiseGenerator) {
        this.noiseGenerator = noiseGenerator;
    }

    addTrack(sound) {
        if (this.activeTracks.has(sound.id)) {
            return false;
        }

        this._initAudioContext();

        if (this.noiseGenerator) {
            this.noiseGenerator.init(this.audioContext);
        }

        try {
            let source;
            
            if (this.noiseGenerator && sound.generatorMethod) {
                source = this.noiseGenerator[sound.generatorMethod]();
            } else if (sound.generator) {
                source = sound.generator();
            } else {
                console.error('没有可用的声音生成方式');
                return false;
            }

            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = sound.defaultVolume;

            source.connect(gainNode);
            gainNode.connect(this.masterGain);
            source.start();

            this.activeTracks.set(sound.id, {
                sound: sound,
                source: source,
                gainNode: gainNode,
                volume: sound.defaultVolume
            });

            this._notifyChange();
            return true;
        } catch (e) {
            console.error('创建音轨失败:', e);
            return false;
        }
    }

    removeTrack(soundId) {
        const track = this.activeTracks.get(soundId);
        if (track) {
            try {
                track.source.stop();
                track.source.disconnect();
                track.gainNode.disconnect();
            } catch (e) {
                console.log('停止音轨时出错:', e);
            }
            this.activeTracks.delete(soundId);
            this._notifyChange();
            return true;
        }
        return false;
    }

    setVolume(soundId, volume) {
        const track = this.activeTracks.get(soundId);
        if (track && track.gainNode) {
            const clampedVolume = Math.max(0, Math.min(1, volume));
            track.gainNode.gain.value = clampedVolume;
            track.volume = clampedVolume;
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
        if (this.audioContext && this.audioContext.state === 'running') {
            this.audioContext.suspend();
        }
    }

    resumeAll() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
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
