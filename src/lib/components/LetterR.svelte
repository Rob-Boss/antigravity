<script lang="ts">
    import { spring } from "svelte/motion";
    import { onMount, onDestroy } from "svelte";
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

    // Physics: Single spring for the "pull" vector
    const pull = spring(
        { x: 0, y: 0 },
        { stiffness: refractionSpeed, damping: damping },
    );

    // Generate layers
    // We'll compute their offsets derived from the main pull spring
    $: layers = Array.from({ length: numLayers }, (_, i) => {
        // Normalized position from -0.5 to 0.5
        const norm = numLayers > 1 ? i / (numLayers - 1) - 0.5 : 0;
        return {
            id: i,
            norm,
            // HSL Color: Spread across 360 degrees
            // We can offset the hue based on time if rainbowSpeed > 0
            hueOffset: (i / numLayers) * 360,
        };
    });

    function loop() {
        if (rainbowSpeed > 0) {
            time += rainbowSpeed;
            if (browser) {
                animationFrameId = requestAnimationFrame(loop);
            }
        }
    }

    // Only start loop in browser
    $: if (browser && rainbowSpeed > 0 && !animationFrameId) {
        loop();
    }

    onDestroy(() => {
        if (browser && animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    });

    // Update spring stiffness when prop changes
    $: {
        pull.stiffness = refractionSpeed;
        pull.damping = damping;
    }

    function handleMouseMove(e: MouseEvent) {
        isHovered = true;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Vector from center to mouse
        // Normalized roughly to -1 to 1 range within the container
        const nx = (e.clientX - centerX) / (rect.width / 2);
        const ny = (e.clientY - centerY) / (rect.height / 2);

        pull.set({ x: nx * layerSpread, y: ny * layerSpread });

        audio.resume();
        // Play a glassy tone based on distance
        const dist = Math.sqrt(nx * nx + ny * ny);
        if (Math.random() > 0.8) {
            // Don't play every frame
            audio.playRVariant(audioVariant, 10, dist);
        }
    }

    function handleMouseLeave() {
        isHovered = false;
        pull.set({ x: 0, y: 0 });
    }
</script>

<div
    class="letter-container"
    bind:this={container}
    on:mousemove={handleMouseMove}
    on:mouseleave={handleMouseLeave}
    role="presentation"
>
    <svg viewBox="-50 -50 300 400" class="letter-r">
        <!-- Rainbow Layers -->
        {#each layers as layer (layer.id)}
            <g
                style="
					transform: translate({$pull.x * layer.norm * 2}px, {$pull.y *
                    layer.norm *
                    2}px); 
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
