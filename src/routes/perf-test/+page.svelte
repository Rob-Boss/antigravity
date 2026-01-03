<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import LetterS from "$lib/components/LetterS.svelte";
    import LetterW from "$lib/components/LetterW.svelte";
    import LetterA from "$lib/components/LetterA.svelte";
    import LetterR from "$lib/components/LetterR.svelte";
    import LetterD from "$lib/components/LetterD.svelte";
    import LetterY from "$lib/components/LetterY.svelte";

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

    function toggleAll(val: boolean) {
        isAllReady = false;
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
        {#if activeCount > 0 && !isAllReady}
            <div class="loading-container">
                <div class="loading-text">BOOTING...</div>
                <div class="loading-bar-outer">
                    <div
                        class="loading-bar-inner"
                        style="width: {(readyCount / activeCount) * 100}%"
                    ></div>
                </div>
            </div>
        {/if}

        <div
            class="letters-container"
            class:is-visible={isAllReady}
            style="transform: scale({scale});"
        >
            {#if showS}
                <div
                    class="letter-wrapper"
                    style="transform: translate(-394px, 0px); z-index: 1; --delay: 100ms;"
                >
                    <LetterS on:ready={handleReady} />
                </div>
            {/if}
            {#if showW}
                <div
                    class="letter-wrapper"
                    style="transform: translate(-214px, 0px); z-index: 1; --delay: 200ms;"
                >
                    <LetterW on:ready={handleReady} />
                </div>
            {/if}
            {#if showA}
                <div
                    class="letter-wrapper"
                    style="transform: translate(-34px, 0px); z-index: 1; --delay: 300ms;"
                >
                    <LetterA on:ready={handleReady} />
                </div>
            {/if}
            {#if showR}
                <div
                    class="letter-wrapper"
                    style="transform: translate(126px, 11px); z-index: 1; --delay: 400ms;"
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
                    style="transform: translate(292px, 34px) scale(1); z-index: 10; --delay: 500ms;"
                >
                    <LetterD
                        on:ready={handleReady}
                        path="M 120 240 C 80 240, 60 210, 60 180 C 60 150, 80 120, 120 120 C 140 120, 150 130, 150 130 L 150 40 C 150 20, 170 10, 180 30 L 170 240 C 170 250, 160 260, 140 250 Z"
                        holePath="M 120 210 C 140 210, 140 180, 140 160 C 140 140, 130 130, 120 130 C 100 130, 90 150, 90 180 C 90 200, 100 210, 120 210 Z"
                        eyePosition={{ x: 115, y: 170 }}
                        eyeScale={0.7}
                        squashFactor={0.2}
                        blurStrength={0.7}
                        blurColor="#87ceeb"
                    />
                </div>
            {/if}
            {#if showY}
                <div
                    class="letter-wrapper"
                    style="transform: translate(438px, 50px) scale(1.1); z-index: 1; --delay: 800ms;"
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
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        overflow: hidden;
        background: #111;
        color: #fff;
        font-family: monospace;
    }

    .perf-hud {
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.8);
        padding: 15px;
        border-radius: 8px;
        z-index: 1000;
        border: 1px solid #333;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .stats {
        font-size: 1.2rem;
        font-weight: bold;
        color: #0f0;
    }

    .controls {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .toggles {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 5px;
    }

    .toggles label {
        cursor: pointer;
        font-size: 0.8rem;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .actions {
        display: flex;
        gap: 5px;
    }

    button {
        background: #333;
        color: #fff;
        border: 1px solid #555;
        padding: 4px 8px;
        cursor: pointer;
        font-size: 0.7rem;
    }

    button:hover {
        background: #444;
    }

    .letters-section {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        position: relative;
        padding-top: max(20vh, 180px);
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
    }

    .loading-text {
        font-family: "Inter", "Outfit", sans-serif;
        font-weight: 900;
        font-style: italic;
        font-size: 0.7rem;
        letter-spacing: 0.4rem;
        color: #00ffff;
        text-shadow:
            0 0 10px rgba(0, 255, 255, 0.8),
            0 0 20px rgba(0, 255, 255, 0.4);
        opacity: 0.8;
        animation: breath 2s infinite ease-in-out;
    }

    .loading-bar-outer {
        width: 120px;
        height: 1px;
        background: rgba(0, 255, 255, 0.1);
        position: relative;
        overflow: hidden;
    }

    .loading-bar-inner {
        height: 100%;
        background: #00ffff;
        box-shadow: 0 0 8px #00ffff;
        transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes breath {
        0%,
        100% {
            opacity: 0.4;
            transform: scale(0.98);
        }
        50% {
            opacity: 1;
            transform: scale(1);
        }
    }

    .letters-container {
        position: relative;
        width: 0;
        height: 0;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease-in;
    }

    .letters-container.is-visible {
        opacity: 1;
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

    /* --- Entrance Animation: Neon Flicker --- */
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
            filter: brightness(2) drop-shadow(0 0 10px currentColor);
        }
        10% {
            opacity: 0;
        }
        15% {
            opacity: 0.5;
        }
        20% {
            opacity: 1;
            filter: brightness(2) drop-shadow(0 0 10px currentColor);
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
</style>
