<script lang="ts">
    import { onMount, onDestroy, createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import { browser } from "$app/environment";
    import { audio } from "$lib/audio";

    // Props
    export let path =
        "M 50 250 L 70 250 M 60 250 L 60 50 M 50 50 L 80 50 L 110 50 Q 160 50 160 100 Q 160 150 110 150 L 60 150 M 100 150 Q 120 150 140 200 Q 160 250 180 250";
    export let color = "#000000"; // Base color (used for core)

    // Rainbow Prism Props
    export let numLayers = 3; // Number of split layers
    export let layerSpread = 20; // Max pixel spread
    export let audioVariant = 5; // Crystal
    export let refractionSpeed = 0.1; // Spring stiffness
    export let damping = 0.3; // Spring damping (lower = more bounce)
    export let rainbowSpeed = 0; // Cycle colors over time (0 = static)

    let isHovered = false;
    let container: HTMLDivElement;
    let time = 0;
    let animationFrameId: number;

    // Physics state
    let pullX = 0;
    let pullY = 0;
    let pullVx = 0;
    let pullVy = 0;
    let targetPullX = 0;
    let targetPullY = 0;

    // Generate layers
    $: layers = Array.from({ length: numLayers }, (_, i) => {
        const norm = numLayers > 1 ? i / (numLayers - 1) - 0.5 : 0;
        return {
            id: i,
            norm,
            hueOffset: (i / numLayers) * 360,
        };
    });

    const TARGET_DT = 1000 / 60; // 60fps target for physics
    let lastTime: number | null = null;
    let accumulator = 0;

    function loop(timestamp: number) {
        if (lastTime === null) {
            lastTime = timestamp;
        }

        let deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        if (deltaTime > 100) deltaTime = 100;
        accumulator += deltaTime;

        while (accumulator >= TARGET_DT) {
            stepPhysics();
            accumulator -= TARGET_DT;
        }

        animationFrameId = requestAnimationFrame(loop);
    }

    function stepPhysics() {
        if (rainbowSpeed > 0) {
            time += rainbowSpeed;
        }

        // Custom Spring Physics
        const ax = (targetPullX - pullX) * refractionSpeed;
        const ay = (targetPullY - pullY) * refractionSpeed;

        pullVx += ax;
        pullVy += ay;

        pullVx *= 1 - damping;
        pullVy *= 1 - damping;

        pullX += pullVx;
        pullY += pullVy;
    }

    function handleMouseMove(e: MouseEvent) {
        if (!container) return;
        isHovered = true;

        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const nx = (e.clientX - centerX) / (rect.width / 2);
        const ny = (e.clientY - centerY) / (rect.height / 2);

        targetPullX = nx * layerSpread;
        targetPullY = ny * layerSpread;

        audio.resume();
        const dist = Math.sqrt(nx * nx + ny * ny);
        if (Math.random() > 0.8) {
            audio.playRVariant(audioVariant, 10, dist);
        }
    }

    function handleMouseLeave() {
        isHovered = false;
        targetPullX = 0;
        targetPullY = 0;
    }

    function handleTouchMove(e: TouchEvent) {
        if (!container) return;
        e.preventDefault();

        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const nx = (touch.clientX - centerX) / (rect.width / 2);
        const ny = (touch.clientY - centerY) / (rect.height / 2);

        targetPullX = nx * layerSpread;
        targetPullY = ny * layerSpread;
        isHovered = true;

        audio.resume();
        const dist = Math.sqrt(nx * nx + ny * ny);
        if (Math.random() > 0.8) {
            audio.playRVariant(audioVariant, 10, dist);
        }
    }

    onMount(() => {
        dispatch("ready");
        animationFrameId = requestAnimationFrame(loop);
    });

    onDestroy(() => {
        if (browser && animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    });
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
    <svg viewBox="-50 -50 300 400" class="letter-r">
        <!-- Rainbow Layers -->
        {#each layers as layer (layer.id)}
            <g
                style="
					transform: translate({pullX * layer.norm * 2}px, {pullY * layer.norm * 2}px); 
					mix-blend-mode: screen;
				"
            >
                <path
                    d={path}
                    fill="none"
                    stroke="hsl({layer.hueOffset + time * 100}, 100%, 50%)"
                    stroke-width="15"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    opacity="0.6"
                />
            </g>
        {/each}

        <!-- Core (White/Bright) to keep legibility -->
        <path
            d={path}
            fill="none"
            stroke="white"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
            opacity="0.8"
            style="mix-blend-mode: overlay;"
        />
    </svg>
</div>

<style>
    .letter-container {
        display: inline-block;
        padding: 2rem;
        cursor: pointer;
        touch-action: none;
    }

    .letter-r {
        width: 200px;
        height: 300px;
        overflow: visible;
    }

    @media (max-width: 768px) {
        .letter-r {
            width: 150px;
            height: 225px;
        }
        .letter-container {
            padding: 1rem;
        }
    }
</style>
