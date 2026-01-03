<script lang="ts">
    import { onMount, onDestroy, createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import { spring } from "svelte/motion";
    import { audio } from "$lib/audio";

    export let shapeMode:
        | "classic"
        | "curvy"
        | "thick"
        | "serif"
        | "script"
        | "lowercase"
        | "wide"
        | "narrow"
        | "rounded"
        | "angular" = "rounded";
    export let color = "#ffd700";
    export let particleColor = "#ffffff";
    export let audioVariant = 8; // Scanner
    export let secondaryColor = "#ffff00";

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D | null;
    let container: HTMLDivElement;
    let animationFrameId: number;
    let time = 0;
    let mouseX = 100;
    let mouseY = 150;
    let lastMouseX = 100;
    let lastMouseY = 150;
    let mouseVelocity = 0;
    let isHovered = false;

    // Magnetic cursor interaction
    let magnetStrength = 0;
    const magnetSpring = spring(0, { stiffness: 0.12, damping: 0.25 });

    // Smooth amplitude ramping using spring
    const targetAmplitude = spring(1.5, { stiffness: 0.03, damping: 0.4 });
    const targetFrequency = spring(2, { stiffness: 0.05, damping: 0.4 });

    // Momentum-based spinning
    let spinVelocity = 0;
    const spinFriction = 0.98; // Slow wind-down

    interface Particle {
        x: number;
        y: number;
        baseX: number;
        baseY: number;
        size: number;
        baseHue: number; // Each particle has its own base hue
        hueShift: number; // Slow individual hue shift
        saturation: number;
        brightness: number;
        phaseOffset: number;
        driftX: number;
        driftY: number;
    }

    let particles: Particle[] = [];

    // Color palette (removed greens - only warm tones)
    const palette = [
        { h: 10, s: 59, l: 40 }, // reddish-brown: #a53f2b
        { h: 25, s: 73, l: 17 }, // dark-walnut: #4c230a
        { h: 355, s: 100, l: 8 }, // rich-mahogany: #280004
    ];

    const confettiPalette = [
        { h: 180, s: 100, l: 60 }, // Cyan
        { h: 320, s: 100, l: 60 }, // Hot Pink
        { h: 50, s: 100, l: 60 }, // Bright Yellow
        { h: 140, s: 100, l: 60 }, // Lime Green
        { h: 280, s: 100, l: 60 }, // Purple
        { h: 10, s: 90, l: 60 }, // Bright Red
    ];

    function getYShapePoints(): { x: number; y: number }[] {
        const points: { x: number; y: number }[] = [];

        switch (shapeMode) {
            case "classic":
                // Standard Y
                for (let i = 0; i < 60; i++) {
                    const t = i / 60;
                    points.push({ x: 100, y: 250 - t * 100 });
                }
                for (let i = 0; i < 50; i++) {
                    const t = i / 50;
                    points.push({ x: 100 - t * 50, y: 150 - t * 100 });
                }
                for (let i = 0; i < 50; i++) {
                    const t = i / 50;
                    points.push({ x: 100 + t * 50, y: 150 - t * 100 });
                }
                break;

            case "curvy":
                // Curved Y with bezier-like paths
                for (let i = 0; i < 60; i++) {
                    const t = i / 60;
                    const curve = Math.sin(t * Math.PI) * 10;
                    points.push({ x: 100 + curve, y: 250 - t * 100 });
                }
                for (let i = 0; i < 50; i++) {
                    const t = i / 50;
                    const curve = Math.sin(t * Math.PI * 0.5) * 15;
                    points.push({ x: 100 - t * 50 + curve, y: 150 - t * 100 });
                }
                for (let i = 0; i < 50; i++) {
                    const t = i / 50;
                    const curve = Math.sin(t * Math.PI * 0.5) * 15;
                    points.push({ x: 100 + t * 50 - curve, y: 150 - t * 100 });
                }
                break;

            case "thick":
                // Thick Y with multiple particle rows
                for (let row = -8; row <= 8; row += 4) {
                    for (let i = 0; i < 40; i++) {
                        const t = i / 40;
                        points.push({ x: 100 + row, y: 250 - t * 100 });
                    }
                    for (let i = 0; i < 30; i++) {
                        const t = i / 30;
                        points.push({
                            x: 100 - t * 50 + row,
                            y: 150 - t * 100,
                        });
                    }
                    for (let i = 0; i < 30; i++) {
                        const t = i / 30;
                        points.push({
                            x: 100 + t * 50 + row,
                            y: 150 - t * 100,
                        });
                    }
                }
                break;

            case "serif":
                // Serif-style Y with decorative ends
                for (let i = 0; i < 60; i++) {
                    const t = i / 60;
                    points.push({ x: 100, y: 250 - t * 100 });
                }
                // Serifs at bottom
                for (let i = -10; i <= 10; i += 2) {
                    points.push({ x: 100 + i, y: 250 });
                }
                for (let i = 0; i < 50; i++) {
                    const t = i / 50;
                    points.push({ x: 100 - t * 50, y: 150 - t * 100 });
                }
                for (let i = 0; i < 50; i++) {
                    const t = i / 50;
                    points.push({ x: 100 + t * 50, y: 150 - t * 100 });
                }
                // Serifs at arm ends
                for (let i = -8; i <= 8; i += 2) {
                    points.push({ x: 50 + i, y: 50 });
                    points.push({ x: 150 + i, y: 50 });
                }
                break;

            case "script":
                // Flowing script Y
                for (let i = 0; i < 60; i++) {
                    const t = i / 60;
                    const flow = Math.sin(t * Math.PI * 2) * 8;
                    points.push({ x: 100 + flow, y: 250 - t * 100 });
                }
                for (let i = 0; i < 50; i++) {
                    const t = i / 50;
                    const flow = Math.cos(t * Math.PI) * 12;
                    points.push({ x: 100 - t * 50 + flow, y: 150 - t * 100 });
                }
                for (let i = 0; i < 50; i++) {
                    const t = i / 50;
                    const flow = Math.cos(t * Math.PI) * 12;
                    points.push({ x: 100 + t * 50 - flow, y: 150 - t * 100 });
                }
                break;

            case "lowercase":
                // Simple curvy lowercase y with descender
                // Main body (rounded top)
                for (let i = 0; i < 50; i++) {
                    const t = i / 50;
                    const curve = Math.sin(t * Math.PI) * 15;
                    points.push({ x: 100 - t * 40 + curve, y: 80 - t * 30 });
                }
                for (let i = 0; i < 50; i++) {
                    const t = i / 50;
                    const curve = Math.sin(t * Math.PI) * 15;
                    points.push({ x: 100 + t * 40 - curve, y: 80 - t * 30 });
                }
                // Stem down with curve
                for (let i = 0; i < 60; i++) {
                    const t = i / 60;
                    const curve = Math.sin(t * Math.PI * 0.5) * 20;
                    points.push({ x: 100 + curve, y: 80 + t * 120 });
                }
                // Descender tail curves to the left
                for (let i = 0; i < 30; i++) {
                    const t = i / 30;
                    const curveX = t * 40;
                    const curveY = Math.sin(t * Math.PI * 0.5) * 15;
                    points.push({ x: 100 - curveX, y: 200 + curveY });
                }
                break;

            case "wide":
                // Wide Y
                for (let i = 0; i < 60; i++) {
                    const t = i / 60;
                    points.push({ x: 100, y: 250 - t * 100 });
                }
                for (let i = 0; i < 50; i++) {
                    const t = i / 50;
                    points.push({ x: 100 - t * 70, y: 150 - t * 100 });
                }
                for (let i = 0; i < 50; i++) {
                    const t = i / 50;
                    points.push({ x: 100 + t * 70, y: 150 - t * 100 });
                }
                break;

            case "narrow":
                // Narrow Y
                for (let i = 0; i < 60; i++) {
                    const t = i / 60;
                    points.push({ x: 100, y: 250 - t * 100 });
                }
                for (let i = 0; i < 50; i++) {
                    const t = i / 50;
                    points.push({ x: 100 - t * 30, y: 150 - t * 100 });
                }
                for (let i = 0; i < 50; i++) {
                    const t = i / 50;
                    points.push({ x: 100 + t * 30, y: 150 - t * 100 });
                }
                break;

            case "rounded":
                // Thick Rounded Y - Thicker, Squatter, Curved Bottom
                const thickness = 24; // Thicker stroke
                const density = 4; // Higher density for thickness

                // Curved Stem (Lowercase style)
                for (let i = 0; i < 150; i++) {
                    const t = i / 150;
                    // Curve from left (bottom) to center (top)
                    // t=0 (bottom) -> x=60
                    // t=1 (top) -> x=100
                    const curve = (1 - t) * (1 - t) * 40;
                    const baseX = 100 - curve;
                    const baseY = 220 - t * 80; // 220 to 140 (Squatter)

                    for (let j = 0; j < density; j++) {
                        points.push({
                            x: baseX + (Math.random() - 0.5) * thickness,
                            y: baseY + (Math.random() - 0.5) * thickness,
                        });
                    }
                }

                // Left Arm
                for (let i = 0; i < 100; i++) {
                    const t = i / 100;
                    const baseX = 100 - t * 50;
                    const baseY = 140 - t * 60; // 140 to 80
                    for (let j = 0; j < density; j++) {
                        points.push({
                            x: baseX + (Math.random() - 0.5) * thickness,
                            y: baseY + (Math.random() - 0.5) * thickness,
                        });
                    }
                }

                // Right Arm
                for (let i = 0; i < 100; i++) {
                    const t = i / 100;
                    const baseX = 100 + t * 50;
                    const baseY = 140 - t * 60; // 140 to 80
                    for (let j = 0; j < density; j++) {
                        points.push({
                            x: baseX + (Math.random() - 0.5) * thickness,
                            y: baseY + (Math.random() - 0.5) * thickness,
                        });
                    }
                }
                break;

            case "angular":
                // Sharp angular Y
                for (let i = 0; i < 60; i++) {
                    const t = i / 60;
                    const zigzag = Math.floor(t * 10) % 2 === 0 ? 3 : -3;
                    points.push({ x: 100 + zigzag, y: 250 - t * 100 });
                }
                for (let i = 0; i < 50; i++) {
                    const t = i / 50;
                    points.push({ x: 100 - t * 50, y: 150 - t * 100 });
                }
                for (let i = 0; i < 50; i++) {
                    const t = i / 50;
                    points.push({ x: 100 + t * 50, y: 150 - t * 100 });
                }
                break;
        }

        return points;
    }

    function initParticles() {
        particles = [];
        // Use rounded shape by default
        shapeMode = "rounded";
        const shapePoints = getYShapePoints();
        shapePoints.forEach((point) => {
            const jitter = 6;
            const x = point.x + (Math.random() - 0.5) * jitter;
            const y = point.y + (Math.random() - 0.5) * jitter;

            // Start with grayscale - TV static (wide range from dark to bright white)
            const grayValue = 20 + Math.random() * 75; // 20-95% brightness

            particles.push({
                x,
                y,
                baseX: x,
                baseY: y,
                size: 1.5 + Math.random() * 2.5,
                baseHue: 0, // Grayscale at rest
                hueShift: 0,
                saturation: 0, // Grayscale
                brightness: grayValue,
                phaseOffset: Math.random() * Math.PI * 2,
                driftX: (Math.random() - 0.5) * 0.3,
                driftY: (Math.random() - 0.5) * 0.3,
            });
        });
    }

    function drawRectangle(
        x: number,
        y: number,
        size: number,
        hue: number,
        sat: number,
        bright: number,
    ) {
        if (!ctx) return;

        ctx.save();
        ctx.translate(x, y);

        // Rotate for variety
        const rotation = Math.sin(time * 0.02 + x * 0.1) * 0.3;
        ctx.rotate(rotation);

        ctx.fillStyle = `hsl(${hue}, ${sat}%, ${bright}%)`;

        // Draw rectangle with slight variation
        const width = size * 1.5;
        const height = size * 1.2;
        ctx.fillRect(-width / 2, -height / 2, width, height);

        ctx.restore();
    }

    const TARGET_DT = 1000 / 60; // 60fps target for physics
    let lastTime: number | null = null;
    let accumulator = 0;

    function loop(timestamp: number) {
        if (lastTime === null) {
            lastTime = timestamp;
        }

        let deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        // Cap deltaTime to avoid "spiral of death"
        if (deltaTime > 100) deltaTime = 100;

        accumulator += deltaTime;

        while (accumulator >= TARGET_DT) {
            stepPhysics();
            accumulator -= TARGET_DT;
        }

        draw();

        animationFrameId = requestAnimationFrame(loop);
    }

    function stepPhysics() {
        time++;

        // Calculate mouse velocity relative to physics step
        const dx = mouseX - lastMouseX;
        const dy = mouseY - lastMouseY;
        mouseVelocity = Math.sqrt(dx * dx + dy * dy);
        lastMouseX = mouseX;
        lastMouseY = mouseY;

        // Magnetic cursor interaction
        if (isHovered) {
            magnetSpring.set(1);
        } else {
            magnetSpring.set(0);
        }

        particles.forEach((p, i) => {
            // Subtle individual particle movement
            const individualWaveX = Math.sin(time * 0.05 + p.phaseOffset) * 1.5;
            const individualWaveY =
                Math.cos(time * 0.07 + p.phaseOffset * 1.3) * 1.5;

            // Magnetic attraction to cursor
            const distToMouse = Math.sqrt(
                (p.baseX - mouseX) ** 2 + (p.baseY - mouseY) ** 2,
            );
            const magnetRadius = 150;

            let magnetX = 0;
            let magnetY = 0;
            let orbitX = 0;
            let orbitY = 0;

            const isMagnetic = distToMouse < magnetRadius;

            if (isMagnetic) {
                const magneticStrength =
                    (1 - distToMouse / magnetRadius) * $magnetSpring;
                const magnetForce = magneticStrength * 30;
                const angle = Math.atan2(mouseY - p.baseY, mouseX - p.baseX);

                const stretchFactor = 1 + (1 - magneticStrength) * 2;
                magnetX = Math.cos(angle) * magnetForce * stretchFactor;
                magnetY = Math.sin(angle) * magnetForce * stretchFactor;

                const orbitIntensity = magneticStrength * 15;
                const orbitAngle = angle + Math.PI / 2;
                const orbitPhase = time * 0.05 + p.phaseOffset;
                orbitX =
                    Math.cos(orbitAngle) *
                    Math.sin(orbitPhase) *
                    orbitIntensity;
                orbitY =
                    Math.sin(orbitAngle) *
                    Math.sin(orbitPhase) *
                    orbitIntensity;

                // Audio Trigger based on magnetic intensity (keep random throttle)
                if (magneticStrength > 0 && Math.random() < 0.01) {
                    audio.playYVariant(
                        audioVariant,
                        magneticStrength,
                        particles.length,
                    );
                }
            }

            p.x = p.baseX + individualWaveX + p.driftX + magnetX + orbitX;
            p.y = p.baseY + individualWaveY + p.driftY + magnetY + orbitY;
        });
    }

    function draw() {
        if (!ctx) return;
        ctx.clearRect(0, 0, 200, 300);

        particles.forEach((p) => {
            let colorSaturation = 0;
            let colorHue = 0;
            let colorBrightness = p.brightness;

            const distToMouse = Math.sqrt(
                (p.baseX - mouseX) ** 2 + (p.baseY - mouseY) ** 2,
            );
            const magnetRadius = 150;
            const magneticStrength =
                distToMouse < magnetRadius
                    ? (1 - distToMouse / magnetRadius) * $magnetSpring
                    : 0;

            if (magneticStrength > 0) {
                const paletteColor =
                    confettiPalette[
                        Math.floor(
                            (p.phaseOffset / (Math.PI * 2)) *
                                confettiPalette.length,
                        )
                    ];
                colorHue = paletteColor.h;
                colorSaturation = paletteColor.s * magneticStrength;
                colorBrightness =
                    p.brightness +
                    (paletteColor.l - p.brightness) * magneticStrength;
            }

            ctx!.save();
            ctx!.translate(p.x, p.y);

            const rotation = Math.sin(time * 0.02 + p.x * 0.1) * 0.3;
            ctx!.rotate(rotation);

            ctx!.fillStyle = `hsl(${colorHue}, ${colorSaturation}%, ${colorBrightness}%)`;

            const orbitPhase = time * 0.05 + p.phaseOffset;
            const depthScale = 1 + 0.4 * Math.cos(orbitPhase);

            const width = p.size * 1.5 * depthScale;
            const height = p.size * 1.2 * depthScale;
            ctx!.fillRect(-width / 2, -height / 2, width, height);
            ctx!.restore();
        });
    }

    onMount(() => {
        ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;
        canvas.width = 200 * dpr;
        canvas.height = 300 * dpr;
        ctx?.scale(dpr, dpr);

        initParticles();
        dispatch("ready");
        animationFrameId = requestAnimationFrame(loop);
    });

    onDestroy(() => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
    });

    function handleMouseMove(e: MouseEvent) {
        const rect = container.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) * (200 / rect.width);
        mouseY = (e.clientY - rect.top) * (300 / rect.height);
        isHovered = true;
        audio.resume();
    }

    function handleMouseLeave() {
        isHovered = false;
        // Do not reset mouse position to prevent burst
    }

    function handleTouchMove(e: TouchEvent) {
        e.preventDefault();
        const rect = container.getBoundingClientRect();
        const touch = e.touches[0];
        mouseX = (touch.clientX - rect.left) * (200 / rect.width);
        mouseY = (touch.clientY - rect.top) * (300 / rect.height);
        isHovered = true;
    }
</script>

<div
    class="letter-container"
    bind:this={container}
    on:mousemove={handleMouseMove}
    on:mouseleave={handleMouseLeave}
    on:touchmove={handleTouchMove}
    on:touchstart={handleTouchMove}
    on:touchend={handleMouseLeave}
    role="presentation"
>
    <canvas bind:this={canvas} class="letter-canvas"></canvas>
</div>

<style>
    .letter-container {
        display: inline-block;
        padding: 2rem;
        cursor: pointer;
    }

    .letter-canvas {
        width: 200px;
        height: 300px;
    }

    @media (max-width: 768px) {
        .letter-canvas {
            width: 150px;
            height: 225px;
        }
        .letter-container {
            padding: 1rem;
        }
    }
</style>
