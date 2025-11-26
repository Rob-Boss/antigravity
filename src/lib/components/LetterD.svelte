<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    let container: HTMLDivElement;
    let rotation = 0;
    let velocity = 0;
    let lastMouseX = 0;
    let isHovered = false;
    let animationFrameId: number;

    // Physics constants
    const FRICTION = 0.98;
    const SENSITIVITY = 0.15;
    const MAX_VELOCITY = 25;

    function update() {
        // Apply velocity
        rotation += velocity;

        // Apply friction
        velocity *= FRICTION;

        // Stop if very slow
        if (Math.abs(velocity) < 0.01) {
            velocity = 0;
        }

        animationFrameId = requestAnimationFrame(update);
    }

    onMount(() => {
        update();
    });

    onDestroy(() => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
    });

    function handleMouseMove(e: MouseEvent) {
        if (!isHovered) {
            lastMouseX = e.clientX;
            isHovered = true;
            return;
        }

        const deltaX = e.clientX - lastMouseX;

        // Add to velocity based on movement speed
        // We add to existing velocity to allow "spinning up"
        velocity += deltaX * SENSITIVITY;

        // Clamp velocity
        velocity = Math.max(Math.min(velocity, MAX_VELOCITY), -MAX_VELOCITY);

        lastMouseX = e.clientX;
    }

    function handleMouseEnter(e: MouseEvent) {
        isHovered = true;
        lastMouseX = e.clientX;
    }

    function handleMouseLeave() {
        isHovered = false;
    }

    function handleTouchMove(e: TouchEvent) {
        e.preventDefault();
        const touch = e.touches[0];

        if (!isHovered) {
            lastMouseX = touch.clientX;
            isHovered = true;
            return;
        }

        const deltaX = touch.clientX - lastMouseX;
        velocity += deltaX * SENSITIVITY;
        velocity = Math.max(Math.min(velocity, MAX_VELOCITY), -MAX_VELOCITY);

        lastMouseX = touch.clientX;
    }
</script>

<div
    class="letter-container"
    bind:this={container}
    on:mousemove={handleMouseMove}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    on:touchmove={handleTouchMove}
    on:touchstart={(e) => {
        isHovered = true;
        lastMouseX = e.touches[0].clientX;
    }}
    on:touchend={handleMouseLeave}
    role="presentation"
    style="perspective: 1000px;"
>
    <div class="letter-d-wrapper" style="transform: rotateY({rotation}deg);">
        <svg viewBox="0 0 200 300" class="letter-d">
            <!-- Front Face -->
            <path
                d="M 60 50 L 60 250 C 160 250, 160 50, 60 50"
                fill="none"
                stroke="var(--text-primary)"
                stroke-width="12"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="d-shape"
            />
            <!-- Inner highlight -->
            <path
                d="M 60 50 L 60 250 C 160 250, 160 50, 60 50"
                fill="none"
                stroke="var(--accent-glow)"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
                opacity="0.5"
                transform="scale(0.85) translate(15, 22)"
            />
        </svg>
    </div>
</div>

<style>
    .letter-container {
        display: inline-block;
        padding: 2rem;
        cursor: grab;
        touch-action: none;
    }

    .letter-container:active {
        cursor: grabbing;
    }

    .letter-d-wrapper {
        width: 200px;
        height: 300px;
        transform-style: preserve-3d;
        /* Will-change optimization for smooth rotation */
        will-change: transform;
    }

    .letter-d {
        width: 100%;
        height: 100%;
        overflow: visible;
        /* Double-sided visibility */
        backface-visibility: visible;
    }

    .d-shape {
        transition: stroke 0.3s ease;
    }

    .letter-container:hover .d-shape {
        stroke: var(--accent-glow);
    }

    @media (max-width: 768px) {
        .letter-d-wrapper {
            width: 150px;
            height: 225px;
        }

        .letter-container {
            padding: 1rem;
        }
    }
</style>
