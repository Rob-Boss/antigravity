export const playButtonBeep = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Cute "Blip"
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
};

export const playMotorRun = (durationMs: number) => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();

    // Create two oscillators for a "chorused" sci-fi servo sound
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.type = 'square';
    osc2.type = 'sawtooth';

    // Slide pitch up slightly to simulate "effort"
    const dur = durationMs / 1000;

    osc1.frequency.setValueAtTime(120, ctx.currentTime);
    osc1.frequency.linearRampToValueAtTime(150, ctx.currentTime + dur);

    osc2.frequency.setValueAtTime(124, ctx.currentTime); // Slight detune
    osc2.frequency.linearRampToValueAtTime(154, ctx.currentTime + dur);

    // Smooth envelope
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.05, ctx.currentTime + dur - 0.1);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + dur);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + dur);
    osc2.stop(ctx.currentTime + dur);
};

export const playClunk = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Deep, punchy kick
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
};

export const playSuccessChime = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();

    // Fast Arpeggio (C6, E6, G6, C7)
    const notes = [1046.50, 1318.51, 1567.98, 2093.00];

    notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'triangle'; // Softer, flute-like
        osc.frequency.value = freq;

        const start = ctx.currentTime + i * 0.08;
        const dur = 0.2;

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.05, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc.start(start);
        osc.stop(start + dur);
    });
};
