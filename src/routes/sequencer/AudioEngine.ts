export class AudioEngine {
    private ctx: AudioContext | null = null;
    private isPlaying: boolean = false;
    private currentStep: number = 0;
    private nextNoteTime: number = 0;
    private timerID: number | undefined;
    private lookahead: number = 25.0; // How frequently to call scheduling function (in milliseconds)
    private scheduleAheadTime: number = 0.1; // How far ahead to schedule audio (sec)
    private sequence: any[] = [];
    private tempo: number = 120;
    private onStepCallback: ((step: number, duration: number) => void) | null = null;

    constructor() {
        // We initialize the context lazily on first user interaction usually, 
        // but here we'll prepare it.
    }

    private initContext() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    public resume() {
        this.initContext();
    }

    public start(sequence: any[], tempo: number, onStep: (step: number, duration: number) => void) {
        this.initContext();
        this.sequence = sequence;
        this.tempo = tempo;
        this.onStepCallback = onStep;
        this.isPlaying = true;
        this.currentStep = 0;
        this.nextNoteTime = this.ctx!.currentTime;
        this.scheduler();
    }

    public updateSequence(sequence: any[]) {
        this.sequence = sequence;
    }

    public stop() {
        this.isPlaying = false;
        if (this.timerID) {
            window.clearTimeout(this.timerID);
        }
    }

    private nextNote() {
        let duration = 60.0 / this.tempo; // Default to BPM

        const step = this.sequence[this.currentStep];
        if (step && step.cartridgeId !== null) {
            if (this.currentProgramId === 1 && this.sampleBuffers.has(step.cartridgeId)) {
                const buffer = this.sampleBuffers.get(step.cartridgeId);
                if (buffer) {
                    duration = buffer.duration;
                }
            }
        }

        this.nextNoteTime += duration;

        this.currentStep++;
        if (this.currentStep === 16) {
            this.currentStep = 0;
        }
    }

    private sampleBuffers: Map<number, AudioBuffer> = new Map();
    public currentProgramId: number = 1;

    public async loadSamples(urls: string[]) {
        this.initContext();

        for (let i = 0; i < urls.length; i++) {
            try {
                const response = await fetch(urls[i]);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await this.ctx!.decodeAudioData(arrayBuffer);
                this.sampleBuffers.set(i, audioBuffer);
            } catch (e) {
                console.error(`Failed to load sample ${urls[i]}`, e);
            }
        }
    }

    private currentPreviewOsc: OscillatorNode | null = null;
    private currentPreviewGain: GainNode | null = null;

    public previewNote(id: number) {
        this.initContext();
        this.stopPreview(); // Exclusive playback

        if (this.currentProgramId === 1 && this.sampleBuffers.has(id)) {
            this.playSample(this.ctx!.currentTime, id, true);
        } else {
            this.playSynth(id, this.ctx!.currentTime, true);
        }
    }

    private playSample(time: number, id: number, isPreview: boolean = false, duration: number = 0) {
        const buffer = this.sampleBuffers.get(id);
        if (!buffer || !this.ctx) return;

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;

        const gain = this.ctx.createGain();

        source.connect(gain);
        gain.connect(this.ctx.destination);

        source.start(time);

        if (isPreview) {
            this.currentPreviewOsc = null;
            this.currentPreviewSource = source;
            this.currentPreviewGain = gain;
        } else if (duration > 0) {
            // Enforce exclusive playback in sequence by stopping at end of step
            source.stop(time + duration);
        }
    }

    private currentPreviewSource: AudioBufferSourceNode | null = null;

    public stopPreview() {
        if (this.currentPreviewOsc) {
            try {
                this.currentPreviewOsc.stop();
                this.currentPreviewOsc.disconnect();
            } catch (e) { }
            this.currentPreviewOsc = null;
        }

        if (this.currentPreviewSource) {
            try {
                this.currentPreviewSource.stop();
                this.currentPreviewSource.disconnect();
            } catch (e) { }
            this.currentPreviewSource = null;
        }

        if (this.currentPreviewGain) {
            this.currentPreviewGain.disconnect();
            this.currentPreviewGain = null;
        }
    }

    private playSynth(id: number, time: number, isPreview: boolean = false, duration: number = 0.5) {
        const pitch = this.getPitchForId(id);

        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(pitch, time);

        gain.gain.setValueAtTime(0.1, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + (duration * 0.9)); // Fade out slightly before end

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(time);
        // Stop exactly at duration to prevent overlap
        osc.stop(time + duration);

        if (isPreview) {
            this.currentPreviewOsc = osc;
            this.currentPreviewGain = gain;
        }
    }

    private getPitchForId(id: number): number {
        // Simple pentatonic or major scale mapping
        // Base A3 = 220
        const scale = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24, 26];
        const baseNote = 220;
        const semitone = Math.pow(2, 1 / 12);

        if (id >= 0 && id < scale.length) {
            return baseNote * Math.pow(semitone, scale[id]);
        }
        return 440;
    }

    private scheduleNote(stepNumber: number, time: number) {
        // Notify UI
        // We use a slight delay or requestAnimationFrame in the UI to sync visuals
        // But for now, we'll just callback. Note: this callback runs early (at scheduling time), 
        // so visuals might be slightly ahead of audio. 
        // For tight sync, we'd use the Draw loop to check AudioContext.currentTime.
        // We'll do a simple "approximate" callback here for the prototype.

        // Actually, to make the UI update at the right time, we should use the main loop in +page.svelte
        // checking against this.nextNoteTime. 
        // But let's try to be helpful and provide a "Draw" callback v	private scheduleNote(stepNumber: number, time: number) {
        // Notify UI
        const timeToPlay = time - this.ctx!.currentTime;

        let duration = 60.0 / this.tempo;
        const step = this.sequence[stepNumber];
        if (step && step.cartridgeId !== null) {
            if (this.currentProgramId === 1 && this.sampleBuffers.has(step.cartridgeId)) {
                const buffer = this.sampleBuffers.get(step.cartridgeId);
                if (buffer) {
                    duration = buffer.duration;
                }
            }
        }

        setTimeout(() => {
            if (this.onStepCallback && this.isPlaying) {
                this.onStepCallback(stepNumber, duration);
            }
        }, timeToPlay * 1000);

        if (step && step.cartridgeId !== null) {
            if (this.currentProgramId === 1 && this.sampleBuffers.has(step.cartridgeId)) {
                this.playSample(time, step.cartridgeId, false, duration);
            } else {
                this.playSynth(step.cartridgeId, time, false, duration);
            }
        }
    }

    private playOscillator(time: number, freq: number) {
        // Legacy method, replaced by playSynth logic inside scheduleNote
    }

    private scheduler() {
        // while there are notes that will need to play before the next interval, 
        // schedule them and advance the pointer.
        while (this.nextNoteTime < this.ctx!.currentTime + this.scheduleAheadTime) {
            this.scheduleNote(this.currentStep, this.nextNoteTime);
            this.nextNote();
        }

        if (this.isPlaying) {
            this.timerID = window.setTimeout(() => this.scheduler(), this.lookahead);
        }
    }
}
