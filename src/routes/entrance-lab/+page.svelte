<script lang="ts">
    import LetterS from "$lib/components/LetterS.svelte";
    import LetterW from "$lib/components/LetterW.svelte";
    import LetterA from "$lib/components/LetterA.svelte";
    import LetterR from "$lib/components/LetterR.svelte";
    import LetterD from "$lib/components/LetterD.svelte";
    import LetterY from "$lib/components/LetterY.svelte";
    import { onMount, tick } from "svelte";
    import { cubicOut, elasticOut, bounceOut, backOut } from "svelte/easing";
    import { tweened, spring } from "svelte/motion";
    import { fade, fly, scale, slide } from "svelte/transition";

    let innerWidth = 1000;
    $: scaleVal = Math.min(1, (innerWidth - 40) / 1100);

    let currentAnimation = "gravity-drop";
    let isAnimating = false;
    let key = 0; // To force re-render

    const animations = [
        { id: "gravity-drop", name: "Gravity Drop" },
        { id: "magnetic", name: "Magnetic Assembly" },
        { id: "elastic", name: "Elastic Snap" },
        { id: "card-flip", name: "Card Flip" },
        { id: "stage", name: "The Stage" },
        { id: "ink-blot", name: "Ink Blot" },
        { id: "neon", name: "Neon Flicker" },
        { id: "data", name: "Data Stream" },
        { id: "particles", name: "Particle Convergence" },
        { id: "liquid", name: "Liquid Morph" },
    ];

    async function playAnimation(id: string) {
        currentAnimation = id;
        isAnimating = false;
        key++; // Reset components
        await tick();
        isAnimating = true;
    }

    // Animation Logic Helpers
    function getDelay(index: number, mode: string) {
        if (mode === "gravity-drop") return index * 100;
        if (mode === "magnetic") return Math.random() * 500;
        if (mode === "elastic") return index * 50;
        if (mode === "card-flip") return index * 150;
        if (mode === "stage") return index * 300;
        if (mode === "ink-blot") return index * 200;
        if (mode === "neon") return index * 100 + Math.random() * 200;
        if (mode === "data") return index * 50;
        if (mode === "particles") return index * 100;
        if (mode === "liquid") return index * 150;
        return 0;
    }

    function getDuration(mode: string) {
        // ... (unused for CSS anims)
        return 0;
    }

    function getEasing(mode: string) {
        // ... (unused for CSS anims)
        return cubicOut;
    }

    function getFlyParams(index: number, mode: string) {
        if (mode === "gravity-drop")
            return {
                y: -600,
                duration: 1000,
                easing: bounceOut,
                delay: index * 100,
            };
        if (mode === "magnetic")
            return {
                x: (Math.random() - 0.5) * 1000,
                y: (Math.random() - 0.5) * 1000,
                duration: 800,
                easing: backOut,
                delay: Math.random() * 300,
            };
        return { y: 0, duration: 0 };
    }
</script>

<svelte:window bind:innerWidth />

