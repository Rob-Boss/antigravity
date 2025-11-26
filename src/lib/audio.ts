import { browser } from '$app/environment';

export class AudioEngine {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private isMuted: boolean = false;

    constructor() {
        if (browser) {
            this.init();
        }
    }

    private init() {
        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            this.ctx = new AudioContextClass();
            this.masterGain = this.ctx.createGain();
            this.masterGain.connect(this.ctx.destination);
            this.masterGain.gain.value = 0.3; // Default volume
        } catch (e) {
            console.error('Web Audio API not supported', e);
        }
    }

    public async resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            await this.ctx.resume();
        }
    }

    public setVolume(val: number) {
        if (this.masterGain) {
            this.masterGain.gain.value = val;
        }
    }

    public playTone(freq: number, type: OscillatorType = 'sine', duration: number = 0.1, time: number = 0) {
        if (!this.ctx || !this.masterGain) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + time);

        gain.gain.setValueAtTime(0, this.ctx.currentTime + time);
        gain.gain.linearRampToValueAtTime(1, this.ctx.currentTime + time + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + time + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(this.ctx.currentTime + time);
        osc.stop(this.ctx.currentTime + time + duration);
    }

    public playPop(freq: number = 600) {
        if (!this.ctx || !this.masterGain) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.1, this.ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(1, this.ctx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }

    // For continuous sounds (like spinning)
    public createDrone(freq: number, type: OscillatorType = 'sine'): { setFreq: (f: number) => void, setVol: (v: number) => void, stop: () => void } | null {
        if (!this.ctx || !this.masterGain) return null;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.value = 0;

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();

        return {
            setFreq: (f: number) => {
                if (this.ctx) osc.frequency.setTargetAtTime(f, this.ctx.currentTime, 0.1);
            },
            setVol: (v: number) => {
                if (this.ctx) gain.gain.setTargetAtTime(v, this.ctx.currentTime, 0.1);
            },
            stop: () => {
                if (this.ctx) {
                    gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
                    setTimeout(() => osc.stop(), 200);
                }
            }
        };
    }

    public playSVariant(variantId: number, velocity: number) {
        if (!this.ctx || !this.masterGain) return;

        // Normalize velocity (0-50 range typically) to 0-1
        const intensity = Math.min(velocity / 20, 1);
        const now = this.ctx.currentTime;

        switch (variantId) {
            case 0: // Silk (White Noise High Pass)
                this.playNoise('white', intensity, 2000, 'highpass');
                break;
            case 1: // Velvet (Pink Noise Low Pass)
                this.playNoise('pink', intensity, 400, 'lowpass');
                break;
            case 2: // Wind Chimes (Pentatonic Blips)
                if (Math.random() < 0.3) {
                    const pentatonic = [523.25, 587.33, 659.25, 783.99, 880.00]; // C5, D5, E5, G5, A5
                    const freq = pentatonic[Math.floor(Math.random() * pentatonic.length)];
                    this.playTone(freq, 'sine', 0.5 + Math.random() * 0.5);
                }
                break;
            case 3: // Water (Bandpass Noise + LFO)
                this.playWaterDrop(intensity);
                break;
            case 4: // Static (Clicks)
                if (Math.random() < intensity) {
                    this.playClick();
                }
                break;
            case 5: // Harp (Plucked String)
                if (Math.random() < 0.2) {
                    const scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88]; // C Major
                    const freq = scale[Math.floor(Math.random() * scale.length)];
                    this.playTone(freq, 'triangle', 0.3); // Simple approx for now
                }
                break;
            case 6: // Breath (Filtered Noise)
                this.playNoise('white', intensity, 800, 'bandpass', 1);
                break;
            case 7: // Crystal (High Q Ping)
                if (Math.random() < 0.1) {
                    this.playTone(1000 + Math.random() * 1000, 'sine', 1.0);
                }
                break;
            case 8: // Sand (Granular)
                if (Math.random() < intensity * 2) {
                    this.playNoise('white', 0.1, 1000 + Math.random() * 2000, 'bandpass', 10, 0.01);
                }
                break;
            case 9: // Purr (AM Modulated Sine)
                this.playPurr(intensity);
                break;
            default:
                this.playTone(200 + velocity * 10, 'sine', 0.1);
                break;
        }
    }

    public playWVariant(variantId: number, frequency: number, velocity: number) {
        if (!this.ctx || !this.masterGain) return;

        const baseFreq = frequency;
        const vol = Math.min(Math.max(velocity / 20, 0.2), 1.0); // Normalize velocity to 0.2-1.0 range
        const now = this.ctx.currentTime;

        switch (variantId) {
            case 0: // Orchestral Pizz (Deep, woody)
                // playPluck(freq, type, attack, decay, vol)
                this.playPluck(baseFreq, 'triangle', 0.01, 0.3, vol * 0.5);
                this.playPluck(baseFreq * 0.5, 'sine', 0.02, 0.4, vol * 0.6); // Sub octave
                break;
            case 1: // Banjo (Bright, metallic, twangy)
                this.playPluck(baseFreq, 'sawtooth', 0.005, 0.1, vol * 0.4); // Short decay
                this.playTone(baseFreq * 2, 'square', 0.05, 0); // High harmonic ping
                break;
            case 2: // Harpsichord (Sharp attack, rich)
                this.playPluck(baseFreq, 'sawtooth', 0.01, 0.4, vol * 0.4);
                this.playPluck(baseFreq * 2, 'sawtooth', 0.01, 0.2, vol * 0.3); // Octave
                break;
            case 3: // Sitar (Buzzing, pitch bend)
                const sitarOsc = this.ctx.createOscillator();
                const sitarGain = this.ctx.createGain();
                sitarOsc.type = 'sawtooth';
                sitarOsc.frequency.setValueAtTime(baseFreq, now);
                sitarOsc.frequency.linearRampToValueAtTime(baseFreq + 20, now + 0.2); // Pitch bend

                sitarGain.gain.setValueAtTime(vol * 0.3, now);
                sitarGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

                sitarOsc.connect(sitarGain);
                sitarGain.connect(this.masterGain);
                sitarOsc.start();
                sitarOsc.stop(now + 0.5);
                break;
            case 4: // Muted Guitar (Clean, short, percussive)
                this.playPluck(baseFreq, 'sine', 0.01, 0.1, vol * 0.6);
                this.playPop(baseFreq * 2); // Click attack
                break;
            case 5: // Double Bass (Low, jazzy thump)
                this.playPluck(baseFreq * 0.5, 'triangle', 0.05, 0.5, vol * 0.6);
                this.playPluck(baseFreq * 0.25, 'sine', 0.05, 0.6, vol * 0.7);
                break;
            case 6: // Kora (Calabash resonance, bright)
                this.playPluck(baseFreq, 'triangle', 0.01, 0.3, vol * 0.5);
                this.playPluck(baseFreq * 1.5, 'sine', 0.01, 0.2, vol * 0.4); // Fifth
                break;
            case 7: // Jaw Harp (Boingy, formant)
                this.playBoing(baseFreq * 0.5, vol * 0.6);
                break;
            case 8: // Clavinet (Funky, sharp, electric)
                this.playPluck(baseFreq, 'square', 0.01, 0.2, vol * 0.3);
                this.playPluck(baseFreq * 2, 'sawtooth', 0.01, 0.1, vol * 0.2);
                break;
            case 9: // Zither (Folk, bright, multi-string)
                this.playPluck(baseFreq, 'triangle', 0.01, 0.2, vol * 0.5);
                this.playPluck(baseFreq + 5, 'triangle', 0.01, 0.2, vol * 0.5); // Detune
                this.playPluck(baseFreq - 5, 'triangle', 0.01, 0.2, vol * 0.5); // Detune
                break;
            default:
                this.playPluck(baseFreq, 'triangle', 0.01, 0.3, vol * 0.5);
                break;
        }
    }

    private playPluck(freq: number, type: OscillatorType, attack: number, decay: number, vol: number, filterType: BiquadFilterType = 'lowpass', filterFreq: number = 2000) {
        if (!this.ctx || !this.masterGain) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        filter.type = filterType;
        filter.frequency.setValueAtTime(filterFreq, this.ctx.currentTime);
        if (filterType === 'lowpass') {
            filter.frequency.exponentialRampToValueAtTime(freq, this.ctx.currentTime + decay);
        }

        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + attack);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + decay);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + decay + 0.1);
    }

    private playSynthPluck(freq: number, vol: number) {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.value = freq;

        filter.type = 'lowpass';
        filter.Q.value = 5;
        filter.frequency.setValueAtTime(freq * 4, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(freq, this.ctx.currentTime + 0.2);

        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.4);
    }

    private playBoing(freq: number, vol: number) {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq / 2, this.ctx.currentTime + 0.5); // Pitch drop

        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
    }

    private playLaser(freq: number, vol: number) {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq * 2, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.2); // Fast drop

        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
    }

    public playAVariant(variantId: number, velocity: number) {
        if (!this.ctx || !this.masterGain) return;

        // Normalize velocity (0-50 range typically) to 0-1
        const intensity = Math.min(velocity / 20, 1);
        const now = this.ctx.currentTime;

        switch (variantId) {
            case 0: // Bubbles (Sine Sweep)
                this.playPop(400 + Math.random() * 400);
                break;
            case 1: // Typewriter (Clicks)
                this.playClick();
                break;
            case 2: // Rain (Filtered Noise)
                this.playNoise('white', intensity * 0.5, 800 + Math.random() * 400, 'bandpass', 2, 0.05);
                break;
            case 3: // Coins (Ring Mod)
                this.playRingMod(2000 + Math.random() * 1000, 500, intensity);
                break;
            case 4: // Glitch (Bitcrush-ish)
                this.playGlitch(intensity);
                break;
            case 5: // Piano (Pentatonic)
                const pentatonic = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
                const note = pentatonic[Math.floor(Math.random() * pentatonic.length)];
                this.playTone(note, 'triangle', 0.1);
                break;
            case 6: // Sand (High Pass Noise)
                this.playNoise('white', intensity * 0.3, 3000, 'highpass', 1, 0.03);
                break;
            case 7: // Laser (Fast Sweep)
                this.playLaser(800 + Math.random() * 400, intensity * 0.5);
                break;
            case 8: // Wood (Resonant Bandpass)
                this.playNoise('pink', intensity, 400 + Math.random() * 200, 'bandpass', 10, 0.05);
                break;
            case 9: // Chimes (High Q Bell)
                this.playTone(2000 + Math.random() * 2000, 'sine', 0.5);
                break;
            default:
                this.playPop(400 + Math.random() * 400);
                break;
        }
    }

    private playRingMod(carrierFreq: number, modFreq: number, vol: number) {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const mod = this.ctx.createOscillator();
        const modGain = this.ctx.createGain();
        const gain = this.ctx.createGain();

        osc.frequency.value = carrierFreq;
        mod.frequency.value = modFreq;

        modGain.gain.value = 500; // Modulation depth

        mod.connect(modGain);
        modGain.connect(osc.frequency); // FM Synthesis actually, simpler for "metallic"

        gain.gain.setValueAtTime(vol * 0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        mod.start();
        osc.stop(this.ctx.currentTime + 0.1);
        mod.stop(this.ctx.currentTime + 0.1);
    }

    private playGlitch(vol: number) {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100 + Math.random() * 1000, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(Math.random() * 1000, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(vol * 0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    private playNoise(type: 'white' | 'pink', vol: number, filterFreq: number, filterType: BiquadFilterType, Q: number = 1, duration: number = 0.1) {
        if (!this.ctx || !this.masterGain) return;

        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        if (type === 'white') {
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
        } else {
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                data[i] *= 0.11; // (roughly) compensate for gain
                b6 = white * 0.115926;
            }
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = filterType;
        filter.frequency.value = filterFreq;
        filter.Q.value = Q;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(vol * 0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        noise.start();
    }

    private playWaterDrop(intensity: number) {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.frequency.setValueAtTime(300 + Math.random() * 200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600 + Math.random() * 200, this.ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(intensity * 0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }

    private playClick() {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        gain.gain.value = 0.1;
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.005);
    }

    public playRVariant(variantId: number, velocity: number, distance: number) {
        if (!this.ctx || !this.masterGain) return;

        const intensity = Math.min(velocity / 20, 1);
        // Distance is roughly 0 (center) to 1 (edge)
        const dist = Math.min(Math.max(distance, 0), 1);

        switch (variantId) {
            case 0: // Glass (Pure Sine)
                this.playTone(800 + dist * 400, 'sine', 0.1);
                break;
            case 1: // Prism (Shimmering FM)
                this.playRingMod(400 + dist * 200, 800 + dist * 400, intensity);
                break;
            case 2: // Ice (Granular Cracking)
                this.playNoise('white', intensity, 2000 + Math.random() * 2000, 'highpass', 1, 0.02);
                break;
            case 3: // Neon (Electric Buzz)
                this.playTone(60 + dist * 10, 'sawtooth', 0.2); // Low buzz
                this.playTone(120 + dist * 20, 'square', 0.2); // Harmonics
                break;
            case 4: // Void (Low Pass Reverb-ish)
                this.playNoise('pink', intensity, 200, 'lowpass', 1, 0.5);
                break;
            case 5: // Crystal (High Q Pings)
                this.playTone(1000 + dist * 1000, 'sine', 1.5); // Long decay
                break;
            case 6: // Mirror (Reverse Envelope)
                this.playReverse(400 + dist * 200, intensity);
                break;
            case 7: // Laser (Sci-Fi Warp)
                this.playLaser(400 + dist * 400, intensity);
                break;
            case 8: // Ghost (Formant-ish)
                this.playNoise('white', intensity, 500 + dist * 200, 'bandpass', 10, 0.3);
                break;
            case 9: // Rainbow (Arpeggio)
                const scale = [261.63, 329.63, 392.00, 523.25]; // C Major Arp
                const note = scale[Math.floor(dist * scale.length)] || scale[scale.length - 1];
                this.playTone(note, 'triangle', 0.2);
                break;
            default:
                this.playTone(800 + dist * 400, 'sine', 0.1);
                break;
        }
    }

    private playReverse(freq: number, vol: number) {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(vol, this.ctx.currentTime + 0.1); // Swell
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.15); // Cut

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    }

    public createDDrone(variantId: number, freq: number): { setFreq: (f: number) => void, setVol: (v: number) => void, stop: () => void } | null {
        if (!this.ctx || !this.masterGain) return null;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        let lfo: OscillatorNode | null = null;
        let lfoGain: GainNode | null = null;
        let filter: BiquadFilterNode | null = null;

        // Default setup
        osc.frequency.value = freq;
        gain.gain.value = 0;

        switch (variantId) {
            case 0: // Whir (Sine)
                osc.type = 'sine';
                break;
            case 1: // Engine (Sawtooth Lowpass)
                osc.type = 'sawtooth';
                filter = this.ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.value = freq * 2;
                break;
            case 2: // Fan (Filtered Noise)
                // Noise requires buffer, handling differently or approximating with chaotic FM
                // Let's use high freq FM for "air"
                osc.type = 'triangle';
                lfo = this.ctx.createOscillator();
                lfo.frequency.value = 50; // Flutter
                lfoGain = this.ctx.createGain();
                lfoGain.gain.value = 100;
                lfo.connect(lfoGain);
                lfoGain.connect(osc.frequency);
                lfo.start();
                break;
            case 3: // Robot (Square Bitcrush-ish)
                osc.type = 'square';
                // Simple "bitcrush" via low sample rate emulation not easy here, 
                // so we use ring mod for metallic sound
                lfo = this.ctx.createOscillator();
                lfo.type = 'square';
                lfo.frequency.value = 100;
                lfoGain = this.ctx.createGain();
                lfoGain.gain.value = 500;
                lfo.connect(lfoGain);
                lfoGain.connect(osc.frequency);
                lfo.start();
                break;
            case 4: // Elastic (Rubber Band)
                osc.type = 'triangle';
                // Pitch bendy feel handled by physics, but we can add vibrato
                lfo = this.ctx.createOscillator();
                lfo.frequency.value = 5;
                lfoGain = this.ctx.createGain();
                lfoGain.gain.value = 20;
                lfo.connect(lfoGain);
                lfoGain.connect(osc.frequency);
                lfo.start();
                break;
            case 5: // Giggle (Granular Chatter)
                osc.type = 'sine';
                lfo = this.ctx.createOscillator();
                lfo.type = 'sawtooth';
                lfo.frequency.value = 15; // Fast chatter
                lfoGain = this.ctx.createGain();
                lfoGain.gain.value = freq * 0.5;
                lfo.connect(lfoGain);
                lfoGain.connect(osc.frequency);
                lfo.start();
                break;
            case 6: // Ratchet (Impulse Train)
                osc.type = 'sawtooth';
                // Use gain LFO to chop it
                lfo = this.ctx.createOscillator();
                lfo.type = 'square';
                lfo.frequency.value = 20;
                lfoGain = this.ctx.createGain();
                lfoGain.gain.value = 1; // Control amp
                // Complex routing: LFO -> Gain node that controls main gain?
                // Simpler: Just use harsh square wave at low freq
                osc.frequency.value = 50; // Base click rate
                break;
            case 7: // UFO (Theremin)
                osc.type = 'sine';
                lfo = this.ctx.createOscillator();
                lfo.frequency.value = 8;
                lfoGain = this.ctx.createGain();
                lfoGain.gain.value = 50;
                lfo.connect(lfoGain);
                lfoGain.connect(osc.frequency);
                lfo.start();
                break;
            case 8: // Turbine (High Pitch Ramp)
                osc.type = 'sawtooth';
                filter = this.ctx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.Q.value = 10;
                filter.frequency.value = freq * 4;
                break;
            case 9: // Wobble (Dubstep LFO)
                osc.type = 'sawtooth';
                filter = this.ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.Q.value = 5;
                lfo = this.ctx.createOscillator();
                lfo.frequency.value = 4; // Wobble speed
                lfoGain = this.ctx.createGain();
                lfoGain.gain.value = 500; // Filter cutoff mod depth
                lfo.connect(lfoGain);
                lfoGain.connect(filter.frequency);
                lfo.start();
                break;
            default:
                osc.type = 'sine';
                break;
        }

        // Routing
        if (filter) {
            osc.connect(filter);
            filter.connect(gain);
        } else {
            osc.connect(gain);
        }
        gain.connect(this.masterGain);
        osc.start();

        return {
            setFreq: (f: number) => {
                if (!this.ctx) return;
                const now = this.ctx.currentTime;

                // Variant specific frequency handling
                if (variantId === 6) { // Ratchet
                    osc.frequency.setTargetAtTime(f * 0.5, now, 0.1); // Click rate
                } else if (variantId === 8 && filter) { // Turbine
                    osc.frequency.setTargetAtTime(f, now, 0.1);
                    filter.frequency.setTargetAtTime(f * 4, now, 0.1);
                } else if (variantId === 9 && filter) { // Wobble
                    osc.frequency.setTargetAtTime(f, now, 0.1);
                    filter.frequency.setTargetAtTime(f * 2, now, 0.1); // Base cutoff
                } else if (variantId === 1 && filter) { // Engine
                    osc.frequency.setTargetAtTime(f, now, 0.1);
                    filter.frequency.setTargetAtTime(f * 3, now, 0.1);
                } else {
                    osc.frequency.setTargetAtTime(f, now, 0.1);
                }
            },
            setVol: (v: number) => {
                if (this.ctx) gain.gain.setTargetAtTime(v, this.ctx.currentTime, 0.1);
            },
            stop: () => {
                if (this.ctx) {
                    gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
                    setTimeout(() => {
                        osc.stop();
                        if (lfo) lfo.stop();
                    }, 200);
                }
            }
        };
    }

    public playYVariant(variantId: number, intensity: number, count: number) {
        if (!this.ctx || !this.masterGain) return;

        // Intensity is roughly 0 to 1 (magnetic strength/proximity)
        const safeIntensity = Math.min(Math.max(intensity, 0), 1);

        switch (variantId) {
            case 0: // Sparkles (Sine Blips)
                if (Math.random() < safeIntensity * 0.5) {
                    this.playTone(800 + Math.random() * 800, 'sine', 0.1);
                }
                break;
            case 1: // Charge (Rising Pitch)
                this.playTone(200 + safeIntensity * 800, 'triangle', 0.1);
                break;
            case 2: // Geiger (Random Clicks)
                if (Math.random() < safeIntensity) {
                    this.playClick();
                }
                break;
            case 3: // Forcefield (Hum + Distortion)
                this.playTone(50 + safeIntensity * 10, 'sawtooth', 0.1); // Low hum
                break;
            case 4: // Swarm (Detuned Saws)
                if (Math.random() < 0.3) {
                    this.playTone(300 + Math.random() * 20, 'sawtooth', 0.1);
                }
                break;
            case 5: // Sonar (Ping with Delay - simulated)
                if (Math.random() < 0.05) {
                    this.playTone(1200, 'sine', 0.3);
                }
                break;
            case 6: // Zap (Electric Bursts)
                if (Math.random() < safeIntensity * 0.2) {
                    this.playNoise('white', 0.5, 1000, 'highpass', 1, 0.05);
                }
                break;
            case 7: // Theremin (Pitch Follows Intensity)
                this.playTone(400 + safeIntensity * 800, 'sine', 0.1);
                break;
            case 8: // Scanner (FM)
                this.playRingMod(200 + safeIntensity * 500, 50, 0.5);
                break;
            case 9: // Void (Wind)
                this.playNoise('pink', safeIntensity, 200 + safeIntensity * 200, 'lowpass', 2, 0.1);
                break;
            default:
                if (Math.random() < safeIntensity * 0.5) {
                    this.playTone(800 + Math.random() * 800, 'sine', 0.1);
                }
                break;
        }
    }

    private playPurr(intensity: number) {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.frequency.value = 50;

        // AM Modulation
        const lfo = this.ctx.createOscillator();
        lfo.frequency.value = 25;
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 500;

        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain); // This is wrong, gain.gain is AudioParam. 
        // Actually for AM, we want to modulate the amplitude.
        // Let's do simple low sine for now.

        osc.type = 'sine';
        gain.gain.setValueAtTime(intensity * 0.5, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
    }
}

export const audio = new AudioEngine();
