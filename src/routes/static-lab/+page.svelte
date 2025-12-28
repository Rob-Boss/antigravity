<script>
    import StaticBackground from "$lib/components/visuals/StaticBackground.svelte";
    import { onMount } from "svelte";
    import { fade, fly } from "svelte/transition";

    /** @typedef {'classic' | 'chromatic' | 'vaporware' | 'digital' | 'snowstorm'} StaticType */

    /** @type {StaticType} */
    let selectedType = $state("classic");

    /** @type {Array<{id: StaticType, name: string, description: string}>} */
    const variations = [
        {
            id: "classic",
            name: "Classic Analog",
            description:
                "High-density monochrome grain, reminiscent of late-night frequency loss.",
        },
        {
            id: "chromatic",
            name: "Chromatic Drift",
            description:
                "RGB channel separation and horizontal signal displacement.",
        },
        {
            id: "vaporware",
            name: "Vapor VHS",
            description:
                "Neon-tinted noise with prominent horizontal scanlines.",
        },
        {
            id: "digital",
            name: "Byte Corruption",
            description:
                "Low-resolution blocky noise with random bit-flip color bursts.",
        },
        {
            id: "snowstorm",
            name: "Heavy Weather",
            description:
                "Large particle snow with intermittent horizontal signal streaks.",
        },
    ];

    let mounted = $state(false);
    let resolution = $state(0.4); // Default to optimized
    let targetFps = $state(30); // Default to optimized
    let adaptive = $state(true); // Default to adaptive on
    let floor = $state(40); // User request: lightest black (starting at a light gray)
    let ceiling = $state(255);
    let stats = $state({ timeToDraw: 0, pixelsTotal: 0, currentRes: 0.4 });

    onMount(() => {
        mounted = true;
    });

    /** @param {any} newStats */
    function handleDebug(newStats) {
        // Only update every few frames to keep the UI readable
        if (Math.random() > 0.9) {
            stats = { ...newStats };
        }
    }
</script>

<svelte:head>
    <title>Static Labs | Swardy</title>
</svelte:head>

