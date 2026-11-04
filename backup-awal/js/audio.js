/**
 * audio.js
 * Web Audio API Sound Synthesizer
 * Zero external audio dependencies; runs 100% offline seamlessly.
 */

const SoundManager = {
    ctx: null,
    enabled: true,

    init() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        } catch (e) {
            console.warn('Web Audio not supported or blocked:', e);
        }

        // Restore sound setting from storage if available
        if (window.StorageManager) {
            const saved = StorageManager.getSetting('soundEnabled');
            if (saved !== null && saved !== undefined) {
                this.enabled = !!saved;
            }
        }
        this.updateAudioButtons();
    },

    resumeContext() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    toggle() {
        this.enabled = !this.enabled;
        if (window.StorageManager) {
            StorageManager.setSetting('soundEnabled', this.enabled);
        }
        this.updateAudioButtons();
        if (this.enabled) {
            this.play('click');
        }
        return this.enabled;
    },

    updateAudioButtons() {
        const btns = document.querySelectorAll('.audio-toggle-btn');
        btns.forEach(btn => {
            if (this.enabled) {
                btn.innerHTML = '🔊 <span class="audio-label">' + t('soundOn') + '</span>';
                btn.classList.remove('muted');
            } else {
                btn.innerHTML = '🔇 <span class="audio-label">' + t('soundOff') + '</span>';
                btn.classList.add('muted');
            }
        });
    },

    play(soundName) {
        if (!this.enabled || !this.ctx) return;
        this.resumeContext();

        try {
            switch (soundName) {
                case 'click':
                    this._playTone(520, 'sine', 0.05, 0.08);
                    break;
                case 'correct':
                    this._playChord([523.25, 659.25, 783.99, 1046.50], 0.08, 0.25); // C5, E5, G5, C6
                    break;
                case 'wrong':
                    this._playSlide(350, 180, 'triangle', 0.25, 0.15);
                    break;
                case 'push':
                    this._playSlide(220, 580, 'sine', 0.12, 0.12);
                    break;
                case 'pop':
                    this._playSlide(620, 320, 'sine', 0.10, 0.12);
                    break;
                case 'enqueue':
                    this._playTone(440, 'triangle', 0.08, 0.1);
                    setTimeout(() => this._playTone(554.37, 'triangle', 0.12, 0.1), 70);
                    break;
                case 'dequeue':
                    this._playTone(587.33, 'sine', 0.08, 0.12);
                    setTimeout(() => this._playTone(880, 'sine', 0.15, 0.12), 80);
                    break;
                case 'peek':
                    this._playTone(784, 'sine', 0.15, 0.09);
                    break;
                case 'levelComplete':
                    this._playFanfare();
                    break;
                case 'achievement':
                    this._playChord([440, 554.37, 659.25, 880, 1108.73], 0.1, 0.35);
                    break;
                default:
                    this._playTone(440, 'sine', 0.05, 0.05);
            }
        } catch (e) {
            console.warn('Error synthesizing sound:', e);
        }
    },

    _playTone(freq, type = 'sine', duration = 0.1, volume = 0.1) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },

    _playSlide(startFreq, endFreq, type = 'sine', duration = 0.15, volume = 0.1) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + duration);

        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },

    _playChord(frequencies, stepDelay = 0.06, toneDuration = 0.25) {
        frequencies.forEach((freq, idx) => {
            setTimeout(() => {
                this._playTone(freq, 'sine', toneDuration, 0.1);
            }, idx * (stepDelay * 1000));
        });
    },

    _playFanfare() {
        const notes = [
            { f: 523.25, d: 0.12, w: 0 },
            { f: 523.25, d: 0.12, w: 120 },
            { f: 523.25, d: 0.12, w: 240 },
            { f: 659.25, d: 0.25, w: 360 },
            { f: 783.99, d: 0.40, w: 600 }
        ];
        notes.forEach(n => {
            setTimeout(() => {
                this._playTone(n.f, 'triangle', n.d, 0.15);
            }, n.w);
        });
    }
};

window.SoundManager = SoundManager;
