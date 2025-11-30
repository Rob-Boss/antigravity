<script lang="ts">
    import LetterS from "$lib/components/LetterS.svelte";
    import LetterW from "$lib/components/LetterW.svelte";
    import LetterA from "$lib/components/LetterA.svelte";
    import LetterR from "$lib/components/LetterR.svelte";
    import LetterD from "$lib/components/LetterD.svelte";
    import LetterY from "$lib/components/LetterY.svelte";
    import { onMount } from "svelte";

    let innerWidth = 1000;
    $: scaleVal = Math.min(1, (innerWidth - 40) / 1100);

    let currentBg = "custom";
    let mouseX = 0;
    let mouseY = 0;

    const backgrounds = [
        { id: "custom", name: "Custom Match" },
        { id: "espresso", name: "Espresso Noir" },
        { id: "walnut", name: "Dark Walnut" },
        { id: "mahogany", name: "Rich Mahogany" },
        { id: "leather", name: "Vintage Leather" },
        { id: "umber", name: "Raw Umber" },
        { id: "copper", name: "Copper Patina" },
        { id: "kraft", name: "Cardboard Kraft" },
        { id: "taupe", name: "Taupe Grey" },
        { id: "sandstone", name: "Sandstone" },
        { id: "cream", name: "Cream Coffee" },
    ];

    function handleMouseMove(e: MouseEvent) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
</script>

<svelte:window bind:innerWidth on:mousemove={handleMouseMove} />

<main class={currentBg} style="--mx: {mouseX}px; --my: {mouseY}px;">
    <div class="controls">
        <h2>Background Lab</h2>
        <div class="buttons">
            {#each backgrounds as bg}
                <button
                    class:active={currentBg === bg.id}
                    on:click={() => (currentBg = bg.id)}
                >
                    {bg.name}
                </button>
            {/each}
        </div>
    </div>

    <section class="stage">
        <div class="letters-container" style="transform: scale({scaleVal});">
            <!-- Letters (Static for context) -->
            <div class="letter-wrapper s"><LetterS /></div>
            <div class="letter-wrapper w"><LetterW /></div>
            <div class="letter-wrapper a"><LetterA /></div>
            <div class="letter-wrapper r">
                <LetterR
                    path="M 50 250 L 80 50 L 180 50 L 150 150 L 80 150 M 150 150 L 200 250"
                    numLayers={20}
                    layerSpread={60}
                    refractionSpeed={0.02}
                    damping={0.05}
                />
            </div>
            <div class="letter-wrapper d">
                <LetterD
                    path="M 120 240 C 80 240, 60 210, 60 180 C 60 150, 80 120, 120 120 C 140 120, 150 130, 150 130 L 150 40 C 150 20, 170 10, 180 30 L 170 240 C 170 250, 160 260, 140 250 Z"
                    holePath="M 120 210 C 140 210, 140 180, 140 160 C 140 140, 130 130, 120 130 C 100 130, 90 150, 90 180 C 90 200, 100 210, 120 210 Z"
                    eyePosition={{ x: 115, y: 170 }}
                    eyeScale={0.7}
                    squashFactor={0.2}
                    blurStrength={0.7}
                    blurColor="#87ceeb"
                />
            </div>
            <div class="letter-wrapper y">
                <LetterY
                    shapeMode="rounded"
                    color="#ffd700"
                    secondaryColor="#ffff00"
                />
            </div>
        </div>
    </section>

    <!-- Background Elements -->
    <!-- (No extra elements needed for solid colors, but keeping the block for structure if we add textures later) -->
</main>

<style>
    main {
        min-height: 100vh;
        background: #111;
        color: white;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;
        transition: background 0.5s;
    }

    .bg-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
    }

    .controls {
        padding: 20px;
        background: rgba(34, 34, 34, 0.8);
        backdrop-filter: blur(10px);
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 100;
        position: relative;
    }

    .buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    button {
        padding: 8px 16px;
        background: #333;
        border: none;
        color: #aaa;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.2s;
    }

    button:hover {
        background: #444;
        color: white;
    }

    button.active {
        background: #646cff;
        color: white;
    }

    .stage {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10; /* Above background */
        pointer-events: none; /* Let clicks pass through to background if needed */
    }

    .letters-container {
        position: relative;
        width: 0;
        height: 0;
        pointer-events: auto;
    }

    .letter-wrapper {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: -122px;
        margin-top: -150px;
    }

    /* Positioning */
    .s {
        transform: translate(-394px, 0px);
    }
    .w {
        transform: translate(-214px, 0px);
    }
    .a {
        transform: translate(-34px, 0px);
    }
    .r {
        transform: translate(126px, 11px);
    }
    .d {
        transform: translate(267px, 0px) scale(0.9);
    }
    .y {
        transform: translate(438px, 50px) scale(1.1);
    }

    /* --- Background Styles --- */

    /* 0. Custom Match */
    main.custom {
        background: #7d352b;
        color: #e6d7c3;
    }

    /* 1. Espresso Noir */
    main.espresso {
        background: #2b1d16;
        color: #e6d7c3;
    }

    /* 2. Dark Walnut */
    main.walnut {
        background: #3d2b1f;
        color: #e6d7c3;
    }

    /* 3. Rich Mahogany */
    main.mahogany {
        background: #4a0404;
        color: #e6d7c3;
    }

    /* 4. Vintage Leather */
    main.leather {
        background: #6b4423;
        color: #e6d7c3;
    }

    /* 5. Raw Umber */
    main.umber {
        background: #826644;
        color: #111;
    }

    /* 6. Copper Patina */
    main.copper {
        background: #b87333;
        color: #111;
    }

    /* 7. Cardboard Kraft */
    main.kraft {
        background: #a58855;
        color: #111;
    }

    /* 8. Taupe Grey */
    main.taupe {
        background: #8b8589;
        color: #111;
    }

    /* 9. Sandstone */
    main.sandstone {
        background: #d6c6b9;
        color: #111;
    }

    /* 10. Cream Coffee */
    main.cream {
        background: #e6d7c3;
        color: #111;
    }

    /* Update button styles for better visibility on browns */
    main button {
        background: rgba(0, 0, 0, 0.2);
        color: inherit;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    main button:hover {
        background: rgba(0, 0, 0, 0.4);
    }
    main button.active {
        background: rgba(255, 255, 255, 0.9);
        color: #333;
    }
</style>
