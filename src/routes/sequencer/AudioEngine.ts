import SchedulerWorker from './scheduler.worker.ts?worker';

export class AudioEngine {
    private ctx: AudioContext | null = null;
    private isPlaying: boolean = false;
    private currentStep: number = 0;
    private nextNoteTime: number = 0;
    private lookahead: number = 25.0; // How frequently to call scheduling function (in milliseconds)
    private scheduleAheadTime: number = 0.1; // How far ahead to schedule audio (sec)
    private sequence: any[] = [];
    private tempo: number = 120;
    private onStepCallback: ((step: number, duration: number) => void) | null = null;
    private worker: Worker | null = null;

    constructor() {
        // Initialize worker
        if (typeof Worker !== 'undefined') {
            this.worker = new SchedulerWorker();
            this.worker.onmessage = (e) => {
                if (e.data === "tick") {
                    this.scheduler();
                }
            };
        }
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

    public start(sequence: any[], tempo: number) {
        this.initContext();
        this.sequence = sequence;
        this.tempo = tempo;
        this.isPlaying = true;
        this.currentStep = 0;
        this.nextNoteTime = this.ctx!.currentTime;

        // Start the worker
        this.worker?.postMessage("start");
    }

    public updateSequence(sequence: any[]) {
        this.sequence = sequence;
    }

    public stop() {
        this.isPlaying = false;
        this.worker?.postMessage("stop");
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

    private scheduledEvents: { step: number; time: number; duration: number }[] = [];

    public getCurrentStep(): { step: number; duration: number } {
        if (!this.ctx || !this.isPlaying) return { step: -1, duration: 0 };
        const currentTime = this.ctx.currentTime;

        // Find the latest event that has started
        // Since events are ordered, we can iterate backwards or just find the last one <= currentTime
        // Also cleanup old events

        // Remove events older than 1 second (arbitrary buffer) to keep array small
        while (this.scheduledEvents.length > 0 && this.scheduledEvents[0].time < currentTime - 1.0) {
            this.scheduledEvents.shift();
        }

        // Find current step
        // We look for the event that started most recently
        let activeStep = -1;
        let activeDuration = 0;

        for (let i = 0; i < this.scheduledEvents.length; i++) {
            if (this.scheduledEvents[i].time <= currentTime) {
                activeStep = this.scheduledEvents[i].step;
                activeDuration = this.scheduledEvents[i].duration;
            } else {
                // Future events
                break;
            }
        }

        return { step: activeStep, duration: activeDuration };
    }

    private scheduleNote(stepNumber: number, time: number) {
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

        // Track for UI polling
        this.scheduledEvents.push({
            step: stepNumber,
            time: time,
            duration: duration
        });

        // Callback removed - UI now polls getCurrentStep()

        if (step && step.cartridgeId !== null) {
            if (this.currentProgramId === 1 && this.sampleBuffers.has(step.cartridgeId)) {
                this.playSample(time, step.cartridgeId, false, duration);
            } else {
                this.playSynth(step.cartridgeId, time, false, duration);
            }
        }
    }

    private scheduler() {
        // while there are notes that will need to play before the next interval, 
        // schedule them and advance the pointer.
        while (this.nextNoteTime < this.ctx!.currentTime + this.scheduleAheadTime) {
            this.scheduleNote(this.currentStep, this.nextNoteTime);
            this.nextNote();
        }
        // Worker handles the loop
    }
}