<main>
    <div class="controls">
        <h2>Entrance Lab</h2>
        <div class="buttons">
            {#each animations as anim}
                <button
                    class:active={currentAnimation === anim.id}
                    on:click={() => playAnimation(anim.id)}
                >
                    {anim.name}
                </button>
            {/each}
        </div>
        <button class="replay" on:click={() => playAnimation(currentAnimation)}
            >Replay ↻</button
        >
    </div>

    <section class="stage">
        {#key key}
            {#if isAnimating}
                <div
                    class="letters-container"
                    style="transform: scale({scaleVal});"
                >
                    <!-- S -->
                    <div
                        class="letter-wrapper s"
                        class:gravity={currentAnimation === "gravity-drop"}
                        class:magnetic={currentAnimation === "magnetic"}
                        class:elastic={currentAnimation === "elastic"}
                        class:card={currentAnimation === "card-flip"}
                        class:stage-anim={currentAnimation === "stage"}
                        class:ink-blot={currentAnimation === "ink-blot"}
                        class:neon={currentAnimation === "neon"}
                        class:data-stream={currentAnimation === "data"}
                        class:particles={currentAnimation === "particles"}
                        class:liquid={currentAnimation === "liquid"}
                        style="--i: 0; --delay: {getDelay(
                            0,
                            currentAnimation,
                        )}ms;"
                        in:fly={currentAnimation === "gravity-drop" ||
                        currentAnimation === "magnetic"
                            ? getFlyParams(0, currentAnimation)
                            : { duration: 0 }}
                    >
                        <LetterS />
                    </div>
                    <!-- W -->
                    <div
                        class="letter-wrapper w"
                        class:gravity={currentAnimation === "gravity-drop"}
                        class:magnetic={currentAnimation === "magnetic"}
                        class:elastic={currentAnimation === "elastic"}
                        class:card={currentAnimation === "card-flip"}
                        class:stage-anim={currentAnimation === "stage"}
                        class:ink-blot={currentAnimation === "ink-blot"}
                        class:neon={currentAnimation === "neon"}
                        class:data-stream={currentAnimation === "data"}
                        class:particles={currentAnimation === "particles"}
                        class:liquid={currentAnimation === "liquid"}
                        style="--i: 1; --delay: {getDelay(
                            1,
                            currentAnimation,
                        )}ms;"
                        in:fly={currentAnimation === "gravity-drop" ||
                        currentAnimation === "magnetic"
                            ? getFlyParams(1, currentAnimation)
                            : { duration: 0 }}
                    >
                        <LetterW />
                    </div>
                    <!-- A -->
                    <div
                        class="letter-wrapper a"
                        class:gravity={currentAnimation === "gravity-drop"}
                        class:magnetic={currentAnimation === "magnetic"}
                        class:elastic={currentAnimation === "elastic"}
                        class:card={currentAnimation === "card-flip"}
                        class:stage-anim={currentAnimation === "stage"}
                        class:ink-blot={currentAnimation === "ink-blot"}
                        class:neon={currentAnimation === "neon"}
                        class:data-stream={currentAnimation === "data"}
                        class:particles={currentAnimation === "particles"}
                        class:liquid={currentAnimation === "liquid"}
                        style="--i: 2; --delay: {getDelay(
                            2,
                            currentAnimation,
                        )}ms;"
                        in:fly={currentAnimation === "gravity-drop" ||
                        currentAnimation === "magnetic"
                            ? getFlyParams(2, currentAnimation)
                            : { duration: 0 }}
                    >
                        <LetterA />
                    </div>
                    <!-- R -->
                    <div
                        class="letter-wrapper r"
                        class:gravity={currentAnimation === "gravity-drop"}
                        class:magnetic={currentAnimation === "magnetic"}
                        class:elastic={currentAnimation === "elastic"}
                        class:card={currentAnimation === "card-flip"}
                        class:stage-anim={currentAnimation === "stage"}
                        class:ink-blot={currentAnimation === "ink-blot"}
                        class:neon={currentAnimation === "neon"}
                        class:data-stream={currentAnimation === "data"}
                        class:particles={currentAnimation === "particles"}
                        class:liquid={currentAnimation === "liquid"}
                        style="--i: 3; --delay: {getDelay(
                            3,
                            currentAnimation,
                        )}ms;"
                        in:fly={currentAnimation === "gravity-drop" ||
                        currentAnimation === "magnetic"
                            ? getFlyParams(3, currentAnimation)
                            : { duration: 0 }}
                    >
                        <LetterR
                            path="M 50 250 L 80 50 L 180 50 L 150 150 L 80 150 M 150 150 L 200 250"
                            numLayers={20}
                            layerSpread={60}
                            refractionSpeed={0.02}
                            damping={0.05}
                        />
                    </div>
                    <!-- D -->
                    <div
                        class="letter-wrapper d"
                        class:gravity={currentAnimation === "gravity-drop"}
                        class:magnetic={currentAnimation === "magnetic"}
                        class:elastic={currentAnimation === "elastic"}
                        class:card={currentAnimation === "card-flip"}
                        class:stage-anim={currentAnimation === "stage"}
                        class:ink-blot={currentAnimation === "ink-blot"}
                        class:neon={currentAnimation === "neon"}
                        class:data-stream={currentAnimation === "data"}
                        class:particles={currentAnimation === "particles"}
                        class:liquid={currentAnimation === "liquid"}
                        style="--i: 4; --delay: {getDelay(
                            4,
                            currentAnimation,
                        )}ms;"
                        in:fly={currentAnimation === "gravity-drop" ||
                        currentAnimation === "magnetic"
                            ? getFlyParams(4, currentAnimation)
                            : { duration: 0 }}
                    >
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
                    <!-- Y -->
                    <div
                        class="letter-wrapper y"
                        class:gravity={currentAnimation === "gravity-drop"}
                        class:magnetic={currentAnimation === "magnetic"}
                        class:elastic={currentAnimation === "elastic"}
                        class:card={currentAnimation === "card-flip"}
                        class:stage-anim={currentAnimation === "stage"}
                        class:ink-blot={currentAnimation === "ink-blot"}
                        class:neon={currentAnimation === "neon"}
                        class:data-stream={currentAnimation === "data"}
                        class:particles={currentAnimation === "particles"}
                        class:liquid={currentAnimation === "liquid"}
                        style="--i: 5; --delay: {getDelay(
                            5,
                            currentAnimation,
                        )}ms;"
                        in:fly={currentAnimation === "gravity-drop" ||
                        currentAnimation === "magnetic"
                            ? getFlyParams(5, currentAnimation)
                            : { duration: 0 }}
                    >
                        <LetterY
                            shapeMode="rounded"
                            color="#ffd700"
                            secondaryColor="#ffff00"
                        />
                    </div>
                </div>
            {/if}
        {/key}
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

    .controls {
        padding: 20px;
        background: #222;
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 100;
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

    button.replay {
        align-self: flex-start;
        background: #444;
        margin-top: 10px;
    }

    .stage {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
    }

    .letters-container {
        position: relative;
        width: 0;
        height: 0;
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

    /* --- Animation Styles --- */

    /* Elastic Snap */
    .elastic {
        animation: elastic-in 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)
            backwards;
        animation-delay: var(--delay);
    }

    @keyframes elastic-in {
        0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
        }
        /* We need to interpolate to the specific letter transform, which is hard in generic CSS keyframes without individual rules. 
           Actually, since we set the final transform on the element, 'backwards' fill mode might not work as expected if we don't know the destination in keyframes.
           Better approach: Start from center and animate TO the specific transform.
        */
    }

    /* Card Flip */
    .card {
        animation: card-flip-in 0.8s cubic-bezier(0.23, 1, 0.32, 1) backwards;
        animation-delay: var(--delay);
        transform-style: preserve-3d;
        backface-visibility: hidden;
    }

    @keyframes card-flip-in {
        0% {
            opacity: 0;
            transform: var(--final-transform) rotateY(90deg);
        }
        100% {
            opacity: 1;
            transform: var(--final-transform) rotateY(0deg);
        }
    }

    /* Stage */
    .stage-anim {
        animation: stage-in 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) backwards;
        animation-delay: var(--delay);
    }

    @keyframes stage-in {
        0% {
            opacity: 0;
            transform: var(--final-transform) scale(0.8) translateY(50px);
        }
        50% {
            opacity: 1;
            transform: var(--final-transform) scale(1.1) translateY(-20px);
        }
        100% {
            opacity: 1;
            transform: var(--final-transform) scale(1) translateY(0);
        }
    }

    /* Ink Blot */
    .ink-blot {
        animation: ink-spread 1.5s cubic-bezier(0.25, 1, 0.5, 1) backwards;
        animation-delay: var(--delay);
        /* Ensure clip-path works on the wrapper */
    }

    @keyframes ink-spread {
        0% {
            clip-path: circle(0% at 50% 50%);
            filter: blur(10px);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        100% {
            clip-path: circle(150% at 50% 50%);
            filter: blur(0px);
            opacity: 1;
        }
    }

    /* Neon Flicker */
    .neon {
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

    /* Data Stream */
    .data-stream {
        animation: data-reveal 0.6s steps(4) backwards;
        animation-delay: var(--delay);
    }

    @keyframes data-reveal {
        0% {
            opacity: 0;
            transform: var(--final-transform) scaleY(0.1) skewX(20deg);
            filter: hue-rotate(90deg) contrast(2);
        }
        25% {
            opacity: 1;
            transform: var(--final-transform) scaleY(1.5) skewX(-20deg);
            filter: hue-rotate(180deg) contrast(2);
        }
        50% {
            opacity: 0.5;
            transform: var(--final-transform) scaleY(0.5) skewX(10deg);
        }
        75% {
            opacity: 1;
            transform: var(--final-transform) scaleY(1.2) skewX(-5deg);
            filter: hue-rotate(270deg);
        }
        100% {
            opacity: 1;
            transform: var(--final-transform) scaleY(1) skewX(0);
            filter: hue-rotate(0deg);
        }
    }

    /* Liquid Morph (Wipe) */
    .liquid {
        animation: liquid-wipe 1.2s cubic-bezier(0.4, 0, 0.2, 1) backwards;
        animation-delay: var(--delay);
        mask-image: linear-gradient(to right, transparent 50%, black 50%);
        mask-size: 200% 100%;
        mask-position: 100% 0;
    }

    @keyframes liquid-wipe {
        0% {
            mask-position: 100% 0;
            transform: var(--final-transform) scaleX(1.1) skewX(-10deg);
        }
        100% {
            mask-position: 0% 0;
            transform: var(--final-transform) scaleX(1) skewX(0);
        }
    }

    /* Particle Convergence (Blur Zoom) */
    .particles {
        animation: particle-converge 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)
            backwards;
        animation-delay: var(--delay);
    }

    @keyframes particle-converge {
        0% {
            opacity: 0;
            transform: var(--final-transform) scale(2);
            filter: blur(20px);
        }
        100% {
            opacity: 1;
            transform: var(--final-transform) scale(1);
            filter: blur(0px);
        }
    }

    /* Fix for keyframes needing final transform */
    .s {
        --final-transform: translate(-394px, 0px);
    }
    .w {
        --final-transform: translate(-214px, 0px);
    }
    .a {
        --final-transform: translate(-34px, 0px);
    }
    .r {
        --final-transform: translate(126px, 11px);
    }
    .d {
        --final-transform: translate(267px, 0px) scale(0.9);
    }
    .y {
        --final-transform: translate(438px, 50px) scale(1.1);
    }

    /* Override for Elastic to use var */
    .elastic {
        animation: elastic-in-var 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)
            backwards;
        animation-delay: var(--delay);
    }

    @keyframes elastic-in-var {
        0% {
            opacity: 0;
            transform: translate(0, 0) scale(0);
        }
        100% {
            opacity: 1;
            transform: var(--final-transform);
        }
    }
</style>
