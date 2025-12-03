<script lang="ts">
    import { onMount } from "svelte";

    export let imageUrl = "/particle-reference.png";
    export let density = 50; // Particles per row/col (approx)
    export let particleSize = 0.1; // This will now be pixel radius, need to adjust scale

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D | null = null;
    // Removed width and height state variables as canvas resolution is fixed to image size

    let loaded = false;
    let image: HTMLImageElement | null = null;
    let particles: { x: number; y: number; color: string }[] = [];

    const scaleFactor = 4; // Supersampling for sharpness

    // Load image
    function loadImage(url: string) {
        loaded = false;
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        img.onload = () => {
            image = img;
            loaded = true;

            // Set canvas resolution to match image * scaleFactor
            if (canvas) {
                canvas.width = img.width * scaleFactor;
                canvas.height = img.height * scaleFactor;
            }

            sampleParticles();
            resizeCanvas(); // Fit to screen initially
        };
    }

    onMount(() => {
        if (canvas) {
            ctx = canvas.getContext("2d");
        }

        // Use ResizeObserver to update CSS size only
        const resizeObserver = new ResizeObserver(() => {
            resizeCanvas();
        });

        if (canvas && canvas.parentElement) {
            resizeObserver.observe(canvas.parentElement);
        }

        loadImage(imageUrl);

        return () => {
            resizeObserver.disconnect();
        };
    });

    function resizeCanvas() {
        if (!canvas || !image) return;
        const parent = canvas.parentElement;
        if (parent) {
            const parentWidth = parent.clientWidth;
            const parentHeight = parent.clientHeight;

            const imageAspectRatio = image.width / image.height;
            const parentAspectRatio = parentWidth / parentHeight;

            let finalWidth, finalHeight;

            if (parentAspectRatio > imageAspectRatio) {
                // Parent is wider than image -> constrain by height
                finalHeight = parentHeight;
                finalWidth = finalHeight * imageAspectRatio;
            } else {
                // Parent is taller than image -> constrain by width
                finalWidth = parentWidth;
                finalHeight = finalWidth / imageAspectRatio;
            }

            // Apply CSS scaling
            canvas.style.width = `${finalWidth}px`;
            canvas.style.height = `${finalHeight}px`;
        }
    }

    $: if (imageUrl) {
        // loadImage(imageUrl); // Uncomment if we want auto-reload on prop change
    }

    // Re-sample when density changes
    $: if (loaded && density && image) {
        sampleParticles();
    }

    // Re-draw when size changes or particles update
    $: if (loaded && particleSize && particles.length > 0) {
        draw();
    }

    function sampleParticles() {
        if (!image || !ctx) return;

        // Create a temporary canvas to sample pixel data
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        if (!tempCtx) return;

        // Maintain aspect ratio
        const aspectRatio = image.width / image.height;

        // Calculate grid based on density
        // We want 'density' rows. Cols will be density * aspectRatio
        const rows = density;
        const cols = Math.floor(density * aspectRatio);

        tempCanvas.width = cols;
        tempCanvas.height = rows;

        // Draw image scaled down to the grid size
        tempCtx.drawImage(image, 0, 0, cols, rows);

        const imageData = tempCtx.getImageData(0, 0, cols, rows).data;

        particles = [];

        // Calculate cell size in IMAGE coordinates
        const cellWidth = image.width / cols;
        const cellHeight = image.height / rows;

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const i = (y * cols + x) * 4;
                const r = imageData[i];
                const g = imageData[i + 1];
                const b = imageData[i + 2];
                const a = imageData[i + 3];

                // Chroma Key: Ignore Hot Pink (#FF00FF)
                // Allow some tolerance for compression artifacts
                if (r > 200 && g < 50 && b > 200) {
                    continue;
                }

                if (a > 0) {
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
        if (!ctx || !image) return;

        ctx.save();
        ctx.scale(scaleFactor, scaleFactor);

        // Clear entire canvas (using logical image dimensions)
        ctx.clearRect(0, 0, image.width, image.height);

        // Calculate cell width for relative sizing
        const aspectRatio = image.width / image.height;
        const cols = Math.floor(density * aspectRatio);
        const cellWidth = image.width / cols;

        // Adjust particle size relative to cell width
        const radius = Math.max(0.5, cellWidth * particleSize);

        for (const p of particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        }

        ctx.restore();
    }
</script>

<canvas bind:this={canvas} class="block w-full h-full" />
