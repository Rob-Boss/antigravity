<script lang="ts">
    import { onMount } from "svelte";

    export let type: string = "white-noise";

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D | null;
    let animationFrame: number;

    onMount(() => {
        if (!canvas) return;
        ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        animate();

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    });

    function animate() {
        if (!ctx || !canvas) return;

        switch (type) {
            case "white-noise":
                drawWhiteNoise();
                break;
            case "color-bars":
                drawColorBars();
                break;
            case "snow":
                drawSnow();
                break;
            case "interference":
                drawInterference();
                break;
            case "vhs-tracking":
                drawVHSTracking();
                break;
            case "signal-loss":
                drawSignalLoss();
                break;
            case "chromatic":
                drawChromaticNoise();
                break;
            case "analog-glitch":
                drawAnalogGlitch();
                break;
            case "test-pattern":
                drawTestPattern();
                break;
            case "dead-channel":
                drawDeadChannel();
                break;
            case "rolling":
                drawRollingStatic();
                break;
            default:
                drawWhiteNoise();
        }

        animationFrame = requestAnimationFrame(animate);
    }

    // 1. Classic white noise
    function drawWhiteNoise() {
        if (!ctx || !canvas) return;
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        for (let i = 0; i < imageData.data.length; i += 4) {
            const value = Math.random() * 255;
            imageData.data[i] = value;
            imageData.data[i + 1] = value;
            imageData.data[i + 2] = value;
            imageData.data[i + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
    }

    // 2. SMPTE Color Bars (TV test pattern)
    function drawColorBars() {
        if (!ctx || !canvas) return;
        const colors = [
            "#c0c0c0", // White
            "#c0c000", // Yellow
            "#00c0c0", // Cyan
            "#00c000", // Green
            "#c000c0", // Magenta
            "#c00000", // Red
            "#0000c0", // Blue
        ];
        const barWidth = canvas.width / colors.length;
        colors.forEach((color, i) => {
            ctx!.fillStyle = color;
            ctx!.fillRect(i * barWidth, 0, barWidth, canvas.height * 0.75);
        });
        // Bottom section - black, white, black, white
        ctx.fillStyle = "#000";
        ctx.fillRect(
            0,
            canvas.height * 0.75,
            canvas.width,
            canvas.height * 0.25,
        );

        // Add subtle noise overlay
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < imageData.data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 20;
            imageData.data[i] += noise;
            imageData.data[i + 1] += noise;
            imageData.data[i + 2] += noise;
        }
        ctx.putImageData(imageData, 0, 0);
    }

    // 3. TV Snow (analog static)
    function drawSnow() {
        if (!ctx || !canvas) return;
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        for (let i = 0; i < imageData.data.length; i += 4) {
            const rand = Math.random();
            const value = rand > 0.5 ? 255 : 0;
            imageData.data[i] = value;
            imageData.data[i + 1] = value;
            imageData.data[i + 2] = value;
            imageData.data[i + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
    }

    // 4. Interference patterns (diagonal waves)
    let interferenceOffset = 0;
    function drawInterference() {
        if (!ctx || !canvas) return;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const imageData = ctx.createImageData(canvas.width, canvas.height);
        interferenceOffset += 2;

        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const i = (y * canvas.width + x) * 4;
                const wave =
                    Math.sin((x + y + interferenceOffset) * 0.05) * 127 + 128;
                const noise = Math.random() * 50;
                const value = wave + noise;

                imageData.data[i] = value * 0.8;
                imageData.data[i + 1] = value * 0.9;
                imageData.data[i + 2] = value;
                imageData.data[i + 3] = 255;
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    // 5. VHS tracking errors (horizontal bands)
    let trackingOffset = 0;
    function drawVHSTracking() {
        if (!ctx || !canvas) return;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        trackingOffset = (trackingOffset + 1) % canvas.height;

        for (let y = 0; y < canvas.height; y += 10) {
            const offsetY = (y + trackingOffset) % canvas.height;
            const shift = Math.sin(y * 0.1) * 20;
            ctx.fillStyle = `rgb(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100})`;
            ctx.fillRect(shift, offsetY, canvas.width, 8);
        }

        // Add noise
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < imageData.data.length; i += 4) {
            if (Math.random() > 0.7) {
                const value = Math.random() * 255;
                imageData.data[i] = value;
                imageData.data[i + 1] = value;
                imageData.data[i + 2] = value;
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    // 6. Signal loss (fading in/out ghostly image)
    let signalPhase = 0;
    function drawSignalLoss() {
        if (!ctx || !canvas) return;
        signalPhase += 0.05;
        const strength = (Math.sin(signalPhase) + 1) / 2;

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Ghostly bars
        ctx.globalAlpha = strength * 0.3;
        for (let i = 0; i < 5; i++) {
            ctx.fillStyle = `hsl(${i * 60}, 50%, 50%)`;
            ctx.fillRect(
                0,
                (i * canvas.height) / 5,
                canvas.width,
                canvas.height / 5,
            );
        }
        ctx.globalAlpha = 1;

        // Heavy noise
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        for (let i = 0; i < imageData.data.length; i += 4) {
            const value = Math.random() * 255 * (1 - strength * 0.5);
            imageData.data[i] = value;
            imageData.data[i + 1] = value;
            imageData.data[i + 2] = value;
            imageData.data[i + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
    }

    // 7. Chromatic aberration noise
    function drawChromaticNoise() {
        if (!ctx || !canvas) return;
        const imageData = ctx.createImageData(canvas.width, canvas.height);

        for (let i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i] = Math.random() * 255; // R
            imageData.data[i + 1] = Math.random() * 200; // G
            imageData.data[i + 2] = Math.random() * 255; // B
            imageData.data[i + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
    }

    // 8. Analog glitch (random blocks and shifts)
    function drawAnalogGlitch() {
        if (!ctx || !canvas) return;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Random horizontal shifts
        for (let i = 0; i < 20; i++) {
            const y = Math.random() * canvas.height;
            const height = Math.random() * 50;
            const shift = (Math.random() - 0.5) * 100;

            ctx.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 100}, ${Math.random() * 200})`;
            ctx.fillRect(shift, y, canvas.width, height);
        }

        // Noise overlay
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        for (let i = 0; i < imageData.data.length; i += 4) {
            if (Math.random() > 0.9) {
                const value = Math.random() * 255;
                imageData.data[i] = value;
                imageData.data[i + 1] = value * 0.5;
                imageData.data[i + 2] = value * 0.8;
                imageData.data[i + 3] = 255;
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    // 9. Test pattern (circle and grid)
    function drawTestPattern() {
        if (!ctx || !canvas) return;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Center circle
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshairs
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();

        // Grid
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Text
        ctx.fillStyle = "#fff";
        ctx.font = "24px monospace";
        ctx.textAlign = "center";
        ctx.fillText("TEST PATTERN", canvas.width / 2, 50);

        // Add subtle flicker
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < imageData.data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 10;
            imageData.data[i] += noise;
            imageData.data[i + 1] += noise;
            imageData.data[i + 2] += noise;
        }
        ctx.putImageData(imageData, 0, 0);
    }

    // 10. Dead channel (very dark with occasional flickers)
    function drawDeadChannel() {
        if (!ctx || !canvas) return;
        ctx.fillStyle = "#0a0a0a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Rare flickers
        if (Math.random() > 0.95) {
            ctx.fillStyle = `rgba(${Math.random() * 50}, ${Math.random() * 50}, ${Math.random() * 80}, 0.3)`;
            ctx.fillRect(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                Math.random() * 200,
                Math.random() * 100,
            );
        }

        // Very subtle noise
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        for (let i = 0; i < imageData.data.length; i += 4) {
            if (Math.random() > 0.98) {
                const value = Math.random() * 30;
                imageData.data[i] = value;
                imageData.data[i + 1] = value;
                imageData.data[i + 2] = value;
                imageData.data[i + 3] = 255;
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    // Rolling static (for transitions)
    let rollOffset = 0;
    function drawRollingStatic() {
        if (!ctx || !canvas) return;
        rollOffset += 8;
        if (rollOffset > canvas.height) rollOffset = 0;

        // Generate noise
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        for (let i = 0; i < imageData.data.length; i += 4) {
            const value = Math.random() * 255;
            imageData.data[i] = value;
            imageData.data[i + 1] = value;
            imageData.data[i + 2] = value;
            imageData.data[i + 3] = 255;
        }

        // Draw with vertical offset
        ctx.putImageData(imageData, 0, -rollOffset);
        ctx.putImageData(imageData, 0, canvas.height - rollOffset);
    }
</script>

<canvas bind:this={canvas} class="static-canvas"></canvas>

<style>
    .static-canvas {
        width: 100%;
        height: 100%;
        display: block;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
    }
</style>
