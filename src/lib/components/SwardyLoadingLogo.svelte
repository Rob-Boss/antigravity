<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { tweened } from "svelte/motion";
    import { cubicOut } from "svelte/easing";

    const dispatch = createEventDispatcher();

    export let progress = 0; // 0 to 1
    export let isReady = false;

    // Unique ID suffix to prevent clashes
    const uid = Math.random().toString(36).substring(2, 8);

    // SVG paths based on the brand letters
    const paths = {
        S: "M 25 20 Q 15 20 15 30 Q 15 40 25 40 Q 35 40 35 50 Q 35 60 25 60",
        W: "M 55 20 L 62.5 60 L 70 30 L 77.5 60 L 85 20",
        A: "M 105 60 L 115 20 L 125 60 M 110 45 L 120 45",
        R: "M 145 60 L 148 20 L 163 20 L 160 35 L 149 35 M 160 35 L 168 60",
        D: "M 195 55 C 185 55 180 50 180 45 C 180 40 185 35 195 35 C 199 35 202 36 202 36 L 202 10 C 202 7 205 5 208 8 L 206 55 C 206 57 203 60 199 58 Z",
        Y: "M 225 20 L 235 40 L 245 20 M 235 40 L 235 60",
    };

    const smoothProgress = tweened(0, {
        duration: 1800, // Cinematic sweep duration (to 90%)
        easing: cubicOut,
    });

    // Start initial sweep to 90% on mount
    import { onMount } from "svelte";
    onMount(() => {
        smoothProgress.set(0.9);
    });

    // When ready, finish the last 10% quickly but visibly
    $: if (isReady && $smoothProgress >= 0.85) {
        smoothProgress.set(1, { duration: 400 }).then(() => {
            dispatch("complete");
        });
    }

    $: p = $smoothProgress;
    $: hotOffset = `${p * 100}%`;
    $: hotStartOffset = `${Math.max(0, p * 100 - 15)}%`; // Wide hot edge for cinematic feel
    $: leadingOffset = `${Math.min(100, p * 100 + 1)}%`;
</script>

<div class="loading-logo-container" class:is-ready={isReady && p > 0.95}>
    <svg viewBox="0 10 260 60" class="swardy-svg">
        <defs>
            <linearGradient
                id="body-mask-gradient-{uid}"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
            >
                <stop offset="0%" stop-color="white" />
                <stop offset={hotOffset} stop-color="white" />
                <stop offset={leadingOffset} stop-color="black" />
                <stop offset="100%" stop-color="black" />
            </linearGradient>

            <linearGradient
                id="hot-edge-mask-gradient-{uid}"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
            >
                <stop offset="0%" stop-color="black" />
                <stop offset={hotStartOffset} stop-color="black" />
                <stop offset={hotOffset} stop-color="white" />
                <stop offset={leadingOffset} stop-color="black" />
                <stop offset="100%" stop-color="black" />
            </linearGradient>

            <filter
                id="body-glow-{uid}"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
            >
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>

            <filter
                id="extreme-glow-{uid}"
                x="-100%"
                y="-100%"
                width="300%"
                height="300%"
            >
                <feGaussianBlur stdDeviation="6" result="blur1" />
                <feGaussianBlur stdDeviation="2" result="blur2" />
                <feMerge>
                    <feMergeNode in="blur1" />
                    <feMergeNode in="blur2" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>

            <mask id="body-mask-{uid}">
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="url(#body-mask-gradient-{uid})"
                />
            </mask>

            <mask id="hot-edge-mask-{uid}">
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="url(#hot-edge-mask-gradient-{uid})"
                />
            </mask>
        </defs>

        <!-- Base Layer -->
        <g
            stroke="rgba(255, 255, 255, 0.12)"
            stroke-width="2.5"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path d={paths.S} />
            <path d={paths.W} />
            <path d={paths.A} />
            <path d={paths.R} />
            <path d={paths.D} />
            <path d={paths.Y} />
        </g>

        <!-- Revealed Body -->
        <g
            stroke="white"
            stroke-width="2.5"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            mask="url(#body-mask-{uid})"
            filter="url(#body-glow-{uid})"
            opacity="0.8"
        >
            <path d={paths.S} />
            <path d={paths.W} />
            <path d={paths.A} />
            <path d={paths.R} />
            <path d={paths.D} />
            <path d={paths.Y} />
        </g>

        <!-- Hot Edge -->
        <g
            stroke="white"
            stroke-width="3.5"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            mask="url(#hot-edge-mask-{uid})"
            filter="url(#extreme-glow-{uid})"
        >
            <path d={paths.S} />
            <path d={paths.W} />
            <path d={paths.A} />
            <path d={paths.R} />
            <path d={paths.D} />
            <path d={paths.Y} />
        </g>

        <!-- Traveling Flash -->
        {#if p > 0 && p < 0.99}
            <line
                x1={p * 260}
                y1="15"
                x2={p * 260}
                y2="65"
                stroke="white"
                stroke-width="2"
                filter="url(#extreme-glow-{uid})"
            />
        {/if}
    </svg>
</div>

<style>
    .loading-logo-container {
        width: 180px;
        transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.2));
    }

    .swardy-svg {
        width: 100%;
        height: auto;
        overflow: visible;
    }

    .is-ready {
        scale: 1.15;
        filter: drop-shadow(0 0 30px rgba(255, 255, 255, 1));
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 0.7;
        }
        50% {
            opacity: 1;
        }
    }

    .loading-logo-container:not(.is-ready) {
        animation: pulse 1.5s infinite ease-in-out;
    }
</style>
