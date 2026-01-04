<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import LetterS from "$lib/components/LetterS.svelte";
    import LetterW from "$lib/components/LetterW.svelte";
    import LetterA from "$lib/components/LetterA.svelte";
    import LetterR from "$lib/components/LetterR.svelte";
    import LetterD from "$lib/components/LetterD.svelte";
    import LetterY from "$lib/components/LetterY.svelte";

    import SwardyLoadingLogo from "$lib/components/SwardyLoadingLogo.svelte";

    let showS = true;
    let showW = true;
    let showA = true;
    let showR = true;
    let showD = true;
    let showY = true;

    let innerWidth = 1000;
    $: scale = Math.min(1, (innerWidth - 40) / 1100);

    // FPS Counter
    let fps = 0;
    let lastTime = performance.now();
    let frames = 0;
    let animationFrameId: number;

    function updateFPS() {
        const now = performance.now();
        frames++;
        if (now > lastTime + 1000) {
            fps = Math.round((frames * 1000) / (now - lastTime));
            lastTime = now;
            frames = 0;
        }
        animationFrameId = requestAnimationFrame(updateFPS);
    }

    onMount(() => {
        updateFPS();
    });

    onDestroy(() => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
    });

    let readyCount = 0;
    let isAllReady = false;
    let isAnimationFinished = false;

    $: activeCount = [showS, showW, showA, showR, showD, showY].filter(
        Boolean,
    ).length;

    $: if (readyCount >= activeCount && activeCount > 0) {
        isAllReady = true;
    } else if (activeCount === 0) {
        isAllReady = false;
        readyCount = 0;
    }

    function handleReady() {
        readyCount++;
    }

    function handleAnimationComplete() {
        isAnimationFinished = true;
    }

    function toggleAll(val: boolean) {
        isAllReady = false;
        isAnimationFinished = false;
        readyCount = 0;
        showS = val;
        showW = val;
        showA = val;
        showR = val;
        showD = val;
        showY = val;
    }
</script>

<svelte:window bind:innerWidth />

