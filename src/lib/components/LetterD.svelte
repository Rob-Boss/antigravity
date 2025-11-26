<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { audio } from "$lib/audio";

    let container: HTMLDivElement;
    let rotation = 0;
    let velocity = 0;
    let lastMouseX = 0;
    let isHovered = false;
    let animationFrameId: number;
    let time = 0;
    let drone: {
        setFreq: (f: number) => void;
        setVol: (v: number) => void;
        stop: () => void;
    } | null = null;

    // Props for Variations
    export let path =
        "M 110 250 C 50 250, 20 200, 20 150 C 20 100, 50 50, 110 50 C 140 50, 160 70, 170 90 L 170 20 C 170 10, 180 10, 180 20 L 180 240 C 180 250, 170 260, 160 250 L 160 250 C 160 250, 140 250, 110 250 Z"; // Default bubbly d
    export let holePath =
        "M 110 200 C 140 200, 150 180, 150 150 C 150 120, 140 100, 110 100 C 80 100, 70 120, 70 150 C 70 180, 80 200, 110 200 Z"; // Default hole
    export let eyePosition = { x: 140, y: 110 };
    export let eyeScale = 0.8;
    export let scale = 1;
    export let audioVariant = 0; // 0 to 9

    export let squashFactor = 0; // 0 to 0.5 (flatten at speed)
    export let blurStrength = 0; // 0 to 1 (opacity of trails)
    export let colorShiftSpeed = 0; // 0 to 1 (hue rotation speed)
    export let wobbleAmount = 0; // 0 to 20 (degrees of Z-wobble when slow)
    export let thickness = 0; // 0 to 10 (simulated 3D layers)
    export let blurColor = "#8be9fd"; // Default Cyan
    export let color = "#8ba59e"; // Default Sage Green

    // Physics constants
    const FRICTION = 0.98;
    const SENSITIVITY = 0.15;
    const MAX_VELOCITY = 40;
    // Removed SNAP_STRENGTH to restore free spin

    function update() {
        time += 0.1;

        // Gravity: Pull towards 0 degrees (upright)
        // Convert rotation to radians for sin calculation
        // We want 0 to be stable, 180 to be unstable
        // sin(0) = 0, sin(180) = 0
        // We need a force that pushes back towards 0
        // If rot is 10, force should be negative. sin(10) is positive. So -sin(rot).
        const gravity = -Math.sin((rotation * Math.PI) / 180) * 0.4;

        // Only apply gravity if not being interacted with (optional, but feels better)
        if (!isHovered) {
            velocity += gravity;
        }

        // Apply velocity
        rotation += velocity;

        // Apply friction
        let currentFriction = FRICTION;

        // Anti-Bounce / Soft Landing
        // Check how close we are to upright (0, 360, -360, etc)
        // Normalize rotation to -180 to 180 range for easier checking
        let normalizedRot = rotation % 360;
        if (normalizedRot > 180) normalizedRot -= 360;
        if (normalizedRot < -180) normalizedRot += 360;

        // If we are close to upright and moving slowly, apply heavy friction
        if (Math.abs(normalizedRot) < 30 && Math.abs(velocity) < 3) {
            currentFriction = 0.92; // Heavy friction
        }

        velocity *= currentFriction;

        // Stop if very slow and practically upright
        if (Math.abs(velocity) < 0.01 && Math.abs(normalizedRot) < 1) {
            velocity = 0;
            // Optional: Snap to exactly 0 if desired, but natural stop is requested
            // rotation = Math.round(rotation / 360) * 360;
        }

        animationFrameId = requestAnimationFrame(update);

        // Update drone
        if (drone) {
            const speed = Math.abs(velocity);
            drone.setFreq(100 + speed * 20);
            drone.setVol(Math.min(speed / 10, 0.5));
        } else if (Math.abs(velocity) > 0.1 && !drone) {
            // Start drone if moving
            drone = audio.createDDrone(audioVariant, 100);
        } else if (Math.abs(velocity) < 0.1 && drone) {
            // Stop drone if stopped
            drone.stop();
            drone = null;
        }
    }

    onMount(() => {
        drone = audio.createDrone(100, "triangle");
        update();
    });

    onDestroy(() => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (drone) drone.stop();
    });

    function handleMouseMove(e: MouseEvent) {
        if (!isHovered) {
            lastMouseX = e.clientX;
            isHovered = true;
            audio.resume();
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

    // Squash (Thinner and Taller when fast)
    $: currentScaleX = 1 - velRatio * squashFactor;
    $: currentScaleY = 1 + velRatio * squashFactor * 0.6;

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
    <!-- Smear Trails (Separate Layers for 3D Rotation) -->
    {#if blurStrength > 0 && absVel > 2}
        <!-- Trail 1 (Cyan) -->
        <div
            class="letter-d-wrapper trail"
            style="
                transform: rotateY({rotation -
                velocity * 1.5}deg) scale({currentScaleX}, {currentScaleY});
                opacity: {blurStrength * 0.9};
            "
        >
            <svg viewBox="0 0 200 300" class="letter-d">
                <path
                    d={combinedPath}
                    fill="none"
                    stroke="#00ffff"
                    stroke-width="4"
                    fill-rule="evenodd"
                    style="mix-blend-mode: screen; filter: blur(2px);"
                />
            </svg>
        </div>
        <!-- Trail 2 (Hot Pink) -->
        <div
            class="letter-d-wrapper trail"
            style="
                transform: rotateY({rotation -
                velocity * 3.0}deg) scale({currentScaleX}, {currentScaleY});
                opacity: {blurStrength * 0.85};
            "
        >
            <svg viewBox="0 0 200 300" class="letter-d">
                <path
                    d={combinedPath}
                    fill="none"
                    stroke="#ff69b4"
                    stroke-width="4"
                    fill-rule="evenodd"
                    style="mix-blend-mode: screen; filter: blur(2px);"
                />
            </svg>
        </div>
        <!-- Trail 3 (Yellow) -->
        <div
            class="letter-d-wrapper trail"
            style="
                transform: rotateY({rotation -
                velocity * 4.5}deg) scale({currentScaleX}, {currentScaleY});
                opacity: {blurStrength * 0.8};
            "
        >
            <svg viewBox="0 0 200 300" class="letter-d">
                <path
                    d={combinedPath}
                    fill="none"
                    stroke="#ffff00"
                    stroke-width="4"
                    fill-rule="evenodd"
                    style="mix-blend-mode: screen; filter: blur(2px);"
                />
            </svg>
        </div>
        <!-- Trail 4 (Green) -->
        <div
            class="letter-d-wrapper trail"
            style="
                transform: rotateY({rotation -
                velocity * 6.0}deg) scale({currentScaleX}, {currentScaleY});
                opacity: {blurStrength * 0.75};
            "
        >
            <svg viewBox="0 0 200 300" class="letter-d">
                <path
                    d={combinedPath}
                    fill="none"
                    stroke="#32cd32"
                    stroke-width="4"
                    fill-rule="evenodd"
                    style="mix-blend-mode: screen; filter: blur(2px);"
                />
            </svg>
        </div>
        <!-- Trail 5 (Purple) -->
        <div
            class="letter-d-wrapper trail"
            style="
                transform: rotateY({rotation -
                velocity * 7.5}deg) scale({currentScaleX}, {currentScaleY});
                opacity: {blurStrength * 0.7};
            "
        >
            <svg viewBox="0 0 200 300" class="letter-d">
                <path
                    d={combinedPath}
                    fill="none"
                    stroke="#9370db"
                    stroke-width="4"
                    fill-rule="evenodd"
                    style="mix-blend-mode: screen; filter: blur(2px);"
                />
            </svg>
        </div>
        <!-- Trail 6 (Orange) -->
        <div
            class="letter-d-wrapper trail"
            style="
                transform: rotateY({rotation -
                velocity * 9.0}deg) scale({currentScaleX}, {currentScaleY});
                opacity: {blurStrength * 0.65};
            "
        >
            <svg viewBox="0 0 200 300" class="letter-d">
                <path
                    d={combinedPath}
                    fill="none"
                    stroke="#ffa500"
                    stroke-width="4"
                    fill-rule="evenodd"
                    style="mix-blend-mode: screen; filter: blur(2px);"
                />
            </svg>
        </div>
        <!-- Trail 7 (Electric Blue) -->
        <div
            class="letter-d-wrapper trail"
            style="
                transform: rotateY({rotation -
                velocity * 10.5}deg) scale({currentScaleX}, {currentScaleY});
                opacity: {blurStrength * 0.6};
            "
        >
            <svg viewBox="0 0 200 300" class="letter-d">
                <path
                    d={combinedPath}
                    fill="none"
                    stroke="#1e90ff"
                    stroke-width="4"
                    fill-rule="evenodd"
                    style="mix-blend-mode: screen; filter: blur(2px);"
                />
            </svg>
        </div>
    {/if}

    <!-- Main Letter -->
    <div
        class="letter-d-wrapper main"
        style="
            transform:
                rotateY({rotation}deg)
                rotateZ({currentWobble}deg)
                scale({currentScaleX}, {currentScaleY});
            filter: {hueRotate};
            z-index: 10;
        "
    >
        <svg viewBox="0 0 200 300" class="letter-d">
            <!-- Body with Transparent Hole -->
            <path
                d={combinedPath}
                fill="none"
                stroke={color}
                stroke-width="4"
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
        position: relative; /* Context for absolute layers */
        width: 200px; /* Fixed size for layout */
        height: 300px;
    }

    .letter-container:active {
        cursor: grabbing;
    }

    .letter-d-wrapper {
        position: absolute; /* Stack on top of each other */
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
        transform-origin: 100px 150px;
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
