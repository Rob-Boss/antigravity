<script lang="ts">
    import { onMount, afterUpdate, createEventDispatcher } from "svelte";
    import { browser } from "$app/environment";

    export let src: string;
    export let alt: string = "";
    export let className: string = "";

    const dispatch = createEventDispatcher();

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D | null = null;
    let image: HTMLImageElement | null = null;
    let animationId: number;
    let startTime: number;

    // Animation config
    const duration = 1000; // ms
    const startPixelSize = 40; // Initial pixel size
    const endPixelSize = 1; // Final pixel size

    $: if (browser && src) {
        loadImage(src);
    }

    function loadImage(url: string) {
        if (!browser) return;

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        img.onload = () => {
            image = img;
            if (canvas) {
                // Set canvas resolution to match image
                canvas.width = img.width;
                canvas.height = img.height;

                // Extract dominant color
                extractDominantColor(img);

                startAnimation();
            }
        };
    }

    function extractDominantColor(img: HTMLImageElement) {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = 1;
        tempCanvas.height = 1;
        const tempCtx = tempCanvas.getContext("2d");
        if (tempCtx) {
            tempCtx.drawImage(img, 0, 0, 1, 1);
            const [r, g, b] = tempCtx.getImageData(0, 0, 1, 1).data;
            dispatch("dominantColor", `rgb(${r}, ${g}, ${b})`);
        }
    }

    function startAnimation() {
        if (animationId) cancelAnimationFrame(animationId);
        startTime = performance.now();
        animate();
    }

    function animate() {
        if (!ctx || !image || !canvas) return;

        const now = performance.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing (easeOutQuad)
        const ease = 1 - (1 - progress) * (1 - progress);

        // Calculate current pixel size
        const currentPixelSize =
            startPixelSize - (startPixelSize - endPixelSize) * ease;

        // Draw
        drawPixelated(currentPixelSize);

        if (progress < 1) {
            animationId = requestAnimationFrame(animate);
        } else {
            // Final draw to ensure sharpness
            drawPixelated(1);
        }
    }

    function drawPixelated(pixelSize: number) {
        if (!ctx || !image || !canvas) return;

        // Calculate temporary dimensions
        // Ensure at least 1x1
        const w = Math.max(1, Math.floor(canvas.width / pixelSize));
        const h = Math.max(1, Math.floor(canvas.height / pixelSize));

        // Disable smoothing for pixel art look
        ctx.imageSmoothingEnabled = false;

        // 1. Draw image small (pixelate)
        // We use a temporary offscreen canvas or just draw directly?
        // Drawing directly with scaling is easier.

        // Save context state
        ctx.save();

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw small
        // We draw the image into the canvas but scaled down, then draw that scaled down version back up?
        // Actually, the easiest way is to draw to a tiny offscreen canvas and then draw that back.

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = w;
        tempCanvas.height = h;
        const tempCtx = tempCanvas.getContext("2d");
        if (!tempCtx) {
            ctx.restore();
            return;
        }

        tempCtx.imageSmoothingEnabled = false;
        tempCtx.drawImage(image, 0, 0, w, h);

        // Draw back to main canvas scaled up
        ctx.drawImage(
            tempCanvas,
            0,
            0,
            w,
            h,
            0,
            0,
            canvas.width,
            canvas.height,
        );

        ctx.restore();
    }

    onMount(() => {
        if (canvas) {
            ctx = canvas.getContext("2d");
        }
        return () => {
            if (animationId) cancelAnimationFrame(animationId);
        };
    });
</script>

<canvas bind:this={canvas} class={className} aria-label={alt} role="img"
></canvas>

<style>
    canvas {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
    }
</style>
