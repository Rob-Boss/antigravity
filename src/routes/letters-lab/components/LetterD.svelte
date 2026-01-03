<script lang="ts">
    import { onMount, onDestroy, createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import { audio } from "$lib/audio";

    let container: HTMLDivElement;
    let rotation = 0;
    let velocity = 0;
    let lastMouseX = 0;
    let isHovered = false;
    let animationFrameId: number;
    let time = 0;
    let drone: any = null;
    let lastTime = 0;

    export let path =
        "M 110 250 C 50 250, 20 200, 20 150 C 20 100, 50 50, 110 50 C 140 50, 160 70, 170 90 L 170 20 C 170 10, 180 10, 180 20 L 180 240 C 180 250, 170 260, 160 250 L 160 250 C 160 250, 140 250, 110 250 Z";
    export let holePath =
        "M 110 200 C 140 200, 150 180, 150 150 C 150 120, 140 100, 110 100 C 80 100, 70 120, 70 150 C 70 180, 80 200, 110 200 Z";
    export let eyePosition = { x: 140, y: 110 };
    export let eyeScale = 0.8;
    export let scale = 1;
    export let audioVariant = 0;
    export let squashFactor = 0;
    export let blurStrength = 0;
    export let colorShiftSpeed = 0;
    export let wobbleAmount = 0;
    export let thickness = 0;
    export let blurColor = "#8be9fd";
    export let color = "#8ba59e";

    const FRICTION = 0.98;
    const MAX_VELOCITY = 40;

    function update(currentTime: number) {
        if (lastTime === 0) lastTime = currentTime;
        const deltaTime = Math.min(currentTime - lastTime, 50);
        const dt = deltaTime / 16.667;
        lastTime = currentTime;

        time += 0.1 * dt;
        const gravity = -Math.sin((rotation * Math.PI) / 180) * 0.4 * dt;
        if (!isHovered) velocity += gravity;

        rotation += velocity * dt;
        let currentFriction = Math.pow(FRICTION, dt);
        let normalizedRot = rotation % 360;
        if (normalizedRot > 180) normalizedRot -= 360;
        if (normalizedRot < -180) normalizedRot += 360;

        if (Math.abs(normalizedRot) < 30 && Math.abs(velocity) < 3) {
            currentFriction = Math.pow(0.92, dt);
        }
        velocity *= currentFriction;
        if (Math.abs(velocity) < 0.01 && Math.abs(normalizedRot) < 1)
            velocity = 0;

        animationFrameId = requestAnimationFrame(update);
        if (drone) {
            const speed = Math.abs(velocity);
            drone.setFreq(100 + speed * 20);
            drone.setVol(Math.min(speed / 10, 0.5));
        } else if (Math.abs(velocity) > 0.1 && !drone) {
            drone = audio.createDDrone(audioVariant, 100);
        } else if (Math.abs(velocity) < 0.1 && drone) {
            drone.stop();
            drone = null;
        }
    }

    onMount(() => {
        dispatch("ready");
        update(performance.now());
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
        lastMouseX = e.clientX;
        velocity += deltaX * 0.04;
        velocity = Math.max(Math.min(velocity, MAX_VELOCITY), -MAX_VELOCITY);
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
        lastMouseX = touch.clientX;
        velocity += deltaX * 0.04;
        velocity = Math.max(Math.min(velocity, MAX_VELOCITY), -MAX_VELOCITY);
    }

    $: absVel = Math.abs(velocity);
    $: velRatio = Math.min(absVel / MAX_VELOCITY, 1);
    $: currentScaleX = 1 - velRatio * squashFactor;
    $: currentScaleY = 1 + velRatio * squashFactor * 0.6;
    $: currentWobble =
        absVel > 0.1 && absVel < 5
            ? Math.sin(time * 2) * wobbleAmount * (1 - absVel / 5)
            : 0;
    $: hueRotate =
        colorShiftSpeed > 0
            ? `hue-rotate(${absVel * colorShiftSpeed * 10}deg)`
            : "";
    let eyesClosed = false;
    $: {
        if (absVel > 10) eyesClosed = true;
        else if (absVel < 0.5) eyesClosed = false;
    }
    $: combinedPath = holePath ? `${path} ${holePath}` : path;
</script>

<div
    class="letter-container"
    bind:this={container}
    on:mousemove={handleMouseMove}
    on:mouseenter={(e) => {
        isHovered = true;
        lastMouseX = e.clientX;
    }}
    on:mouseleave={() => {
        isHovered = false;
    }}
    on:touchmove={handleTouchMove}
    on:touchstart={(e) => {
        isHovered = true;
        lastMouseX = e.touches[0].clientX;
    }}
    on:touchend={() => {
        isHovered = false;
    }}
    role="presentation"
    style="perspective: 1000px;"
>
    {#if blurStrength > 0 && absVel > 2}
        {#each [1.5, 3.0, 4.5, 6.0, 7.5, 9.0, 10.5] as offset, i}
            <div
                class="letter-d-wrapper trail"
                style="transform: rotateY({rotation -
                    velocity *
                        offset}deg) scale({currentScaleX}, {currentScaleY}); opacity: {blurStrength *
                    (0.9 - i * 0.05)};"
            >
                <svg viewBox="0 0 200 300" class="letter-d">
                    <path
                        d={combinedPath}
                        fill="none"
                        stroke={[
                            "#00ffff",
                            "#ff69b4",
                            "#ffff00",
                            "#32cd32",
                            "#9370db",
                            "#ffa500",
                            "#1e90ff",
                        ][i]}
                        stroke-width="4"
                        fill-rule="evenodd"
                        style="mix-blend-mode: screen; filter: blur(2px);"
                    />
                </svg>
            </div>
        {/each}
    {/if}

    <div
        class="letter-d-wrapper main"
        style="transform: rotateY({rotation}deg) rotateZ({currentWobble}deg) scale({currentScaleX}, {currentScaleY}); filter: {hueRotate}; z-index: 10;"
    >
        <svg viewBox="0 0 200 300" class="letter-d">
            <path
                d={combinedPath}
                fill="none"
                stroke={color}
                stroke-width="4"
                fill-rule="evenodd"
                class="d-body"
            />
            <g
                transform="translate({eyePosition.x}, {eyePosition.y}) scale({eyeScale})"
            >
                {#if eyesClosed}
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
        position: relative;
        width: 200px;
        height: 300px;
    }
    .letter-container:active {
        cursor: grabbing;
    }
    .letter-d-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
        transform-origin: 100px 150px;
        will-change: transform;
    }
    .letter-d {
        width: 100%;
        height: 100%;
        overflow: visible;
        backface-visibility: visible;
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
