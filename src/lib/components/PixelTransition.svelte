<script lang="ts">
    import { onMount, afterUpdate, createEventDispatcher } from "svelte";
    import { browser } from "$app/environment";

    export let src: string;
    export let alt: string = "";
    export let className: string = "";
    export let paused: boolean = false;

    const dispatch = createEventDispatcher();

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D | null = null;
    let image: HTMLImageElement | null = null;
    let animationId: number;
    let startTime: number;
    let animationProgress = 0; // Track progress to resume correctly

    // Animation config
    const duration = 1000; // ms
    const startPixelSize = 40; // Initial pixel size
    const endPixelSize = 1; // Final pixel size

    $: if (browser && src) {
        loadImage(src);
    }

    $: if (paused) {
        if (animationId) cancelAnimationFrame(animationId);
    } else {
        // Only resume if we have image/canvas and were in progress
        // We use a non-reactive check here to avoid loops
        resumeIfPaused();
    }

    function resumeIfPaused() {
        if (image && canvas && animationProgress < 1 && animationProgress > 0) {
            startTime = performance.now() - animationProgress * duration;
            animate();
        }
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

                animationProgress = 0;
                startAnimation();
            }
        };
    }

    function extractDominantColor(img: HTMLImageElement) {
        // Defer to next tick to avoid blocking the main thread during animation start
        setTimeout(() => {
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = 1;
            tempCanvas.height = 1;
            const tempCtx = tempCanvas.getContext("2d");
            if (tempCtx) {
                tempCtx.drawImage(img, 0, 0, 1, 1);
                const [r, g, b] = tempCtx.getImageData(0, 0, 1, 1).data;
                dispatch("dominantColor", `rgb(${r}, ${g}, ${b})`);
            }
        }, 0);
    }

    function startAnimation() {
        if (animationId) cancelAnimationFrame(animationId);
        startTime = performance.now();
        if (!paused) {
            animate();
        }
    }

    function animate() {
        if (!ctx || !image || !canvas) return;

        const now = performance.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        animationProgress = progress;

        // Easing (easeOutQuad)
        const ease = 1 - (1 - progress) * (1 - progress);

        // Calculate current pixel size
        const currentPixelSize =
            startPixelSize - (startPixelSize - endPixelSize) * ease;

        // Draw
        drawPixelated(currentPixelSize);

        if (progress < 1) {
            if (!paused) {
                animationId = requestAnimationFrame(animate);
            }
        } else {
            // Final draw to ensure sharpness
            drawPixelated(1);
        }
    }

    let offscreenCanvas: HTMLCanvasElement;
    let offscreenCtx: CanvasRenderingContext2D | null = null;

    onMount(() => {
        if (canvas) {
            ctx = canvas.getContext("2d");
        }
        // Create offscreen canvas once
        offscreenCanvas = document.createElement("canvas");
        offscreenCtx = offscreenCanvas.getContext("2d", { alpha: false }); // Optimize for no alpha if possible

        return () => {
            if (animationId) cancelAnimationFrame(animationId);
        };
    });

    function drawPixelated(pixelSize: number) {
        if (!ctx || !image || !canvas || !offscreenCanvas || !offscreenCtx)
            return;

        // Calculate temporary dimensions
        // Ensure at least 1x1
        const w = Math.max(1, Math.floor(canvas.width / pixelSize));
        const h = Math.max(1, Math.floor(canvas.height / pixelSize));

        // Disable smoothing for pixel art look
        ctx.imageSmoothingEnabled = false;
        offscreenCtx.imageSmoothingEnabled = false;

        // Resize offscreen canvas if needed (or just keep it large enough?)
        // Resizing is expensive. Let's resize only if dimensions change.
        if (offscreenCanvas.width !== w || offscreenCanvas.height !== h) {
            offscreenCanvas.width = w;
            offscreenCanvas.height = h;
        }

        // Draw small to offscreen
        offscreenCtx.drawImage(image, 0, 0, w, h);

        // Draw back to main canvas scaled up
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
            offscreenCanvas,
            0,
            0,
            w,
            h,
            0,
            0,
            canvas.width,
            canvas.height,
        );
    }
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
