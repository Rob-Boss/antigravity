<script lang="ts">
    export let currentIndex: number;
    export let routes: Array<{ id: string; path: string }>;
    export let onNavigate: (index: number) => void;

    // Map the staircase layout visually with EQUAL steps (50px each)
    // 0: Swardy
    // 1: Sequencer (Vertical Down from Swardy)
    // 2: Console (Horizontal Right from Sequencer)
    // 3: Fridge (Vertical Down from Console)
    // 4: Vending (Horizontal Right from Fridge)

    /* 
       Schematic:
       (0) 
        |
       (1) --- (2)
                |
               (3) --- (4)
    */

    const step = 50;
    const points = [
        { x: 30, y: 30 }, // 0: Swardy
        { x: 30, y: 30 + step }, // 1: Sequencer
        { x: 30 + step, y: 30 + step }, // 2: Console
        { x: 30 + step, y: 30 + step * 2 }, // 3: Fridge
        { x: 30 + step * 2, y: 30 + step * 2 }, // 4: Vending
    ];

    $: activePoint = points[currentIndex] || points[0];
</script>

<div class="breadcrumb-overlay">
    <!-- Increased viewBox height to accommodate label space -->
    <svg viewBox="0 0 180 280" class="staircase-map">
        <!-- Connecting Lines -->
        <g class="map-lines">
            <!-- 0 -> 1 -->
            <line
                x1={points[0].x}
                y1={points[0].y}
                x2={points[1].x}
                y2={points[1].y}
            />
            <!-- 1 -> 2 -->
            <line
                x1={points[1].x}
                y1={points[1].y}
                x2={points[2].x}
                y2={points[2].y}
            />
            <!-- 2 -> 3 -->
            <line
                x1={points[2].x}
                y1={points[2].y}
                x2={points[3].x}
                y2={points[3].y}
            />
            <!-- 3 -> 4 -->
            <line
                x1={points[3].x}
                y1={points[3].y}
                x2={points[4].x}
                y2={points[4].y}
            />
        </g>

        <!-- Terminals (Dots) -->
        {#each points as pt, i}
            <g
                class="terminal"
                class:active={i === currentIndex}
                on:click={() => i !== currentIndex && onNavigate(i)}
            >
                <!-- Larger invisible hit area for easier clicking -->
                <circle cx={pt.x} cy={pt.y} r="15" fill="transparent" />

                <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={i === currentIndex ? 4 : 2}
                    class="dot-core"
                />
                {#if i === currentIndex}
                    <circle cx={pt.x} cy={pt.y} r="8" class="dot-glow" />
                {/if}
            </g>
        {/each}
    </svg>

    <!-- Dynamic Label that follows the active dot -->
    <div
        class="location-label"
        style="transform: translate({activePoint.x - 5.5}px, {activePoint.y}px)
               translateY({currentIndex === 0 || currentIndex === 2
            ? -15
            : 15}px)
               {currentIndex === 0 || currentIndex === 2
            ? 'translateY(-100%)'
            : ''};"
    >
        {routes[currentIndex]?.id.toUpperCase() || "UNIDENTIFIED"}
    </div>
</div>

<style>
    .breadcrumb-overlay {
        position: fixed;
        left: 40px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 500;
        width: 180px;
        height: 280px;
    }

    .staircase-map {
        width: 100%;
        height: 100%;
        opacity: 0.6;
        pointer-events: auto;
    }

    .map-lines {
        stroke: rgba(255, 255, 255, 0.15);
        stroke-width: 1;
    }

    .terminal {
        cursor: pointer;
        pointer-events: auto;
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
        font-size: 10px;
        letter-spacing: 0.25em;
        color: rgba(255, 255, 255, 0.6);
        writing-mode: vertical-lr;
        text-orientation: mixed;
        transition: transform 0.8s cubic-bezier(0.85, 0, 0.15, 1);
        text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
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
