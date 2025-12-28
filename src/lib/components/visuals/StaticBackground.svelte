<script>
    import { onMount } from "svelte";

    /**
     * @typedef {'classic' | 'chromatic' | 'vaporware' | 'digital' | 'snowstorm'} StaticType
     */
    export {};

    /** @type {{ type: StaticType, opacity?: number, intensity?: number, speed?: number, resolution?: number, fps?: number, adaptive?: boolean, floor?: number, ceiling?: number, onDebug?: (stats: any) => void }} */
    let {
        type = "classic",
        opacity = 1,
        intensity = 1,
        speed = 1,
        resolution = 1,
        fps = 60,
        adaptive = false,
        floor = 0, // Minimum brightness (0-255)
        ceiling = 255, // Maximum brightness (0-255)
        onDebug = undefined,
    } = $props();

    let canvas = $state();
    /** @type {CanvasRenderingContext2D} */
    let ctx;
    /** @type {number} */
    let animationId;
    let logicalWidth = $state(0);
    let logicalHeight = $state(0);
    let internalResolution = $state(resolution);
    let lastTime = 0;

    // Adaptive metrics
    let frameCount = 0;
    let totalDrawTime = 0;
    const ADAPT_INTERVAL = 15; // Check every 15 frames
    const TARGET_MAX_MS = 9; // Budget for drawing (user request)
    const TARGET_MIN_MS = 4; // Higher floor for more consistent scaling

    let frameStats = {
        timeToDraw: 0,
        pixelsTotal: 0,
        currentRes: resolution,
    };

    onMount(() => {
        ctx = canvas.getContext("2d", { alpha: false });
        resize();
        render(0);

        window.addEventListener("resize", resize);
        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationId);
        };
    });

    // React to resolution changes
    import { untrack } from "svelte";
    $effect(() => {
        resolution; // track
        untrack(() => resize());
    });

    function resize() {
        if (!canvas) return;
        const dpr = window.devicePixelRatio || 1;

        // The display size
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;

        // The drawing size (scaled by optimization factor)
        logicalWidth = Math.floor(displayWidth * internalResolution * dpr);
        logicalHeight = Math.floor(displayHeight * internalResolution * dpr);

        canvas.width = logicalWidth;
        canvas.height = logicalHeight;

        frameStats.pixelsTotal = logicalWidth * logicalHeight;
        frameStats.currentRes = internalResolution;

        // If we are using standard draw calls (not putImageData),
        // they will now be relative to this new smaller width/height.
    }

    /** @param {number} time */
    function render(time) {
        if (!ctx) return;

        // Throttle FPS
        const delta = time - lastTime;
        const interval = 1000 / fps;

        if (delta >= interval) {
            lastTime = time - (delta % interval);

            const startTime = performance.now();

            switch (type) {
                case "classic":
                    drawClassic(logicalWidth, logicalHeight);
                    break;
                case "chromatic":
                    drawChromatic(logicalWidth, logicalHeight);
                    break;
                case "vaporware":
                    drawVaporware(logicalWidth, logicalHeight);
                    break;
                case "digital":
                    drawDigital(logicalWidth, logicalHeight);
                    break;
                case "snowstorm":
                    drawSnowstorm(logicalWidth, logicalHeight);
                    break;
            }

            frameStats.timeToDraw = performance.now() - startTime;

            // Adaptive scaling logic
            if (adaptive) {
                frameCount++;
                totalDrawTime += frameStats.timeToDraw;

                if (frameCount >= ADAPT_INTERVAL) {
                    const avgTime = totalDrawTime / ADAPT_INTERVAL;
                    let changed = false;

                    if (avgTime > TARGET_MAX_MS && internalResolution > 0.1) {
                        internalResolution = Math.max(
                            0.1,
                            internalResolution - 0.05,
                        );
                        changed = true;
                    } else if (
                        avgTime < TARGET_MIN_MS &&
                        internalResolution < resolution
                    ) {
                        internalResolution = Math.min(
                            resolution,
                            internalResolution + 0.05,
                        );
                        changed = true;
                    }

                    if (changed) resize();

                    frameCount = 0;
                    totalDrawTime = 0;
                }
            }

            if (onDebug) onDebug(frameStats);
        }

        animationId = requestAnimationFrame(render);
    }

    // --- Static Generators ---

    /**
     * @param {number} w
     * @param {number} h
     */
    function drawClassic(w, h) {
        if (w === 0 || h === 0) return;
        const imageData = ctx.createImageData(w, h);
        const data = imageData.data;
        const range = ceiling - floor;
        for (let i = 0; i < data.length; i += 4) {
            const v = (floor + Math.random() * range) * intensity;
            data[i] = v; // R
            data[i + 1] = v; // G
            data[i + 2] = v; // B
            data[i + 3] = 255; // A
        }
        ctx.putImageData(imageData, 0, 0);
    }

    /**
     * @param {number} w
     * @param {number} h
     */
    function drawChromatic(w, h) {
        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, w, h);

        const rows = 30;
        const rowHeight = h / rows;

        for (let y = 0; y < rows; y++) {
            const offset = (Math.random() - 0.5) * 15 * speed;

            // Red Channel
            ctx.fillStyle = `rgba(255, 0, 0, ${0.1 * intensity})`;
            ctx.fillRect(offset, y * rowHeight, w, rowHeight);

            // Blue Channel
            ctx.fillStyle = `rgba(0, 0, 255, ${0.1 * intensity})`;
            ctx.fillRect(-offset, y * rowHeight, w, rowHeight);
        }

        // Add scanlines
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        for (let i = 0; i < 50 * intensity; i++) {
            ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
        }
    }

    /**
     * @param {number} w
     * @param {number} h
     */
    function drawVaporware(w, h) {
        if (w === 0 || h === 0) return;
        const imageData = ctx.createImageData(w, h);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const noise = Math.random();
            if (noise > 0.98) {
                data[i] = 255; // Pink/Purple
                data[i + 1] = 20;
                data[i + 2] = 180;
            } else if (noise < 0.02) {
                data[i] = 20; // Teal
                data[i + 1] = 200;
                data[i + 2] = 255;
            } else {
                const v = noise * 30;
                data[i] = v;
                data[i + 1] = v;
                data[i + 2] = v;
            }
            data[i + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);

        // Standard scanlines
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        for (let y = 0; y < h; y += 4) {
            ctx.fillRect(0, y, w, 1);
        }
    }

    /**
     * @param {number} w
     * @param {number} h
     */
    function drawDigital(w, h) {
        // Blocky, low res noise
        const blockSize = 8;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, w, h);

        for (let x = 0; x < w; x += blockSize) {
            for (let y = 0; y < h; y += blockSize) {
                if (Math.random() > 0.9 / intensity) {
                    const r = Math.random() > 0.5 ? 255 : 0;
                    const g = Math.random() > 0.5 ? 255 : 0;
                    const b = Math.random() > 0.5 ? 255 : 0;
                    ctx.fillStyle = `rgb(${r},${g},${b})`;
                    ctx.fillRect(x, y, blockSize, blockSize);
                } else {
                    const v = Math.random() * 50;
                    ctx.fillStyle = `rgb(${v},${v},${v})`;
                    ctx.fillRect(x, y, blockSize, blockSize);
                }
            }
        }
    }

    /**
     * @param {number} w
     * @param {number} h
     */
    function drawSnowstorm(w, h) {
        // Larger "snow" particles and streaks
        ctx.fillStyle = "rgba(20, 20, 20, 0.8)";
        ctx.fillRect(0, 0, w, h);

        for (let i = 0; i < 200 * intensity; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const size = Math.random() * 3 + 1;
            const brightness = Math.random() * 200 + 55;
            ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, 0.8)`;
            ctx.fillRect(x, y, size, size);

            // Random horizontal streaks
            if (Math.random() > 0.98) {
                ctx.fillRect(0, y, w, 1);
            }
        }
    }
</script>

<canvas bind:this={canvas} class="static-canvas" style="opacity: {opacity};"
></canvas>

<style>
    .static-canvas {
        width: 100%;
        height: 100%;
        display: block;
        image-rendering: pixelated;
    }
</style>