<div class="labs-container">
    {#if mounted}
        <!-- Background Static (Main Preview) -->
        <div class="main-preview" in:fade={{ duration: 1000 }}>
            <StaticBackground
                type={selectedType}
                opacity={0.6}
                intensity={0.8}
                {resolution}
                fps={targetFps}
                {adaptive}
                {floor}
                {ceiling}
                onDebug={handleDebug}
            />
            <div class="gradient-overlay"></div>
        </div>

        <header in:fly={{ y: -20, duration: 800 }}>
            <div class="logo">STATIC_LABS.v1</div>
            <h1>Experimental grain and noise generators.</h1>
            <p>Optimized for performance: Render small, scale large.</p>
        </header>

        <!-- Optimization Controls -->
        <section class="controls-panel" in:fly={{ y: 20, delay: 400 }}>
            <div class="control-group">
                <label for="resolution"
                    >MAX RESOLUTION ({Math.round(resolution * 100)}%)</label
                >
                <input
                    type="range"
                    id="resolution"
                    min="0.1"
                    max="1"
                    step="0.1"
                    bind:value={resolution}
                />

                <div class="spectrum-controls">
                    <div class="spec-field">
                        <label for="floor">BLACK_POINT ({floor})</label>
                        <input
                            type="range"
                            id="floor"
                            min="0"
                            max="255"
                            bind:value={floor}
                        />
                    </div>
                    <div class="spec-field">
                        <label for="ceiling">WHITE_POINT ({ceiling})</label>
                        <input
                            type="range"
                            id="ceiling"
                            min="0"
                            max="255"
                            bind:value={ceiling}
                        />
                    </div>
                </div>
                <div class="adaptive-toggle">
                    <input
                        type="checkbox"
                        id="adaptive"
                        bind:checked={adaptive}
                    />
                    <label for="adaptive">ADAPTIVE_SCALING</label>
                </div>
            </div>

            <div class="control-group">
                <label for="fps">TARGET FPS ({targetFps})</label>
                <div class="fps-btns">
                    {#each [12, 24, 30, 60] as f}
                        <button
                            class:active={targetFps === f}
                            onclick={() => (targetFps = f)}>{f}</button
                        >
                    {/each}
                </div>
            </div>

            <div class="status-box">
                <div class="stat">
                    <span class="label">DRAW_TIME</span>
                    <span class="value" class:warn={stats.timeToDraw > 10}
                        >{stats.timeToDraw.toFixed(2)}ms</span
                    >
                </div>
                <div class="stat">
                    <span class="label">ADAPTED_RES</span>
                    <span class="value"
                        >{Math.round(stats.currentRes * 100)}%</span
                    >
                </div>
                <div class="stat">
                    <span class="label">LOAD</span>
                    <span class="value"
                        >{stats.currentRes > 0.8
                            ? "HEAVY"
                            : stats.currentRes > 0.4
                              ? "MODERATE"
                              : "LIGHT"}</span
                    >
                </div>
            </div>
        </section>

        <main class="grid-layout">
            {#each variations as variation, i}
                <button
                    class="variation-card"
                    class:active={selectedType === variation.id}
                    onclick={() => (selectedType = variation.id)}
                    in:fly={{ y: 20, delay: 100 * i, duration: 600 }}
                >
                    <div class="card-title">
                        <span class="index">0{i + 1}</span>
                        <h3>{variation.name}</h3>
                    </div>

                    <div class="card-preview">
                        <StaticBackground
                            type={variation.id}
                            intensity={0.5}
                            resolution={0.2}
                            fps={24}
                        />
                    </div>

                    <p class="description">{variation.description}</p>

                    <div class="status-bar">
                        <div class="pulse"></div>
                        <span>SIGNAL ACTIVE</span>
                    </div>
                </button>
            {/each}
        </main>

        <footer in:fade={{ delay: 1000 }}>
            <div class="controls-info">
                <span>INTENSITY: AUTO</span>
                <span>SYNC: STABLE</span>
                <span>FPS: {targetFps}</span>
                <span>RES: {resolution}x</span>
            </div>
        </footer>
    {/if}
</div>

<style>
    :global(body) {
        margin: 0;
        background: #0a0a0a;
        color: #eee;
        font-family:
            "Inter",
            system-ui,
            -apple-system,
            sans-serif;
        overflow-x: hidden;
    }

    .labs-container {
        min-height: 100vh;
        padding: 4rem 2rem;
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .main-preview {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.3;
    }

    .gradient-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(
            circle at center,
            transparent 0%,
            #0a0a0a 90%
        );
    }

    header {
        text-align: center;
        margin-bottom: 4rem;
        max-width: 600px;
    }

    .logo {
        font-family: monospace;
        font-size: 0.8rem;
        letter-spacing: 0.3rem;
        color: #00ffaa;
        margin-bottom: 1rem;
        text-transform: uppercase;
        border: 1px solid rgba(0, 255, 170, 0.3);
        padding: 0.5rem 1rem;
        display: inline-block;
    }

    header p {
        font-size: 1.1rem;
        color: #888;
        line-height: 1.6;
        margin: 0;
    }

    h1 {
        font-size: 2.5rem;
        font-weight: 700;
        letter-spacing: -0.02em;
        margin: 0 0 1rem 0;
        background: linear-gradient(to bottom, #fff, #888);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .controls-panel {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 2rem;
        border-radius: 20px;
        backdrop-filter: blur(20px);
        display: flex;
        gap: 3rem;
        margin-bottom: 4rem;
        align-items: center;
        width: 100%;
        max-width: 900px;
    }

    .control-group {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
        flex: 1;
    }

    .control-group label {
        font-family: monospace;
        font-size: 0.75rem;
        color: #00ffaa;
        letter-spacing: 0.1em;
    }

    .control-group input[type="range"] {
        accent-color: #00ffaa;
        cursor: ew-resize;
    }

    .info {
        font-size: 0.7rem;
        color: #555;
    }

    .spectrum-controls {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
        margin: 1rem 0;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
    }

    .spec-field {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
    }

    .spec-field label {
        font-size: 0.65rem !important;
        color: #666 !important;
    }

    .adaptive-toggle {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }

    .adaptive-toggle label {
        color: #888;
        cursor: pointer;
    }

    .adaptive-toggle input:checked + label {
        color: #00ffaa;
    }

    .fps-btns {
        display: flex;
        gap: 0.5rem;
    }

    .fps-btns button {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    .fps-btns button:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .fps-btns button.active {
        background: #00ffaa;
        color: #000;
        border-color: #00ffaa;
    }

    .status-box {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding-left: 2rem;
        border-left: 1px solid rgba(255, 255, 255, 0.1);
    }

    .stat {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
    }

    .stat .label {
        font-family: monospace;
        font-size: 0.6rem;
        color: #444;
    }

    .stat .value {
        font-family: monospace;
        font-size: 0.8rem;
        font-weight: bold;
    }

    .stat .value.warn {
        color: #ff5555;
    }

    .grid-layout {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
        width: 100%;
        max-width: 1400px;
        margin-bottom: 4rem;
    }

    .variation-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 1.5rem;
        text-align: left;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        position: relative;
        overflow: hidden;
        backdrop-filter: blur(10px);
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .variation-card:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-5px);
    }

    .variation-card.active {
        background: rgba(255, 255, 255, 0.08);
        border-color: #00ffaa;
        box-shadow: 0 0 30px rgba(0, 255, 170, 0.1);
    }

    .card-title {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    .index {
        font-family: monospace;
        color: #00ffaa;
        opacity: 0.5;
        font-size: 0.9rem;
    }

    h3 {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 500;
        letter-spacing: -0.01em;
    }

    .card-preview {
        height: 120px;
        border-radius: 6px;
        overflow: hidden;
        margin-bottom: 1.5rem;
        border: 1px solid rgba(255, 255, 255, 0.05);
        position: relative;
    }

    .description {
        font-size: 0.9rem;
        color: #aaa;
        line-height: 1.5;
        margin: 0 0 1.5rem 0;
        flex-grow: 1;
    }

    .status-bar {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-family: monospace;
        font-size: 0.7rem;
        color: #666;
    }

    .pulse {
        width: 6px;
        height: 6px;
        background: #00ffaa;
        border-radius: 50%;
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0% {
            transform: scale(1);
            opacity: 0.3;
        }
        50% {
            transform: scale(1.5);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 0.3;
        }
    }

    footer {
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        padding-top: 2rem;
        width: 100%;
        max-width: 1400px;
        color: #444;
        font-family: monospace;
        font-size: 0.8rem;
    }

    .controls-info {
        display: flex;
        gap: 2rem;
        justify-content: center;
    }

    button {
        appearance: none;
        border: none;
        font-family: inherit;
        color: inherit;
    }
</style>
