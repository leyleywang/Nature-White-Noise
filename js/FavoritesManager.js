class FavoritesManager {
    constructor() {
        this.storageKey = 'nature-white-noise-favorites';
        this.favorites = this._loadFromStorage();
        this.onFavoritesChange = null;
    }

    _loadFromStorage() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('加载收藏失败:', e);
            return [];
        }
    }

    _saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
        } catch (e) {
            console.error('保存收藏失败:', e);
        }
    }

    _generateId() {
        return 'fav_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    addFavorite(name, mixState) {
        if (!name || !name.trim()) {
            name = `收藏 ${this.favorites.length + 1}`;
        }

        const favorite = {
            id: this._generateId(),
            name: name.trim(),
            mixState: mixState,
            createdAt: Date.now()
        };

        this.favorites.push(favorite);
        this._saveToStorage();
        this._notifyChange();
        return favorite;
    }

    removeFavorite(id) {
        const index = this.favorites.findIndex(fav => fav.id === id);
        if (index !== -1) {
            this.favorites.splice(index, 1);
            this._saveToStorage();
            this._notifyChange();
            return true;
        }
        return false;
    }

    updateFavorite(id, updates) {
        const favorite = this.favorites.find(fav => fav.id === id);
        if (favorite) {
            if (updates.name !== undefined) {
                favorite.name = updates.name;
            }
            if (updates.mixState !== undefined) {
                favorite.mixState = updates.mixState;
            }
            this._saveToStorage();
            this._notifyChange();
            return favorite;
        }
        return null;
    }

    getFavorite(id) {
        return this.favorites.find(fav => fav.id === id);
    }

    getAllFavorites() {
        return [...this.favorites];
    }

    isMixInFavorites(mixState) {
        if (!mixState || !mixState.tracks || mixState.tracks.length === 0) {
            return false;
        }

        const currentTrackIds = mixState.tracks.map(t => t.soundId).sort().join(',');
        
        return this.favorites.some(fav => {
            if (!fav.mixState || !fav.mixState.tracks) return false;
            const favTrackIds = fav.mixState.tracks.map(t => t.soundId).sort().join(',');
            return currentTrackIds === favTrackIds;
        });
    }

    getFavoritesCount() {
        return this.favorites.length;
    }

    clearAllFavorites() {
        this.favorites = [];
        this._saveToStorage();
        this._notifyChange();
    }

    setOnFavoritesChange(callback) {
        this.onFavoritesChange = callback;
    }

    _notifyChange() {
        if (this.onFavoritesChange) {
            this.onFavoritesChange(this.getAllFavorites());
        }
    }

    restoreFavorite(id, mixController, soundLibrary) {
        const favorite = this.getFavorite(id);
        if (favorite && favorite.mixState) {
            mixController.restoreMixState(favorite.mixState, soundLibrary);
            return true;
        }
        return false;
    }
}

export default FavoritesManager;
