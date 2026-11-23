// Web Audio API Synthesizer for Zomato-style sound alert and celebratory rank-up sound

class SoundEffectManager {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Zomato/Swiggy style incoming urgent order chime
  playZomatoAlert() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Two rapid cheerful bells (C5 -> G5)
      const notes = [
        { freq: 523.25, time: now, dur: 0.12 },
        { freq: 659.25, time: now + 0.14, dur: 0.12 },
        { freq: 783.99, time: now + 0.28, dur: 0.25 }
      ];

      notes.forEach(({ freq, time, dur }) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(time);
        osc.stop(time + dur);
      });
    } catch (e) {
      console.warn('Audio play prevented or unsupported', e);
    }
  }

  // Session accepted chime
  playAcceptedChime() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [
        { freq: 440, time: now, dur: 0.1 },
        { freq: 554.37, time: now + 0.12, dur: 0.1 },
        { freq: 659.25, time: now + 0.24, dur: 0.2 }
      ];

      notes.forEach(({ freq, time, dur }) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.25, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(time);
        osc.stop(time + dur);
      });
    } catch (e) {
      // Audio might be blocked until user gesture
    }
  }

  // Celebration Rank Up Fanfare
  playRankUpFanfare() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Fanfare sequence
      const notes = [
        { freq: 523.25, time: now, dur: 0.1 },
        { freq: 523.25, time: now + 0.12, dur: 0.1 },
        { freq: 523.25, time: now + 0.24, dur: 0.1 },
        { freq: 659.25, time: now + 0.36, dur: 0.2 },
        { freq: 783.99, time: now + 0.58, dur: 0.4 }
      ];

      notes.forEach(({ freq, time, dur }) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.35, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(time);
        osc.stop(time + dur);
      });
    } catch (e) {
      // Audio might be blocked
    }
  }
}

export const sound = new SoundEffectManager();
