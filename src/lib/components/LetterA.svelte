<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D | null;
    let animationFrameId: number;
    let isHovered = false;

    // Configuration Props
    export let character = "A";
    export let fontFamily = "'Courier New', monospace"; // From Variant 7 (Matrix)
    export let particleSize = 1; // From Variant 5 (Stardust)
    export let particleDensity = 3; // From Variant 5 (Stardust)
    export let particleColor = "#8ba59e"; // From Variant 5 (Stardust)
    export let interactionRadius = 120; // From Variant 5 (Stardust)
    export let restoreSpeed = 0.02; // From Variant 5 (Stardust)
    export let volatility = 0.5; // From Variant 5 (Stardust)

    // Particle System Constants
    const MOUSE_FORCE = 2;
    const DAMPING = 0.9;

    interface Particle {
        x: number;
        y: number;
        originX: number;
        originY: number;
        vx: number;
        vy: number;
        size: number;
        color: string;
    }

    let particles: Particle[] = [];
    let mouseX = -1000;
    let mouseY = -1000;

    function initParticles() {
        if (!canvas) return;

        // Use logical dimensions
        const width = 200;
        const height = 300;

        particles = [];

        const offscreen = document.createElement("canvas");
        offscreen.width = width;
        offscreen.height = height;
        const offCtx = offscreen.getContext("2d");
        if (!offCtx) return;

        // Draw text
        offCtx.fillStyle = "#000";
        offCtx.font = `bold 250px ${fontFamily}`;
        offCtx.textAlign = "center";
        offCtx.textBaseline = "middle";
        offCtx.fillText(character, width / 2, height / 2 + 20); // +20 for visual centering

        const imageData = offCtx.getImageData(0, 0, width, height).data;

        const style = getComputedStyle(canvas);
        const defaultColor =
            style.getPropertyValue("--text-primary").trim() || "#ffffff";
        const pColor = particleColor || defaultColor;

        for (let y = 0; y < height; y += particleDensity) {
            for (let x = 0; x < width; x += particleDensity) {
                const index = (y * width + x) * 4;
                if (imageData[index + 3] > 128) {
                    particles.push({
                        x,
                        y,
                        originX: x,
                        originY: y,
                        vx: (Math.random() - 0.5) * volatility,
                        vy: (Math.random() - 0.5) * volatility,
                        size: particleSize + Math.random(),
                        color: pColor,
                    });
                }
            }
        }
    }

    function update() {
        particles.forEach((p) => {
            // Calculate distance to mouse
            const dx = p.x - mouseX;
            const dy = p.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Repulsion force
            if (distance < interactionRadius) {
                const force =
                    (interactionRadius - distance) / interactionRadius;
                const angle = Math.atan2(dy, dx);
                p.vx += Math.cos(angle) * force * MOUSE_FORCE;
                p.vy += Math.sin(angle) * force * MOUSE_FORCE;
            }

            // Return force (spring)
            const homeDx = p.originX - p.x;
            const homeDy = p.originY - p.y;
            p.vx += homeDx * restoreSpeed;
            p.vy += homeDy * restoreSpeed;

            // Volatility (random noise)
            if (volatility > 0) {
                p.vx += (Math.random() - 0.5) * volatility * 0.1;
                p.vy += (Math.random() - 0.5) * volatility * 0.1;
            }

            // Damping
            p.vx *= DAMPING;
            p.vy *= DAMPING;

            // Update position
            p.x += p.vx;
            p.y += p.vy;
        });
    }

    function lerpColor(a: string, b: string, amount: number) {
        const ah = parseInt(a.replace(/#/g, ""), 16),
            ar = ah >> 16,
            ag = (ah >> 8) & 0xff,
            ab = ah & 0xff,
            bh = parseInt(b.replace(/#/g, ""), 16),
            br = bh >> 16,
            bg = (bh >> 8) & 0xff,
            bb = bh & 0xff,
            rr = ar + amount * (br - ar),
            rg = ag + amount * (bg - ag),
            rb = ab + amount * (bb - ab);

        return (
            "#" +
            (((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0)
                .toString(16)
                .slice(1)
        );
    }

    function draw() {
        if (!ctx || !canvas) return;

        // Clear using logical dimensions (200x300)
        ctx.clearRect(0, 0, 200, 300);

        // Get computed styles for colors if needed
        const style = getComputedStyle(canvas);
        const glowColor =
            style.getPropertyValue("--accent-glow").trim() || "#f0ffce";

        particles.forEach((p) => {
            ctx!.beginPath();
            ctx!.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);

            // Calculate velocity magnitude for color interpolation
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            // Smoother transition: map speed 0-5 to 0-1
            const glowIntensity = Math.min(speed / 5, 1);

            // Interpolate color if possible (only works for hex)
            if (p.color.startsWith("#") && glowColor.startsWith("#")) {
                ctx!.fillStyle = lerpColor(p.color, glowColor, glowIntensity);
            } else {
                // Fallback for non-hex colors
                ctx!.fillStyle = glowIntensity > 0.1 ? glowColor : p.color;
            }

            ctx!.fill();
        });
    }

    function loop() {
        update();
        draw();
        animationFrameId = requestAnimationFrame(loop);
    }

    onMount(() => {
        ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        // Scale context to match logical size (200x300) to physical size
        const scaleX = (rect.width * dpr) / 200;
        const scaleY = (rect.height * dpr) / 300;
        ctx?.scale(scaleX, scaleY);

        initParticles();
        loop();
    });

    onDestroy(() => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
    });

    function handleMouseMove(e: MouseEvent) {
        const rect = canvas.getBoundingClientRect();
        // Map mouse to logical coordinates (200x300)
        mouseX = (e.clientX - rect.left) * (200 / rect.width);
        mouseY = (e.clientY - rect.top) * (300 / rect.height);
        isHovered = true;
    }

    function handleMouseLeave() {
        mouseX = -1000;
        mouseY = -1000;
        isHovered = false;
    }

    function handleTouchMove(e: TouchEvent) {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        // Map touch to logical coordinates (200x300)
        mouseX = (touch.clientX - rect.left) * (200 / rect.width);
        mouseY = (touch.clientY - rect.top) * (300 / rect.height);
    }
</script>

<div class="letter-container" role="presentation">
    <canvas
        bind:this={canvas}
        on:mousemove={handleMouseMove}
        on:mouseleave={handleMouseLeave}
        on:touchmove={handleTouchMove}
        on:touchstart={handleTouchMove}
        class="letter-a"
        class:hovered={isHovered}
    ></canvas>
</div>

<style>
    .letter-container {
        display: inline-block;
        padding: 2rem;
        cursor: pointer;
    }

    .letter-a {
        width: 200px;
        height: 300px;
        /* Canvas needs explicit size for simple scaling, handled in onMount for DPI */
    }

    @media (max-width: 768px) {
        .letter-a {
            width: 150px;
            height: 225px;
        }

        .letter-container {
            padding: 1rem;
        }
    }
</style>
