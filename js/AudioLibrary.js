class AudioLibrary {
    constructor() {
        this.sounds = [
            {
                id: 'rain',
                name: '雨林细雨',
                description: '轻柔的雨声，仿佛置身热带雨林',
                icon: '🌧️',
                url: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-ambience-1354.mp3',
                defaultVolume: 0.8,
                category: 'water'
            },
            {
                id: 'stream',
                name: '山间溪流',
                description: '清澈的溪水潺潺流过',
                icon: '💧',
                url: 'https://assets.mixkit.co/sfx/preview/mixkit-waterfall-ambience-1349.mp3',
                defaultVolume: 0.7,
                category: 'water'
            },
            {
                id: 'fire',
                name: '篝火噼啪',
                description: '温暖的火焰燃烧声',
                icon: '🔥',
                url: 'https://assets.mixkit.co/sfx/preview/mixkit-campfire-crackling-1372.mp3',
                defaultVolume: 0.6,
                category: 'fire'
            },
            {
                id: 'wind',
                name: '晚风穿林',
                description: '微风轻轻穿过树林',
                icon: '🌬️',
                url: 'https://assets.mixkit.co/sfx/preview/mixkit-wind-in-trees-ambience-1356.mp3',
                defaultVolume: 0.5,
                category: 'wind'
            },
            {
                id: 'birds',
                name: '鸟鸣声声',
                description: '清晨的鸟儿歌唱',
                icon: '🐦',
                url: 'https://assets.mixkit.co/sfx/preview/mixkit-birds-singing-in-the-forest-1327.mp3',
                defaultVolume: 0.6,
                category: 'nature'
            },
            {
                id: 'ocean',
                name: '海浪拍岸',
                description: '温柔的海浪拍击沙滩',
                icon: '🌊',
                url: 'https://assets.mixkit.co/sfx/preview/mixkit-sea-waves-ambience-1351.mp3',
                defaultVolume: 0.7,
                category: 'water'
            },
            {
                id: 'thunder',
                name: '远方雷鸣',
                description: '远处的雷声滚滚',
                icon: '⚡',
                url: 'https://assets.mixkit.co/sfx/preview/mixkit-distant-thunder-roll-1348.mp3',
                defaultVolume: 0.4,
                category: 'weather'
            },
            {
                id: 'crickets',
                name: '夏夜虫鸣',
                description: '宁静夜晚的蟋蟀声',
                icon: '🦗',
                url: 'https://assets.mixkit.co/sfx/preview/mixkit-crickets-ambience-1358.mp3',
                defaultVolume: 0.5,
                category: 'nature'
            }
        ];
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
