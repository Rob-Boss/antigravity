<script lang="ts">
    import LetterS from "$lib/components/LetterS.svelte";
    import LetterW from "$lib/components/LetterW.svelte";
    import LetterA from "$lib/components/LetterA.svelte";
    import LetterR from "$lib/components/LetterR.svelte";
    import LetterD from "$lib/components/LetterD.svelte";
    import LetterY from "$lib/components/LetterY.svelte";

    import SwardyLoadingLogo from "$lib/components/SwardyLoadingLogo.svelte";

    export let scale = 1;
    let readyCount = 0;
    const totalLetters = 6;
    let isAllReady = false;
    let isAnimationFinished = false;

    function handleReady() {
        readyCount++;
        if (readyCount >= totalLetters) {
            isAllReady = true;
        }
    }

    function handleAnimationComplete() {
        isAnimationFinished = true;
    }
</script>

<div class="logo-outer-wrapper">
    <!-- Keep loading logo until animation is DONE -->
    {#if !isAnimationFinished}
        <div
            class="loading-container"
            class:fade-out={isAllReady && isAnimationFinished}
        >
            <SwardyLoadingLogo
                progress={readyCount / totalLetters}
                isReady={isAllReady}
                on:complete={handleAnimationComplete}
            />
        </div>
    {/if}

    <!-- Only show letters once animation is finished -->
    <div
        class="letters-container"
        class:is-visible={isAnimationFinished}
        style="transform: scale({scale});"
    >
        <!-- S -->
        <div
            class="letter-wrapper"
            style="transform: translate(-374px, 10px) scale(0.95); z-index: 1; --delay: 100ms;"
        >
            <LetterS on:ready={handleReady} />
        </div>
        <!-- W -->
        <div
            class="letter-wrapper"
            style="transform: translate(-214px, 0px) scale(1); z-index: 2; --delay: 300ms;"
        >
            <LetterW on:ready={handleReady} />
        </div>
        <!-- A -->
        <div
            class="letter-wrapper"
            style="transform: translate(-34px, 0px) scale(1); z-index: 3; --delay: 500ms;"
        >
            <LetterA on:ready={handleReady} />
        </div>
        <!-- R -->
        <div
            class="letter-wrapper"
            style="transform: translate(126px, 11px) scale(1); z-index: 4; --delay: 700ms;"
        >
            <LetterR
                on:ready={handleReady}
                path="M 50 250 L 80 50 L 180 50 L 150 150 L 80 150 M 150 150 L 200 250"
                numLayers={20}
                layerSpread={60}
                rainbowSpeed={0.005}
                refractionSpeed={0.02}
                damping={0.05}
            />
        </div>
        <!-- D -->
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
                squashFactor={0.15}
                blurStrength={0.6}
                colorShiftSpeed={0.5}
                wobbleAmount={5}
                thickness={4}
                color="#8ba59e"
                blurColor="#87ceeb"
            />
        </div>
        <!-- Y -->
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
    </div>
</div>

<style>
    .logo-outer-wrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 300px;
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
</style>
