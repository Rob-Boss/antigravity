<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D | null;
    let animationFrameId: number;
    let isHovered = false;

    // Particle System Constants
    const PARTICLE_SIZE = 3;
    const PARTICLE_SPACING = 6; // Spacing between particles in the grid
    const MOUSE_RADIUS = 80; // Radius of influence
    const MOUSE_FORCE = 2; // Strength of repulsion
    const RETURN_FORCE = 0.05; // Strength of return to origin
    const DAMPING = 0.9; // Velocity damping

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

    // Define the shape of 'A' using a grid or path points
    // Simple approach: Define a function that returns true if a point is inside the 'A' shape
    function isInsideA(
        x: number,
        y: number,
        width: number,
        height: number,
    ): boolean {
        // Normalize coordinates to 0-1
        const nx = x / width;
        const ny = y / height;

        // Define 'A' shape roughly
        // Left leg
        if (
            ny > 0.2 &&
            ny < 0.9 &&
            Math.abs(nx - (0.5 - (ny - 0.2) * 0.3)) < 0.06
        )
            return true;
        // Right leg
        if (
            ny > 0.2 &&
            ny < 0.9 &&
            Math.abs(nx - (0.5 + (ny - 0.2) * 0.3)) < 0.06
        )
            return true;
        // Crossbar
        if (ny > 0.6 && ny < 0.68 && Math.abs(nx - 0.5) < 0.15) return true;

        return false;
    }

    function initParticles() {
        if (!canvas) return;
        const width = canvas.width;
        const height = canvas.height;
        particles = [];

        for (let x = 0; x < width; x += PARTICLE_SPACING) {
            for (let y = 0; y < height; y += PARTICLE_SPACING) {
                if (isInsideA(x, y, width, height)) {
                    particles.push({
                        x,
                        y,
                        originX: x,
                        originY: y,
                        vx: 0,
                        vy: 0,
                        size: PARTICLE_SIZE + Math.random() * 2,
                        color: "var(--text-primary)", // Will be computed in draw
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
            if (distance < MOUSE_RADIUS) {
                const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;
                const angle = Math.atan2(dy, dx);
                p.vx += Math.cos(angle) * force * MOUSE_FORCE;
                p.vy += Math.sin(angle) * force * MOUSE_FORCE;
            }

            // Return force (spring)
            const homeDx = p.originX - p.x;
            const homeDy = p.originY - p.y;
            p.vx += homeDx * RETURN_FORCE;
            p.vy += homeDy * RETURN_FORCE;

            // Damping
            p.vx *= DAMPING;
            p.vy *= DAMPING;

            // Update position
            p.x += p.vx;
            p.y += p.vy;
        });
    }

    function draw() {
        if (!ctx || !canvas) {
            console.warn("Canvas or Context missing in draw");
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Get computed styles for colors
        const style = getComputedStyle(canvas);
        const primaryColor =
            style.getPropertyValue("--text-primary").trim() || "#ffffff";
        const glowColor =
            style.getPropertyValue("--accent-glow").trim() || "#f0ffce";

        particles.forEach((p) => {
            ctx!.beginPath();
            ctx!.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);

            // Calculate velocity magnitude for color interpolation
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            const glowIntensity = Math.min(speed / 2, 1);

            ctx!.fillStyle = glowIntensity > 0.1 ? glowColor : primaryColor;
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
        // Handle high DPI displays
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        // Set actual size in memory (scaled to account for extra pixel density)
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        // Normalize coordinate system to use css pixels.
        ctx?.scale(dpr, dpr);

        // Re-init particles based on new logical width/height (which matches CSS size)
        // We need to temporarily override width/height for initParticles logic to work with logical coords
        const logicalWidth = rect.width;
        const logicalHeight = rect.height;

        // Custom init for scaled context
        particles = [];

        for (let x = 0; x < logicalWidth; x += PARTICLE_SPACING) {
            for (let y = 0; y < logicalHeight; y += PARTICLE_SPACING) {
                if (isInsideA(x, y, logicalWidth, logicalHeight)) {
                    particles.push({
                        x,
                        y,
                        originX: x,
                        originY: y,
                        vx: 0,
                        vy: 0,
                        size: PARTICLE_SIZE + Math.random(),
                        color: "",
                    });
                }
            }
        }
        console.log("Particles created:", particles.length);

        loop();
    });

    onDestroy(() => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
    });

    function handleMouseMove(e: MouseEvent) {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
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
        mouseX = touch.clientX - rect.left;
        mouseY = touch.clientY - rect.top;
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
