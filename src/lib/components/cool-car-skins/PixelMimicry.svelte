<script lang="ts">
    import { createViewerStore } from "$lib/stores/viewerStore";
    import { onMount, afterUpdate } from "svelte";
    import { browser } from "$app/environment";

    const { currentIndex, images, nextImage, prevImage, selectRandomImage } =
        createViewerStore();

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D | null = null;
    let loaded = false;
    let image: HTMLImageElement | null = null;
    let particles: { x: number; y: number; color: string }[] = [];

    // Config
    const density = 60;
    const particleSize = 0.4;
    const scaleFactor = 2;

    $: currentImageUrl = images[$currentIndex];

    // Load image whenever URL changes
    $: if (browser && currentImageUrl) {
        loadImage(currentImageUrl);
    }

    function loadImage(url: string) {
        if (!browser) return;

        loaded = false;
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        img.onload = () => {
            image = img;
            loaded = true;
            if (canvas) {
                // Set canvas resolution
                canvas.width = img.width * scaleFactor;
                canvas.height = img.height * scaleFactor;
                sampleParticles();
            }
        };
    }

    function sampleParticles() {
        if (!image || !canvas) return;

        // Temp canvas for sampling
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        if (!tempCtx) return;

        const aspectRatio = image.width / image.height;
        const rows = density;
        const cols = Math.floor(density * aspectRatio);

        tempCanvas.width = cols;
        tempCanvas.height = rows;
        tempCtx.drawImage(image, 0, 0, cols, rows);

        const imageData = tempCtx.getImageData(0, 0, cols, rows).data;
        particles = [];

        const cellWidth = image.width / cols;
        const cellHeight = image.height / rows;

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const i = (y * cols + x) * 4;
                const r = imageData[i];
                const g = imageData[i + 1];
                const b = imageData[i + 2];
                const a = imageData[i + 3];

                // Simple chroma key for white/transparent if needed,
                // but for now just check alpha
                if (a > 20) {
                    particles.push({
                        x: x * cellWidth + cellWidth / 2,
                        y: y * cellHeight + cellHeight / 2,
                        color: `rgb(${r},${g},${b})`,
                    });
                }
            }
        }
        draw();
    }

    function draw() {
        if (!canvas || !ctx || !image) return;

        ctx.save();
        ctx.scale(scaleFactor, scaleFactor);
        ctx.clearRect(0, 0, image.width, image.height);

        const aspectRatio = image.width / image.height;
        const cols = Math.floor(density * aspectRatio);
        const cellWidth = image.width / cols;
        const radius = Math.max(0.5, cellWidth * particleSize);

        for (const p of particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        }

        ctx.restore();
    }

    onMount(() => {
        if (canvas) {
            ctx = canvas.getContext("2d");
        }
    });
</script>

```
<div class="pixel-mimicry">
    <div class="glass-orb">
        <div class="canvas-container">
            <canvas bind:this={canvas} />
        </div>
        <div class="reflection"></div>
        <div class="controls">
            <button class="orb-btn" on:click={prevImage}></button>
            <button class="orb-btn center" on:click={selectRandomImage}
            ></button>
            <button class="orb-btn" on:click={nextImage}></button>
        </div>
    </div>
</div>

<style>
    .pixel-mimicry {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 400px;
    }

    .glass-orb {
        width: 350px;
        height: 350px;
        border-radius: 50%;
        background: radial-gradient(
            circle at 30% 30%,
            rgba(255, 255, 255, 0.1),
            rgba(0, 0, 0, 0.8)
        );
        box-shadow:
            0 20px 50px rgba(0, 0, 0, 0.5),
            inset 0 0 50px rgba(0, 0, 0, 0.8);
        position: relative;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .canvas-container {
        width: 90%;
        height: 90%;
        display: flex;
        justify-content: center;
        align-items: center;
        filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.2));
    }

    canvas {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .reflection {
        position: absolute;
        top: 10%;
        left: 10%;
        width: 40%;
        height: 20%;
        background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.4),
            transparent
        );
        border-radius: 50%;
        transform: rotate(-45deg);
        filter: blur(5px);
        pointer-events: none;
    }

    .controls {
        position: absolute;
        bottom: 30px;
        display: flex;
        gap: 15px;
        background: rgba(255, 255, 255, 0.1);
        padding: 10px 20px;
        border-radius: 30px;
        backdrop-filter: blur(5px);
    }

    .orb-btn {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        border: none;
        cursor: pointer;
        transition: all 0.2s;
    }

    .orb-btn:hover {
        background: #fff;
        box-shadow: 0 0 10px #fff;
        transform: scale(1.2);
    }

    .orb-btn.center {
        width: 16px;
        height: 16px;
        background: rgba(0, 255, 255, 0.5);
    }
    .orb-btn.center:hover {
        background: #0ff;
        box-shadow: 0 0 10px #0ff;
    }
</style>
