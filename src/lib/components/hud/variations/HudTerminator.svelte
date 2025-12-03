<script lang="ts">
    import { onMount } from "svelte";

    let cursorX = 0;
    let cursorY = 0;
    let scanning = false;

    function handleMouseMove(e: MouseEvent) {
        cursorX = e.clientX;
        cursorY = e.clientY;
    }

    function scan() {
        scanning = true;
        setTimeout(() => (scanning = false), 1000);
    }
</script>

<div class="hud-terminator" on:mousemove={handleMouseMove} on:click={scan}>
    <div class="scanlines"></div>
    <div class="vignette"></div>

    <!-- Dynamic Cursor Tracker -->
    <div class="tracker" style="top: {cursorY}px; left: {cursorX}px;">
        <div class="box" class:scanning></div>
        <div class="data">
            {#if scanning}
                ANALYZING...<br />
                MATCH: 99.9%<br />
                THREAT: HIGH
            {:else}
                SCAN MODE<br />
                WAITING...
            {/if}
        </div>
    </div>

    <!-- Static Overlay Data -->
    <div class="overlay-text top-left">
        VISUAL_MODE: ENHANCED<br />
        CPU_TEMP: 98.4F<br />
        MEM: 64TB
    </div>

    <div class="overlay-text bottom-right">
        <span class="blink">REC</span> [●]
    </div>

    <div class="compass">
        {#each Array(10) as _}
            <div class="tick"></div>
        {/each}
    </div>
</div>

<style>
    .hud-terminator {
        width: 100%;
        height: 100%;
        background: #1a0000;
        color: #ff0000;
        font-family: "Courier New", monospace;
        font-weight: bold;
        overflow: hidden;
        position: relative;
        cursor: none; /* Hide default cursor */
    }

    .scanlines {
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 2px,
            rgba(0, 0, 0, 0.5) 3px,
            rgba(0, 0, 0, 0.5) 4px
        );
        pointer-events: none;
        z-index: 10;
    }

    .vignette {
        position: absolute;
        inset: 0;
        background: radial-gradient(
            circle,
            transparent 60%,
            rgba(0, 0, 0, 0.8)
        );
        pointer-events: none;
        z-index: 11;
    }

    .tracker {
        position: fixed; /* Use fixed to follow mouse exactly */
        pointer-events: none;
        transform: translate(-50%, -50%);
        z-index: 20;
    }

    .box {
        width: 100px;
        height: 100px;
        border: 2px solid #ff0000;
        box-shadow: 0 0 10px #ff0000;
        transition: all 0.2s;
    }

    .box.scanning {
        width: 80px;
        height: 80px;
        border-width: 4px;
        background: rgba(255, 0, 0, 0.2);
        animation: pulse 0.5s infinite;
    }

    .data {
        position: absolute;
        top: 110%;
        left: 0;
        font-size: 12px;
        white-space: nowrap;
        text-shadow: 0 0 5px #ff0000;
        background: rgba(0, 0, 0, 0.7);
        padding: 4px;
    }

    .overlay-text {
        position: absolute;
        padding: 20px;
        font-size: 14px;
        line-height: 1.5;
        text-shadow: 0 0 5px #ff0000;
        z-index: 5;
    }
    .top-left {
        top: 0;
        left: 0;
    }
    .bottom-right {
        bottom: 0;
        right: 0;
        text-align: right;
    }

    .blink {
        animation: blink 1s infinite;
    }

    .compass {
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 10px;
    }
    .tick {
        width: 2px;
        height: 10px;
        background: #ff0000;
    }

    @keyframes blink {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
    }

    @keyframes pulse {
        0% {
            box-shadow: 0 0 10px #ff0000;
        }
        50% {
            box-shadow: 0 0 30px #ff0000;
        }
        100% {
            box-shadow: 0 0 10px #ff0000;
        }
    }
</style>
