<script lang="ts">
    import SignalStatic from "$lib/components/visuals/SignalStatic.svelte";
    import { onMount } from "svelte";
    import { fade, fly } from "svelte/transition";

    let resolution = 1.0;
    let blackPoint = 0.0;
    let whitePoint = 1.0;
    let speed = 1.0;
    let isFrozen = false;

    let mounted = false;
    onMount(() => {
        mounted = true;
    });
</script>

<svelte:head>
    <title>Signal Static Lab | Swardy</title>
</svelte:head>

<div class="lab-container">
    {#if mounted}
        <div class="shader-background">
            <SignalStatic
                {resolution}
                {blackPoint}
                {whitePoint}
                {speed}
                {isFrozen}
            />
        </div>

        <header in:fly={{ y: -20, duration: 800 }}>
            <div class="badge">GPU_ACCELERATED</div>
            <h1>Signal Static Lab</h1>
            <p>Opaque WebGL noise optimized for performance.</p>
        </header>

        <main class="controls-panel" in:fly={{ y: 20, delay: 400 }}>
            <div class="control-group">
                <div class="label-row">
                    <label>Resolution</label>
                    <span class="value">{Math.round(resolution * 100)}%</span>
                </div>
                <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    bind:value={resolution}
                />
                <p class="hint">Lower resolution for a chunkier, retro feel.</p>
            </div>

            <div class="control-row">
                <div class="control-group">
                    <div class="label-row">
                        <label>blackPoint</label>
                        <span class="value">{blackPoint.toFixed(2)}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        bind:value={blackPoint}
                    />
                </div>
                <div class="control-group">
                    <div class="label-row">
                        <label>whitePoint</label>
                        <span class="value">{whitePoint.toFixed(2)}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        bind:value={whitePoint}
                    />
                </div>
            </div>

            <div class="control-group">
                <div class="label-row">
                    <label>Entropy Speed</label>
                    <span class="value">{speed.toFixed(2)}x</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.1"
                    bind:value={speed}
                />
            </div>

            <div class="actions">
                <button
                    class:active={isFrozen}
                    on:click={() => (isFrozen = !isFrozen)}
                >
                    {isFrozen ? "RESUME_SIGNAL" : "FREEZE_FRAME"}
                </button>
                <button
                    on:click={() => {
                        resolution = 1.0;
                        blackPoint = 0.2;
                        whitePoint = 1.0;
                        speed = 20.0;
                    }}
                >
                    [ LOAD_SIGNAL_PRESET ]
                </button>
            </div>
        </main>

        <footer in:fade={{ delay: 1000 }}>
            <div class="stats">
                <span>CONTEXT: WEBGL_1.0</span>
                <span>STATE: {isFrozen ? "IDLE" : "ACTIVE"}</span>
                <span>DELTA_TIME: ENABLED</span>
            </div>
        </footer>
    {/if}
</div>

<style>
    :global(body) {
        margin: 0;
        background: #050505;
        color: #eee;
        font-family: "Inter", sans-serif;
        overflow: hidden;
    }

    .lab-container {
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .shader-background {
        position: absolute;
        inset: 0;
        z-index: -1;
    }

    header {
        text-align: center;
        margin-bottom: 2rem;
        pointer-events: none;
    }

    .badge {
        font-family: monospace;
        font-size: 0.7rem;
        color: #00ffaa;
        background: rgba(0, 255, 170, 0.1);
        padding: 4px 12px;
        border-radius: 20px;
        border: 1px solid rgba(0, 255, 170, 0.3);
        display: inline-block;
        margin-bottom: 1rem;
    }

    h1 {
        font-size: 3rem;
        font-weight: 800;
        margin: 0;
        letter-spacing: -0.04em;
    }

    p {
        color: #888;
        margin-top: 0.5rem;
    }

    .controls-panel {
        background: rgba(15, 15, 15, 0.8);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 2rem;
        border-radius: 16px;
        width: 360px;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }

    .control-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .control-row {
        display: flex;
        gap: 1rem;
    }

    .control-row .control-group {
        flex: 1;
    }

    .label-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    label {
        font-size: 0.75rem;
        font-weight: 600;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .value {
        font-family: monospace;
        font-size: 0.8rem;
        color: #00ffaa;
    }

    .hint {
        font-size: 0.65rem;
        color: #444;
        margin: 0;
    }

    input[type="range"] {
        width: 100%;
        accent-color: #00ffaa;
        cursor: pointer;
    }

    .actions {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }

    button {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #aaa;
        padding: 10px;
        border-radius: 8px;
        cursor: pointer;
        font-family: monospace;
        font-size: 0.75rem;
        transition: all 0.2s;
    }

    button:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
    }

    button.active {
        background: #00ffaa;
        color: #000;
        border-color: #00ffaa;
    }

    footer {
        position: absolute;
        bottom: 2rem;
        font-family: monospace;
        font-size: 0.7rem;
        color: #444;
    }

    .stats {
        display: flex;
        gap: 2rem;
    }
</style>
