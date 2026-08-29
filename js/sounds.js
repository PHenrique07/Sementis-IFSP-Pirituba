let ctx = null;
let muted = false;
try {
  muted = localStorage.getItem("sementis-loja-muted") === "1";
} catch (e) {
  /* sem storage */
}

const getCtx = () => {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
};

const isMuted = () => muted;
const setMuted = (value) => {
  muted = value;
  try {
    localStorage.setItem("sementis-loja-muted", value ? "1" : "0");
  } catch (e) {
    /* sem storage */
  }
};

const noiseBurst = (t, { gain = 0.05, dur = 0.04, freq = 3000 } = {}) => {
  const c = getCtx();
  const len = Math.max(1, Math.floor(c.sampleRate * dur));
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = c.createBufferSource();
  src.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = freq;
  filter.Q.value = 1.4;
  const g = c.createGain();
  g.gain.value = gain;
  src.connect(filter).connect(g).connect(c.destination);
  src.start(t);
};

const tone = (t, freq, { dur = 0.18, gain = 0.12, type = "triangle" } = {}) => {
  const c = getCtx();
  const o = c.createOscillator();
  o.type = type;
  o.frequency.value = freq;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.05);
};

const playCrank = () => {
  if (muted) return;
  const t0 = getCtx().currentTime;
  for (let i = 0; i < 7; i++) {
    noiseBurst(t0 + i * 0.085, { gain: 0.09, dur: 0.035, freq: 2200 + i * 180 });
  }
};

const playRattle = () => {
  if (muted) return;
  let t = getCtx().currentTime + 0.15;
  for (let i = 0; i < 18; i++) {
    noiseBurst(t, { gain: 0.04 + Math.random() * 0.04, dur: 0.05, freq: 2600 + Math.random() * 2400 });
    t += 0.06 + Math.random() * 0.07;
  }
};

const playPop = () => {
  if (muted) return;
  const t = getCtx().currentTime;
  tone(t, 220, { dur: 0.09, gain: 0.16, type: "square" });
  tone(t + 0.02, 440, { dur: 0.12, gain: 0.08 });
};

const playCrack = () => {
  if (muted) return;
  const t = getCtx().currentTime;
  noiseBurst(t, { gain: 0.14, dur: 0.06, freq: 1600 });
  noiseBurst(t + 0.05, { gain: 0.1, dur: 0.08, freq: 900 });
  tone(t + 0.02, 180, { dur: 0.14, gain: 0.14, type: "square" });
};

const playReveal = (rarity) => {
  if (muted) return;
  const t = getCtx().currentTime;
  if (rarity === "lendario") {
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => tone(t + i * 0.13, f, { dur: 0.34, gain: 0.14 }));
    [2093, 2637, 3136].forEach((f, i) => tone(t + 0.68 + i * 0.09, f, { dur: 0.24, gain: 0.05, type: "sine" }));
    for (let i = 0; i < 10; i++) {
      noiseBurst(t + 0.5 + i * 0.05, { gain: 0.03, dur: 0.05, freq: 4000 + Math.random() * 4000 });
    }
  } else if (rarity === "epico") {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(t + i * 0.11, f, { dur: 0.26, gain: 0.12 }));
  } else if (rarity === "raro") {
    [523.25, 659.25, 783.99].forEach((f, i) => tone(t + i * 0.1, f, { dur: 0.2, gain: 0.1 }));
  } else {
    tone(t, 523.25, { dur: 0.15, gain: 0.1 });
    tone(t + 0.11, 659.25, { dur: 0.2, gain: 0.1 });
  }
};

window.sounds = {
  isMuted,
  setMuted,
  playCrank,
  playRattle,
  playPop,
  playCrack,
  playReveal
};
