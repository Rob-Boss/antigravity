<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import LetterS from "$lib/components/LetterS.svelte";
    import LetterW from "$lib/components/LetterW.svelte";
    import LetterA from "$lib/components/LetterA.svelte";
    import LetterR from "$lib/components/LetterR.svelte";
    import LetterD from "$lib/components/LetterD.svelte";
    import LetterY from "$lib/components/LetterY.svelte";

    import SwardyLoadingLogo from "$lib/components/SwardyLoadingLogo.svelte";
    import SignalStatic from "$lib/components/visuals/SignalStatic.svelte";
    import { goto } from "$app/navigation";

    let showS = true;
    let showW = true;
    let showA = true;
    let showR = true;
    let showD = true;
    let showY = true;

    let innerWidth = 1000;
    $: scale = Math.min(1, (innerWidth - 40) / 1100);

    let readyCount = 0;
    let isAllReady = false;
    let isAnimationFinished = false;

    $: activeCount = [showS, showW, showA, showR, showD, showY].filter(
        Boolean,
    ).length;

    $: if (readyCount >= activeCount && activeCount > 0) {
        isAllReady = true;
    }

    function handleReady() {
        readyCount++;
    }

    function handleAnimationComplete() {
        isAnimationFinished = true;
    }

    let isExiting = false;
    async function handleExit() {
        if (isExiting) return;
        isExiting = true;
        // Wait for animation
        await new Promise((r) => setTimeout(r, 800));
        goto("/scroll-5");
    }

    function handleWheel(e: WheelEvent) {
        if (e.deltaY > 20 && isAnimationFinished && !isExiting) {
            handleExit();
        }
    }
</script>

<svelte:window bind:innerWidth on:wheel={handleWheel} />

<div class="page-root">
    <div class="background-layer">
        <SignalStatic
            resolution={1.0}
            blackPoint={0.3}
            whitePoint={0.49}
            speed={20.0}
        />
    </div>

    <main class:is-exiting={isExiting}>
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

            <div class="content-wrapper" class:is-visible={isAnimationFinished}>
                <div
                    class="letters-container"
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

                <div class="nav-container">
                    <button
                        class="arrow-button"
                        on:click={handleExit}
                        aria-label="Enter site"
                    >
                        <svg viewBox="0 0 24 24" class="arrow-svg">
                            <path
                                d="M 6 9 L 12 15 L 18 9"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    </main>
</div>

<style>
    .page-root {
        position: relative;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background: #000;
    }

    .background-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
    }

    main {
        min-height: 100vh;
        background: transparent;
        color: white;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition: transform 0.8s cubic-bezier(0.85, 0, 0.15, 1);
        position: relative;
        z-index: 1;
    }

    main.is-exiting {
        transform: translateY(-100vh);
    }

    .letters-section {
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        padding: 0;
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

    .content-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        visibility: hidden;
        opacity: 0;
        transition: opacity 0.8s ease-out;
    }

    .content-wrapper.is-visible {
        visibility: visible;
        opacity: 1;
    }

    .letters-container {
        position: relative;
        width: 0;
        height: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .letter-wrapper {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: -122px; /* Center adjustment */
        margin-top: -150px;
    }

    /* Entrance Animation: Neon Flicker */
    .content-wrapper.is-visible .letter-wrapper {
        animation: neon-flicker 2s steps(1) backwards;
        animation-delay: var(--delay);
    }

    .nav-container {
        position: absolute;
        bottom: 40px;
        left: 0;
        right: 0;
        z-index: 10;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .arrow-button {
        background: none;
        border: none;
        padding: 20px;
        cursor: pointer;
        color: rgba(255, 255, 255, 0.4);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        opacity: 0;
        animation: fade-in-up 1s ease-out forwards;
        animation-delay: 2.2s;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .arrow-button:hover {
        color: white;
        transform: scale(1.3);
    }

    .arrow-svg {
        width: 60px;
        height: 60px;
        filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.2));
        animation: bounce-blink 2.5s infinite ease-in-out;
        animation-delay: 3.2s;
    }

    .arrow-button:hover .arrow-svg {
        filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.6));
        animation-play-state: paused;
    }

    @keyframes bounce-blink {
        0%,
        100% {
            transform: translateY(0);
            opacity: 0.4;
        }
        50% {
            transform: translateY(8px);
            opacity: 1;
        }
    }

    @keyframes fade-in-up {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
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
