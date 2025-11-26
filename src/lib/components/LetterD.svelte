<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    let container: HTMLDivElement;
    let rotation = 0;
    let velocity = 0;
    let lastMouseX = 0;
    let isHovered = false;
    let animationFrameId: number;
    let time = 0;

    // Props for Variations
    export let path =
        "M 110 250 C 50 250, 20 200, 20 150 C 20 100, 50 50, 110 50 C 140 50, 160 70, 170 90 L 170 20 C 170 10, 180 10, 180 20 L 180 240 C 180 250, 170 260, 160 250 L 160 250 C 160 250, 140 250, 110 250 Z"; // Default bubbly d
    export let holePath =
        "M 110 200 C 140 200, 150 180, 150 150 C 150 120, 140 100, 110 100 C 80 100, 70 120, 70 150 C 70 180, 80 200, 110 200 Z"; // Default hole
    export let eyePosition = { x: 140, y: 110 };
    export let eyeScale = 0.8;

    export let squashFactor = 0; // 0 to 0.5 (flatten at speed)
    export let blurStrength = 0; // 0 to 1 (opacity of trails)
    export let colorShiftSpeed = 0; // 0 to 1 (hue rotation speed)
    export let wobbleAmount = 0; // 0 to 20 (degrees of Z-wobble when slow)
    export let thickness = 0; // 0 to 10 (simulated 3D layers)
    export let blurColor = "#8be9fd"; // Default Cyan
    export let color = "#5C7CFA"; // Default Blue

    // Physics constants
    const FRICTION = 0.98;
    const SENSITIVITY = 0.15;
    const MAX_VELOCITY = 40;
    // Removed SNAP_STRENGTH to restore free spin

    function update() {
        time += 0.1;

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

    // Derived values for effects
    $: absVel = Math.abs(velocity);
    $: velRatio = Math.min(absVel / MAX_VELOCITY, 1);

    // Squash
    $: currentScaleX = 1 + velRatio * squashFactor;
    $: currentScaleY = 1 - velRatio * squashFactor * 0.6;

    // Wobble
    $: currentWobble =
        absVel > 0.1 && absVel < 5
            ? Math.sin(time * 2) * wobbleAmount * (1 - absVel / 5)
            : 0;

    // Color Shift
    $: hueRotate =
        colorShiftSpeed > 0
            ? `hue-rotate(${absVel * colorShiftSpeed * 10}deg)`
            : "";

    // Face Logic with Hysteresis
    // Eyes stay closed longer (lower threshold to open than to close)
    let eyesClosed = false;
    $: {
        if (absVel > 10)
            eyesClosed = true; // Close when moderately fast
        else if (absVel < 0.5) eyesClosed = false; // Open only when almost stopped
    }

    // Combine path and holePath for evenodd fill rule (transparent hole)
    $: combinedPath = holePath ? `${path} ${holePath}` : path;
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
    <div
        class="letter-d-wrapper"
        style="
            transform:
                rotateY({rotation}deg)
                rotateZ({currentWobble}deg)
                scale({currentScaleX}, {currentScaleY});
            filter: {hueRotate};
        "
    >
        <svg viewBox="0 0 200 300" class="letter-d">
            <!-- Motion Blur Trails (Multi-layer) -->
            {#if blurStrength > 0 && absVel > 2}
                <!-- Trail 1 -->
                <path
                    d={combinedPath}
                    fill={blurColor}
                    fill-rule="evenodd"
                    opacity={blurStrength * 0.4}
                    transform="rotate({-velocity * 0.2}, 100, 150)"
                />
                <!-- Trail 2 -->
                <path
                    d={combinedPath}
                    fill={blurColor}
                    fill-rule="evenodd"
                    opacity={blurStrength * 0.3}
                    transform="rotate({-velocity * 0.4}, 100, 150)"
                />
                <!-- Trail 3 -->
                <path
                    d={combinedPath}
                    fill={blurColor}
                    fill-rule="evenodd"
                    opacity={blurStrength * 0.2}
                    transform="rotate({-velocity * 0.6}, 100, 150)"
                />
            {/if}

            <!-- Body with Transparent Hole -->
            <path
                d={combinedPath}
                fill={color}
                stroke="none"
                fill-rule="evenodd"
                class="d-body"
            />

            <!-- Face Group -->
            <g
                transform="translate({eyePosition.x}, {eyePosition.y}) scale({eyeScale})"
            >
                <!-- Eyes -->
                {#if eyesClosed}
                    <!-- Closed Eyes (Single Bold X) -->
                    <path
                        d="M -15 -15 L 15 15 M 15 -15 L -15 15"
                        stroke="black"
                        stroke-width="5"
                        fill="none"
                        stroke-linecap="round"
                        transform="translate(-25, 0)"
                    />
                    <path
                        d="M -15 -15 L 15 15 M 15 -15 L -15 15"
                        stroke="black"
                        stroke-width="5"
                        fill="none"
                        stroke-linecap="round"
                        transform="translate(25, 0)"
                    />
                {:else}
                    <!-- Open Eyes -->
                    <g transform="translate(-25, 0)">
                        <ellipse
                            cx="0"
                            cy="0"
                            rx="15"
                            ry="18"
                            fill="white"
                            stroke="black"
                            stroke-width="2"
                        />
                        <circle cx="5" cy="0" r="6" fill="black" />
                        <circle cx="8" cy="-3" r="2" fill="white" />
                    </g>
                    <g transform="translate(25, 0)">
                        <ellipse
                            cx="0"
                            cy="0"
                            rx="15"
                            ry="18"
                            fill="white"
                            stroke="black"
                            stroke-width="2"
                        />
                        <circle cx="-5" cy="0" r="6" fill="black" />
                        <circle cx="-2" cy="-3" r="2" fill="white" />
                    </g>
                {/if}
            </g>
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
