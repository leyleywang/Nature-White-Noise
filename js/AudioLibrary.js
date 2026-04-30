class NoiseGenerator {
    constructor() {
        this.audioContext = null;
    }

    init(audioContext) {
        this.audioContext = audioContext;
    }

    createWhiteNoise() {
        const bufferSize = 2 * this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        return noise;
    }

    createPinkNoise() {
        const bufferSize = 2 * this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        let b0, b1, b2, b3, b4, b5, b6;
        b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
        
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            output[i] *= 0.11;
            b6 = white * 0.115926;
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        return noise;
    }

    createBrownNoise() {
        const bufferSize = 2 * this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5;
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        return noise;
    }

    createRainSound() {
        const bufferSize = 2 * this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
        const left = buffer.getChannelData(0);
        const right = buffer.getChannelData(1);
        
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            const intensity = Math.sin(i / 1000) * 0.3 + 0.7;
            left[i] = white * 0.3 * intensity;
            right[i] = Math.random() * 2 - 1;
            right[i] *= 0.3 * intensity;
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        return noise;
    }

    createFireSound() {
        const bufferSize = 2 * this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
        const left = buffer.getChannelData(0);
        const right = buffer.getChannelData(1);
        
        let crackleTimer = 0;
        let crackleIntensity = 0;
        
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            const brown = (Math.sin(i / 50) + Math.sin(i / 70) + Math.sin(i / 110)) / 3;
            
            crackleTimer++;
            if (crackleTimer > 1000 + Math.random() * 2000) {
                crackleTimer = 0;
                crackleIntensity = 0.5 + Math.random() * 0.5;
            }
            
            const crackle = crackleIntensity > 0 ? (Math.random() * 2 - 1) * crackleIntensity : 0;
            crackleIntensity *= 0.995;
            
            left[i] = (white * 0.2 + brown * 0.3 + crackle * 0.5);
            right[i] = (Math.random() * 2 - 1) * 0.2 + brown * 0.3 + (Math.random() * 2 - 1) * crackleIntensity * 0.5;
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        return noise;
    }

    createWindSound() {
        const bufferSize = 2 * this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
        const left = buffer.getChannelData(0);
        const right = buffer.getChannelData(1);
        
        for (let i = 0; i < bufferSize; i++) {
            const modulator = Math.sin(i / 2000) * Math.sin(i / 3000);
            const white = Math.random() * 2 - 1;
            
            const filtered = white * (0.5 + modulator * 0.5);
            
            left[i] = filtered * 0.4;
            right[i] = (Math.random() * 2 - 1) * 0.4 * (0.5 + modulator * 0.5);
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        return noise;
    }

    createOceanSound() {
        const bufferSize = 2 * this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
        const left = buffer.getChannelData(0);
        const right = buffer.getChannelData(1);
        
        for (let i = 0; i < bufferSize; i++) {
            const waveCycle = Math.sin(i / 8000);
            const waveIntensity = (waveCycle + 1) / 2;
            
            const white = Math.random() * 2 - 1;
            const filtered = white * (0.3 + waveIntensity * 0.7);
            
            left[i] = filtered * 0.5;
            right[i] = (Math.random() * 2 - 1) * 0.5 * (0.3 + waveIntensity * 0.7);
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        return noise;
    }

    createBirdsSound() {
        const bufferSize = 2 * this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
        const left = buffer.getChannelData(0);
        const right = buffer.getChannelData(1);
        
        let birdTimer = 0;
        let birdActive = false;
        let birdFrequency = 0;
        let birdDuration = 0;
        
        for (let i = 0; i < bufferSize; i++) {
            birdTimer++;
            
            if (!birdActive && birdTimer > 10000 + Math.random() * 20000) {
                birdActive = true;
                birdTimer = 0;
                birdFrequency = 800 + Math.random() * 1000;
                birdDuration = 500 + Math.random() * 1000;
            }
            
            if (birdActive && birdTimer < birdDuration) {
                const chirp = Math.sin(i * birdFrequency / 44100 * Math.PI * 2) * 
                             Math.sin(i * 2 * birdFrequency / 44100 * Math.PI * 2);
                const envelope = Math.sin(birdTimer / birdDuration * Math.PI);
                left[i] = chirp * envelope * 0.3;
                right[i] = Math.sin(i * (birdFrequency + 50) / 44100 * Math.PI * 2) * envelope * 0.2;
            } else {
                birdActive = false;
                left[i] = (Math.random() * 2 - 1) * 0.02;
                right[i] = (Math.random() * 2 - 1) * 0.02;
            }
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        return noise;
    }

    createCricketsSound() {
        const bufferSize = 2 * this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
        const left = buffer.getChannelData(0);
        const right = buffer.getChannelData(1);
        
        for (let i = 0; i < bufferSize; i++) {
            const chirpRate = 4000 + Math.sin(i / 1000) * 500;
            const isChirping = (i % chirpRate) < 200;
            
            if (isChirping) {
                const chirp = Math.sin(i * 4000 / 44100 * Math.PI * 2) * 
                             Math.sin(i * 8000 / 44100 * Math.PI * 2);
                left[i] = chirp * 0.15;
                right[i] = Math.sin(i * 3800 / 44100 * Math.PI * 2) * 0.12;
            } else {
                left[i] = (Math.random() * 2 - 1) * 0.01;
                right[i] = (Math.random() * 2 - 1) * 0.01;
            }
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        return noise;
    }

    createStreamSound() {
        const bufferSize = 2 * this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
        const left = buffer.getChannelData(0);
        const right = buffer.getChannelData(1);
        
        for (let i = 0; i < bufferSize; i++) {
            const bubbleMod = Math.sin(i / 300) * Math.cos(i / 500);
            const white = Math.random() * 2 - 1;
            
            const stream = white * (0.5 + bubbleMod * 0.3);
            
            left[i] = stream * 0.35;
            right[i] = (Math.random() * 2 - 1) * 0.35 * (0.7 + Math.sin(i / 700) * 0.3);
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        return noise;
    }

    createThunderSound() {
        const bufferSize = 2 * this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
        const left = buffer.getChannelData(0);
        const right = buffer.getChannelData(1);
        
        let thunderTimer = 0;
        let thunderIntensity = 0;
        
        for (let i = 0; i < bufferSize; i++) {
            thunderTimer++;
            
            if (thunderTimer > 30000 + Math.random() * 60000) {
                thunderTimer = 0;
                thunderIntensity = 1;
            }
            
            const white = Math.random() * 2 - 1;
            const rumble = Math.sin(i / 200) + Math.sin(i / 300) + Math.sin(i / 500);
            
            if (thunderIntensity > 0) {
                const envelope = thunderIntensity;
                left[i] = (white * 0.5 + rumble * 0.5) * envelope * 0.4;
                right[i] = ((Math.random() * 2 - 1) * 0.5 + rumble * 0.4) * envelope * 0.35;
                thunderIntensity *= 0.9999;
            } else {
                left[i] = white * 0.02;
                right[i] = (Math.random() * 2 - 1) * 0.02;
            }
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        return noise;
    }
}

const noiseGenerator = new NoiseGenerator();

class AudioLibrary {
    constructor() {
        this.sounds = [
            {
                id: 'rain',
                name: '雨林细雨',
                description: '轻柔的雨声，仿佛置身热带雨林',
                icon: '🌧️',
                generatorMethod: 'createRainSound',
                defaultVolume: 0.8,
                category: 'water'
            },
            {
                id: 'stream',
                name: '山间溪流',
                description: '清澈的溪水潺潺流过',
                icon: '💧',
                generatorMethod: 'createStreamSound',
                defaultVolume: 0.7,
                category: 'water'
            },
            {
                id: 'fire',
                name: '篝火噼啪',
                description: '温暖的火焰燃烧声',
                icon: '🔥',
                generatorMethod: 'createFireSound',
                defaultVolume: 0.6,
                category: 'fire'
            },
            {
                id: 'wind',
                name: '晚风穿林',
                description: '微风轻轻穿过树林',
                icon: '🌬️',
                generatorMethod: 'createWindSound',
                defaultVolume: 0.5,
                category: 'wind'
            },
            {
                id: 'birds',
                name: '鸟鸣声声',
                description: '清晨的鸟儿歌唱',
                icon: '🐦',
                generatorMethod: 'createBirdsSound',
                defaultVolume: 0.6,
                category: 'nature'
            },
            {
                id: 'ocean',
                name: '海浪拍岸',
                description: '温柔的海浪拍击沙滩',
                icon: '🌊',
                generatorMethod: 'createOceanSound',
                defaultVolume: 0.7,
                category: 'water'
            },
            {
                id: 'thunder',
                name: '远方雷鸣',
                description: '远处的雷声滚滚',
                icon: '⚡',
                generatorMethod: 'createThunderSound',
                defaultVolume: 0.4,
                category: 'weather'
            },
            {
                id: 'crickets',
                name: '夏夜虫鸣',
                description: '宁静夜晚的蟋蟀声',
                icon: '🦗',
                generatorMethod: 'createCricketsSound',
                defaultVolume: 0.5,
                category: 'nature'
            },
            {
                id: 'white',
                name: '纯白噪音',
                description: '经典的白噪音，适合专注',
                icon: '📻',
                generatorMethod: 'createWhiteNoise',
                defaultVolume: 0.5,
                category: 'noise'
            },
            {
                id: 'pink',
                name: '粉红噪音',
                description: '柔和的粉红噪音，助眠优选',
                icon: '🌸',
                generatorMethod: 'createPinkNoise',
                defaultVolume: 0.5,
                category: 'noise'
            },
            {
                id: 'brown',
                name: '布朗噪音',
                description: '深沉的布朗噪音，极度放松',
                icon: '🌰',
                generatorMethod: 'createBrownNoise',
                defaultVolume: 0.5,
                category: 'noise'
            }
        ];
    }

    getNoiseGenerator() {
        return noiseGenerator;
    }

    getAllSounds() {
        return this.sounds;
    }

    getSoundById(id) {
        return this.sounds.find(sound => sound.id === id);
    }

    getSoundsByCategory(category) {
        return this.sounds.filter(sound => sound.category === category);
    }
}

export default AudioLibrary;