<main>
    <div class="perf-hud">
        <div class="stats">
            <span class="fps">{fps} FPS</span>
        </div>
        <div class="controls">
            <div class="toggles">
                <label
                    ><input
                        type="checkbox"
                        bind:checked={showS}
                        on:change={() => {
                            isAllReady = false;
                            isAnimationFinished = false;
                            readyCount = 0;
                        }}
                    /> S</label
                >
                <label
                    ><input
                        type="checkbox"
                        bind:checked={showW}
                        on:change={() => {
                            isAllReady = false;
                            isAnimationFinished = false;
                            readyCount = 0;
                        }}
                    /> W</label
                >
                <label
                    ><input
                        type="checkbox"
                        bind:checked={showA}
                        on:change={() => {
                            isAllReady = false;
                            isAnimationFinished = false;
                            readyCount = 0;
                        }}
                    /> A</label
                >
                <label
                    ><input
                        type="checkbox"
                        bind:checked={showR}
                        on:change={() => {
                            isAllReady = false;
                            isAnimationFinished = false;
                            readyCount = 0;
                        }}
                    /> R</label
                >
                <label
                    ><input
                        type="checkbox"
                        bind:checked={showD}
                        on:change={() => {
                            isAllReady = false;
                            isAnimationFinished = false;
                            readyCount = 0;
                        }}
                    /> D</label
                >
                <label
                    ><input
                        type="checkbox"
                        bind:checked={showY}
                        on:change={() => {
                            isAllReady = false;
                            isAnimationFinished = false;
                            readyCount = 0;
                        }}
                    /> Y</label
                >
            </div>
            <div class="actions">
                <button on:click={() => toggleAll(true)}>Show All</button>
                <button on:click={() => toggleAll(false)}>Hide All</button>
            </div>
        </div>
    </div>

    <section class="letters-section">
        {#if activeCount > 0 && !isAnimationFinished}
            <div
                class="loading-container"
                class:fade-out={isAllReady && isAnimationFinished}
            >
                <SwardyLoadingLogo
                    progress={readyCount / activeCount}
                    isReady={isAllReady}
                    on:complete={handleAnimationComplete}
                />
            </div>
        {/if}

        <div
            class="letters-container"
            class:is-visible={isAnimationFinished}
            style="transform: scale({scale});"
        >
            {#if showS}
                <div
                    class="letter-wrapper"
                    style="transform: translate(-374px, 10px) scale(0.95); z-index: 1; --delay: 100ms;"
                >
                    <LetterS on:ready={handleReady} />
                </div>
            {/if}
            {#if showW}
                <div
                    class="letter-wrapper"
                    style="transform: translate(-214px, 0px) scale(1); z-index: 2; --delay: 300ms;"
                >
                    <LetterW on:ready={handleReady} />
                </div>
            {/if}
            {#if showA}
                <div
                    class="letter-wrapper"
                    style="transform: translate(-34px, 0px) scale(1); z-index: 3; --delay: 500ms;"
                >
                    <LetterA on:ready={handleReady} />
                </div>
            {/if}
            {#if showR}
                <div
                    class="letter-wrapper"
                    style="transform: translate(126px, 11px) scale(1); z-index: 4; --delay: 700ms;"
                >
                    <LetterR
                        on:ready={handleReady}
                        path="M 50 250 L 80 50 L 180 50 L 150 150 L 80 150 M 150 150 L 200 250"
                        numLayers={20}
                        layerSpread={60}
                        refractionSpeed={0.02}
                        damping={0.05}
                    />
                </div>
            {/if}
            {#if showD}
                <div
                    class="letter-wrapper"
                    style="transform: translate(267px, 0px) scale(0.9); z-index: 5; --delay: 900ms;"
                >
                    <LetterD
                        on:ready={handleReady}
                        path="M 120 240 C 80 240, 60 210, 60 180 C 60 150, 80 120, 120 120 C 140 120, 150 130, 150 130 L 150 40 C 150 20, 170 10, 180 30 L 170 240 C 170 250, 160 260, 140 250 Z"
                        holePath="M 120 210 C 140 210, 140 180, 140 160 C 140 140, 130 130, 120 130 C 100 130, 90 150, 90 180 C 90 200, 100 210, 120 210 Z"
                        eyePosition={{ x: 115, y: 170 }}
                        eyeScale={0.7}
                        scale={1}
                        squashFactor={0.2}
                        blurStrength={0.7}
                        colorShiftSpeed={0.5}
                        wobbleAmount={5}
                        thickness={4}
                        color="#8ba59e"
                        blurColor="#87ceeb"
                    />
                </div>
            {/if}
            {#if showY}
                <div
                    class="letter-wrapper"
                    style="transform: translate(438px, 50px) scale(1.1); z-index: 1; --delay: 1100ms;"
                >
                    <LetterY
                        on:ready={handleReady}
                        shapeMode="rounded"
                        color="#ffd700"
                        secondaryColor="#ffff00"
                    />
                </div>
            {/if}
        </div>
    </section>
</main>

<style>
    main {
        min-height: 100vh;
        background: #111;
        color: white;
        display: flex;
        flex-direction: column;
    }

    .perf-hud {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        padding: 1rem;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .stats {
        font-family: monospace;
        font-size: 1.2rem;
        color: #00ff00;
    }

    .controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .toggles {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .toggles label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        font-family: monospace;
    }

    .actions {
        display: flex;
        gap: 0.5rem;
    }

    .actions button {
        background: #333;
        color: white;
        border: 1px solid #555;
        padding: 0.5rem 1rem;
        cursor: pointer;
        font-family: monospace;
    }

    .actions button:hover {
        background: #444;
    }

    .letters-section {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        padding: 100px 20px;
    }

    .loading-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        z-index: 100;
        transition: opacity 0.2s ease-out;
    }

    .loading-container.fade-out {
        opacity: 0;
        pointer-events: none;
    }

    .letters-container {
        position: relative;
        width: 0;
        height: 0;
        visibility: hidden;
        pointer-events: none;
    }

    .letters-container.is-visible {
        visibility: visible;
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

    /* Entrance Animation: Neon Flicker */
    .letters-container.is-visible .letter-wrapper {
        animation: neon-flicker 2s steps(1) backwards;
        animation-delay: var(--delay);
    }

    @keyframes neon-flicker {
        0% {
            opacity: 0;
            filter: brightness(0);
        }
        5% {
            opacity: 1;
            filter: brightness(2) drop-shadow(0 0 10px white);
        }
        10% {
            opacity: 0;
        }
        15% {
            opacity: 0.5;
        }
        20% {
            opacity: 1;
            filter: brightness(2) drop-shadow(0 0 10px white);
        }
        25% {
            opacity: 0;
        }
        35% {
            opacity: 1;
            filter: brightness(1.5);
        }
        100% {
            opacity: 1;
            filter: brightness(1);
        }
    }

    /* Global overrides for letter components */
    :global(.letter-container) {
        padding: 0 !important;
        display: flex !important;
        justify-content: center;
    }

    :global(.letter-container canvas),
    :global(.letter-container svg),
    :global(.letter-container > div) {
        width: 200px !important;
        height: 300px !important;
    }
</style>
