class TimerManager {
    constructor() {
        this.durationMinutes = 0;
        this.remainingSeconds = 0;
        this.intervalId = null;
        this.onTimerUpdate = null;
        this.onTimerComplete = null;
        this.isRunning = false;
    }

    start(durationMinutes) {
        this.durationMinutes = durationMinutes;
        this.remainingSeconds = durationMinutes * 60;
        this.isRunning = true;
        
        this._updateDisplay();
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        
        this.intervalId = setInterval(() => {
            this._tick();
        }, 1000);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
        this.durationMinutes = 0;
        this.remainingSeconds = 0;
        this._updateDisplay();
    }

    pause() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
    }

    resume() {
        if (this.remainingSeconds > 0 && !this.isRunning) {
            this.isRunning = true;
            this.intervalId = setInterval(() => {
                this._tick();
            }, 1000);
        }
    }

    _tick() {
        if (this.remainingSeconds > 0) {
            this.remainingSeconds--;
            this._updateDisplay();
        } else {
            this._complete();
        }
    }

    _updateDisplay() {
        const minutes = Math.floor(this.remainingSeconds / 60);
        const seconds = this.remainingSeconds % 60;
        const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        if (this.onTimerUpdate) {
            this.onTimerUpdate({
                display: display,
                remainingSeconds: this.remainingSeconds,
                durationMinutes: this.durationMinutes,
                isRunning: this.isRunning
            });
        }
    }

    _complete() {
        this.stop();
        if (this.onTimerComplete) {
            this.onTimerComplete();
        }
    }

    setOnTimerUpdate(callback) {
        this.onTimerUpdate = callback;
    }

    setOnTimerComplete(callback) {
        this.onTimerComplete = callback;
    }

    getRemainingTime() {
        return this.remainingSeconds;
    }

    getDuration() {
        return this.durationMinutes;
    }

    isTimerActive() {
        return this.isRunning || this.remainingSeconds > 0;
    }
}

export default TimerManager;
