// Pleasant synthesized Duolingo-inspired sound effects using Web Audio API

let audioCtx = null;

function getCtx() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(freq, duration, type = 'sine', startTimeOffset = 0, volume = 0.12) {
  const ctx = getCtx();
  if (!ctx) return;

  const now = ctx.currentTime + startTimeOffset;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration + 0.02);
}

export const soundFX = {
  click(enabled = true) {
    if (!enabled) return;
    playTone(540, 0.07, 'triangle', 0, 0.08);
  },
  purr(enabled = true) {
    if (!enabled) return;
    playTone(660, 0.08, 'sine', 0, 0.09);
    playTone(880, 0.12, 'sine', 0.07, 0.09);
  },
  correct(enabled = true) {
    if (!enabled) return;
    playTone(523.25, 0.12, 'triangle', 0, 0.14); // C5
    playTone(659.25, 0.14, 'triangle', 0.09, 0.14); // E5
    playTone(783.99, 0.22, 'triangle', 0.18, 0.16); // G5
  },
  wrong(enabled = true) {
    if (!enabled) return;
    playTone(280, 0.14, 'sawtooth', 0, 0.08);
    playTone(210, 0.24, 'sawtooth', 0.12, 0.09);
  },
  complete(enabled = true) {
    if (!enabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      playTone(n, 0.22, 'triangle', idx * 0.1, 0.15);
    });
  },
};
