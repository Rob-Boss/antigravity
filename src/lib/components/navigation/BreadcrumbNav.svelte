<script lang="ts">
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";

    export let currentIndex: number;
    export let routes: Array<{ id: string; path: string }>;
    export let onNavigate: (index: number) => void;

    let isMobileMenuOpen = false;
    let isMobile: boolean | null = null; // null indicates check hasn't run yet

    // Map the staircase layout visually with EQUAL steps (50px each)
    const step = 50;
    // Adjusted centered points within 180x280 viewBox
    const points = [
        { x: 40, y: 100 }, // Shifted down slightly from 90 to 100
        { x: 40, y: 100 + step },
        { x: 40 + step, y: 100 + step },
        { x: 40 + step, y: 100 + step * 2 },
        { x: 40 + step * 2, y: 100 + step * 2 },
    ];

    $: activePoint = points[currentIndex] || points[0];

    // Compass Logic: Determine neighbor directions
    $: getRelativeDir = (index: number) => {
        const curr = points[currentIndex];
        const target = points[index];
        if (!target) return null;

        if (target.y < curr.y) return "up";
        if (target.y > curr.y) return "down";
        if (target.x < curr.x) return "left";
        if (target.x > curr.x) return "right";
        return null;
    };

    $: prevDir = getRelativeDir(currentIndex - 1);
    $: nextDir = getRelativeDir(currentIndex + 1);

    const dirMap: Record<
        string,
        { x: number; y: number; dx: number; dy: number }
    > = {
        up: { x: 12, y: 2, dx: 0, dy: -3.5 },
        down: { x: 12, y: 22, dx: 0, dy: 3.5 },
        left: { x: 2, y: 12, dx: -3.5, dy: 0 },
        right: { x: 22, y: 12, dx: 3.5, dy: 0 },
    };

    $: getDirCoords = (dir: string | null) =>
        (dir && dirMap[dir]) || { x: 12, y: 12 };

    $: groupOffset = (() => {
        if (isMobileMenuOpen) return { x: 0, y: 0 };
        const activeDots = [{ x: 12, y: 12 }];
        if (prevDir) activeDots.push(dirMap[prevDir]);
        if (nextDir) activeDots.push(dirMap[nextDir]);
        const minX = Math.min(...activeDots.map((d) => d.x));
        const maxX = Math.max(...activeDots.map((d) => d.x));
        const minY = Math.min(...activeDots.map((d) => d.y));
        const maxY = Math.max(...activeDots.map((d) => d.y));
        return {
            x: 12 - (minX + maxX) / 2,
            y: 12 - (minY + maxY) / 2,
        };
    })();

    // Detect single-neighbor mode (endpoints)
    $: hasSingleNeighbor = (prevDir && !nextDir) || (!prevDir && nextDir);
    $: singleDir = prevDir || nextDir;

    // Determine CSS variables for glide animation
    $: glideVars = `
        --dx1: ${prevDir ? dirMap[prevDir].dx : 0}px;
        --dy1: ${prevDir ? dirMap[prevDir].dy : 0}px;
        --dx2: ${nextDir ? dirMap[nextDir].dx : 0}px;
        --dy2: ${nextDir ? dirMap[nextDir].dy : 0}px;
        --dxSingle: ${singleDir ? dirMap[singleDir].dx : 0}px;
        --dySingle: ${singleDir ? dirMap[singleDir].dy : 0}px;
        --gx: ${groupOffset.x}px;
        --gy: ${groupOffset.y}px;
    `;

    onMount(() => {
        const checkMobile = () => {
            isMobile = window.innerWidth <= 768;
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    });

    const handleNavigate = (i: number) => {
        onNavigate(i);
        isMobileMenuOpen = false;
    };
</script>

<svelte:window
    on:keydown={(e) => e.key === "Escape" && (isMobileMenuOpen = false)}
/>

{#if isMobile !== null}
    <div
        class="breadcrumb-container"
        class:mobile={isMobile}
        class:open={isMobileMenuOpen}
    >
        <div
            class="map-wrapper"
            class:mobile={isMobile}
            class:mobile-hidden={isMobile && !isMobileMenuOpen}
        >
            <div
                class="map-content-fade"
                class:content-hidden={isMobile && !isMobileMenuOpen}
            >
                {#if isMobile}
                    <div class="mobile-header">
                        <span class="mobile-title">NAVIGATION</span>
                    </div>
                {/if}

                <div class="breadcrumb-overlay">
                    <svg viewBox="0 0 180 280" class="staircase-map">
                        <g class="map-lines">
                            {#each Array(points.length - 1) as _, i}
                                <line
                                    x1={points[i].x}
                                    y1={points[i].y}
                                    x2={points[i + 1].x}
                                    y2={points[i + 1].y}
                                />
                            {/each}
                        </g>

                        {#each points as pt, i}
                            <g
                                class="terminal"
                                class:active={i === currentIndex}
                                on:click={() =>
                                    i !== currentIndex && handleNavigate(i)}
                            >
                                <circle
                                    cx={pt.x}
                                    cy={pt.y}
                                    r="15"
                                    fill="transparent"
                                />
                                <circle
                                    cx={pt.x}
                                    cy={pt.y}
                                    r={i === currentIndex ? 4 : 2}
                                    class="dot-core"
                                />
                                {#if i === currentIndex}
                                    <circle
                                        cx={pt.x}
                                        cy={pt.y}
                                        r="8"
                                        class="dot-glow"
                                    />
                                {/if}
                            </g>
                        {/each}
                    </svg>

                    {#each points as pt, i}
                        <div
                            class="location-label"
                            class:active={i === currentIndex}
                            style="transform: translate({pt.x -
                                6.5}px, {pt.y}px)
                                   translateY({i === 0 || i === 2 ? -15 : 15}px)
                                   {i === 0 || i === 2
                                ? 'translateY(-100%)'
                                : ''};"
                        >
                            {routes[i]?.id.toUpperCase() || "???"}
                        </div>
                    {/each}
                </div>
            </div>

            {#if isMobile && isMobileMenuOpen}
                <button
                    class="close-hitbox"
                    on:click={() => (isMobileMenuOpen = false)}
                    aria-label="Close menu"
                ></button>
            {/if}
        </div>

        {#if isMobile}
            <div class="mobile-controls">
                <button
                    class="fab"
                    class:active={isMobileMenuOpen}
                    on:click={() => (isMobileMenuOpen = !isMobileMenuOpen)}
                    aria-label={isMobileMenuOpen
                        ? "Close Navigation"
                        : "Open Navigation"}
                >
                    <svg viewBox="0 0 24 24" class="fab-svg">
                        <g
                            class="compass-group"
                            style="transform: translate(var(--gx, 0), var(--gy, 0)); {glideVars}"
                        >
                            <!-- Line 1: Prev Branch -> X stroke -->
                            <line
                                class="line line-neighbor"
                                x1="12"
                                y1="12"
                                x2={isMobileMenuOpen
                                    ? 5
                                    : getDirCoords(prevDir).x}
                                y2={isMobileMenuOpen
                                    ? 5
                                    : getDirCoords(prevDir).y}
                            />
                            <!-- Line 2: Next Branch -> X stroke -->
                            <line
                                class="line line-neighbor"
                                x1="12"
                                y1="12"
                                x2={isMobileMenuOpen
                                    ? 19
                                    : getDirCoords(nextDir).x}
                                y2={isMobileMenuOpen
                                    ? 19
                                    : getDirCoords(nextDir).y}
                            />

                            <!-- Extra X strokes (only visible when open) -->
                            {#if isMobileMenuOpen}
                                <line
                                    class="line"
                                    x1="12"
                                    y1="12"
                                    x2="19"
                                    y2="5"
                                    transition:fade={{ duration: 200 }}
                                />
                                <line
                                    class="line"
                                    x1="12"
                                    y1="12"
                                    x2="5"
                                    y2="19"
                                    transition:fade={{ duration: 200 }}
                                />
                            {/if}

                            <!-- Stylized Dots -->
                            <!-- Current Location (Glide) - Hidden when open -->
                            {#if !isMobileMenuOpen}
                                <circle
                                    class="icon-dot-current"
                                    class:single-neighbor={hasSingleNeighbor}
                                    cx="12"
                                    cy="12"
                                    r="2.5"
                                    style={glideVars}
                                    transition:fade={{ duration: 200 }}
                                />
                            {/if}

                            <!-- Previous Neighbor -->
                            <circle
                                class="icon-dot-neighbor"
                                cx={isMobileMenuOpen
                                    ? 5
                                    : getDirCoords(prevDir).x}
                                cy={isMobileMenuOpen
                                    ? 5
                                    : getDirCoords(prevDir).y}
                                r="1.8"
                                style="opacity: {prevDir || isMobileMenuOpen
                                    ? 1
                                    : 0}"
                            />

                            <!-- Next Neighbor -->
                            <circle
                                class="icon-dot-neighbor"
                                cx={isMobileMenuOpen
                                    ? 19
                                    : getDirCoords(nextDir).x}
                                cy={isMobileMenuOpen
                                    ? 19
                                    : getDirCoords(nextDir).y}
                                r="1.8"
                                style="opacity: {nextDir || isMobileMenuOpen
                                    ? 1
                                    : 0}"
                            />

                            <!-- Corner Dots for X -->
                            {#if isMobileMenuOpen}
                                <circle
                                    class="icon-dot-neighbor"
                                    cx="19"
                                    cy="5"
                                    r="1.8"
                                    transition:fade
                                />
                                <circle
                                    class="icon-dot-neighbor"
                                    cx="5"
                                    cy="19"
                                    r="1.8"
                                    transition:fade
                                />
                            {/if}
                        </g>
                    </svg>
                </button>

                {#if !isMobileMenuOpen}
                    <div
                        class="mobile-curr-label"
                        transition:fade={{ duration: 300 }}
                    >
                        {routes[currentIndex]?.id.toUpperCase()}
                    </div>
                {/if}
            </div>
        {/if}
    </div>
{/if}

<style>
    .breadcrumb-container {
        position: fixed;
        left: 40px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 2000; /* Increased to stay above backdrop */
        pointer-events: none;
    }

    .breadcrumb-container.mobile {
        left: 20px;
        top: 20px;
        transform: none;
    }

    .map-wrapper {
        position: relative;
        pointer-events: auto;
    }

    .breadcrumb-overlay {
        width: 180px;
        height: 280px;
        position: relative;
        transition: transform 0.3s ease;
    }

    .map-wrapper.mobile {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.75);
        backdrop-filter: blur(12px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        /* Opening: clip expands, background/blur appear instantly */
        transition:
            clip-path 0.8s cubic-bezier(0.85, 0, 0.15, 1),
            background 0s,
            backdrop-filter 0s;
        clip-path: circle(150% at 44px 44px);
        pointer-events: auto;
    }

    .map-wrapper.mobile-hidden {
        clip-path: circle(24px at 44px 44px);
        background: transparent;
        backdrop-filter: none;
        pointer-events: none;
        /* Closing: clip shrinks to button size */
        transition:
            clip-path 0.8s cubic-bezier(0.85, 0, 0.15, 1),
            background 0s 0.8s,
            backdrop-filter 0s 0.8s;
    }

    .map-content-fade {
        transition: opacity 0.4s ease;
        opacity: 1;
    }

    .map-content-fade.content-hidden {
        opacity: 0;
        transition: opacity 0.2s ease;
    }

    .mobile .breadcrumb-overlay {
        transform: scale(
            1.6
        ); /* Slightly smaller than before for better balance */
    }

    .mobile-header {
        position: absolute;
        top: 60px;
        width: 100%;
        text-align: center;
        font-family: monospace;
        letter-spacing: 0.5em;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.4);
    }

    .fab {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, 0.1);
        cursor: pointer;
        pointer-events: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        /* Border fades in AFTER close animation (0.8s delay) */
        transition:
            border-color 0.3s ease 0.8s,
            background 0.3s ease 0.8s;
        position: relative;
        z-index: 2000;
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(5px);
    }

    .fab.active {
        background: transparent;
        border-color: transparent;
        backdrop-filter: none;
        /* When active (menu open), transitions are instant */
        transition:
            border-color 0s,
            background 0s;
    }

    .fab:not(.active):hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
    }

    .mobile-controls {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        position: relative;
        z-index: 2100; /* Higher than map-wrapper */
        pointer-events: none;
    }

    .mobile-controls * {
        pointer-events: auto;
    }

    .mobile-curr-label {
        font-family: monospace;
        font-size: 10px;
        letter-spacing: 0.3em;
        color: rgba(255, 255, 255, 0.5);
        writing-mode: vertical-lr;
        text-orientation: mixed;
        pointer-events: none;
        text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }

    .fab-svg {
        width: 24px;
        height: 24px;
        overflow: visible;
    }

    .fab-svg .line {
        stroke: #fff;
        stroke-width: 1.5;
        transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    }

    .fab-svg .icon-dot-current {
        fill: #fff;
        transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.8));
        animation: glide-sequence 2s infinite ease-in-out;
    }

    .fab-svg .icon-dot-current.single-neighbor {
        animation: glide-bounce 1s infinite ease-in-out;
    }

    @keyframes glide-sequence {
        0%,
        100% {
            transform: translate(0, 0);
        }
        25% {
            transform: translate(var(--dx1, 0), var(--dy1, 0));
        }
        50% {
            transform: translate(0, 0);
        }
        75% {
            transform: translate(var(--dx2, 0), var(--dy2, 0));
        }
    }

    @keyframes glide-bounce {
        0%,
        100% {
            transform: translate(0, 0);
        }
        50% {
            transform: translate(var(--dxSingle, 0), var(--dySingle, 0));
        }
    }

    .fab-svg .icon-dot-neighbor {
        fill: rgba(255, 255, 255, 0.4);
        transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    }

    .fab-svg .line-neighbor {
        stroke: rgba(255, 255, 255, 0.3);
        stroke-width: 1.8;
    }

    .compass-group {
        transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    }

    .staircase-map {
        width: 100%;
        height: 100%;
        opacity: 0.6;
    }

    .map-lines {
        stroke: rgba(255, 255, 255, 0.15);
        stroke-width: 1;
    }

    .terminal {
        cursor: pointer;
    }

    .terminal:hover .dot-core {
        fill: rgba(255, 255, 255, 0.8);
        r: 3.5;
    }

    .terminal.active {
        cursor: default;
    }

    .terminal .dot-core {
        fill: rgba(255, 255, 255, 0.3);
        transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    }

    .terminal.active .dot-core {
        fill: #fff;
    }

    .terminal.active .dot-glow {
        fill: rgba(255, 255, 255, 0.2);
        animation: pulse 2s infinite ease-in-out;
    }

    .location-label {
        position: absolute;
        top: 0;
        left: 0;
        font-family: monospace;
        font-size: 7px;
        letter-spacing: 0.25em;
        color: rgba(255, 255, 255, 0.2);
        writing-mode: vertical-lr;
        text-orientation: mixed;
        transition: all 0.8s cubic-bezier(0.85, 0, 0.15, 1);
        text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }

    .location-label.active {
        font-size: 10px;
        color: rgba(255, 255, 255, 0.8);
    }

    .close-hitbox {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: transparent;
        border: none;
        z-index: -1;
        cursor: pointer;
    }

    @keyframes pulse {
        0%,
        100% {
            transform: scale(0.8);
            opacity: 0.3;
        }
        50% {
            transform: scale(1.2);
            opacity: 0.6;
        }
    }
</style>
