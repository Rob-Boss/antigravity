<script lang="ts">
    import { spring } from "svelte/motion";
    import CRTScreen from "./CRTScreen.svelte";
    import ChannelDial from "./ChannelDial.svelte";

    let currentChannel = 1;
    let isTransitioning = false;

    function handleChannelChange(event: CustomEvent<number>) {
        if (isTransitioning) return;

        const newChannel = event.detail;
        if (newChannel === currentChannel) return;

        isTransitioning = true;

        // Transition delay
        setTimeout(() => {
            currentChannel = newChannel;
            setTimeout(() => {
                isTransitioning = false;
            }, 500);
        }, 300);
    }
</script>

<div class="crt-container">
    <div class="tv-unit">
        <!-- Antenna -->
        <div class="antenna-group">
            <div class="antenna left"></div>
            <div class="antenna right"></div>
            <div class="antenna-base"></div>
        </div>

        <!-- Main Body -->
        <div class="tv-body">
            <!-- Screen Section -->
            <div class="screen-bezel">
                <div class="screen-glass">
                    <div class="screen-content">
                        <CRTScreen channel={currentChannel} {isTransitioning} />
                    </div>
                    <!-- Screen Reflections -->
                    <div class="reflection-highlight"></div>
                </div>
            </div>

            <!-- Control Panel Section -->
            <div class="control-panel">
                <div class="speaker-grille">
                    {#each Array(12) as _}
                        <div class="grille-slot"></div>
                    {/each}
                </div>

                <div class="controls-right">
                    <div class="power-light"></div>
                    <div class="dial-mount">
                        <ChannelDial on:channelChange={handleChannelChange} />
                    </div>
                </div>
            </div>
        </div>

        <!-- TV Feet -->
        <div class="tv-feet">
            <div class="foot left"></div>
            <div class="foot right"></div>
        </div>
    </div>
</div>

<style>
    .crt-container {
        width: 100%;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        overflow: hidden;
    }

    .tv-unit {
        position: relative;
        width: min(800px, 90vw);
        aspect-ratio: 1.1; /* Slightly taller than wide */
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    /* --- Antenna --- */
    .antenna-group {
        position: absolute;
        top: -80px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 0;
        width: 200px;
        height: 100px;
        pointer-events: none;
    }

    .antenna-base {
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 30px;
        background: #dcdcdc;
        border-radius: 50% 50% 0 0;
        box-shadow: inset -2px -2px 5px rgba(0, 0, 0, 0.2);
    }

    .antenna {
        position: absolute;
        bottom: 10px;
        width: 4px;
        height: 120px;
        background: linear-gradient(to right, #888, #eee, #888);
        transform-origin: bottom center;
        border-radius: 2px;
    }

    .antenna.left {
        left: 45%;
        transform: rotate(-25deg);
    }

    .antenna.right {
        right: 45%;
        transform: rotate(25deg);
    }

    .antenna::after {
        content: "";
        position: absolute;
        top: -6px;
        left: -3px;
        width: 10px;
        height: 10px;
        background: #dcdcdc;
        border-radius: 50%;
        box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    }

    /* --- Main Body --- */
    .tv-body {
        position: relative;
        z-index: 10;
        width: 100%;
        height: 100%;
        background: #e6e2d8; /* Vintage beige */
        border-radius: 40px;
        padding: 30px;
        box-shadow:
            inset 0 0 20px rgba(0, 0, 0, 0.05),
            /* Inner depth */ inset 2px 2px 5px rgba(255, 255, 255, 0.5),
            /* Top-left highlight */ inset -5px -5px 15px rgba(0, 0, 0, 0.1),
            /* Bottom-right shadow */ 0 20px 50px rgba(0, 0, 0, 0.3); /* Drop shadow */
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    /* --- Screen Area --- */
    .screen-bezel {
        flex: 1;
        background: #2a2a2a;
        border-radius: 30px; /* The bubble shape */
        padding: 20px;
        box-shadow:
            inset 0 2px 10px rgba(0, 0, 0, 0.5),
            0 1px 2px rgba(255, 255, 255, 0.2);
        position: relative;
        overflow: hidden;
    }

    .screen-glass {
        width: 100%;
        height: 100%;
        background: #000;
        border-radius: 20px; /* Inner screen curve */
        position: relative;
        overflow: hidden;
        box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.8);
    }

    .screen-content {
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 1;
    }

    .reflection-highlight {
        position: absolute;
        top: 5%;
        right: 5%;
        width: 30%;
        height: 20%;
        background: radial-gradient(
            ellipse at center,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 70%
        );
        border-radius: 50%;
        transform: rotate(-15deg);
        pointer-events: none;
        z-index: 20;
    }

    /* --- Control Panel --- */
    .control-panel {
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        background: #dcd8cc; /* Slightly darker beige */
        border-radius: 20px;
        box-shadow:
            inset 1px 1px 3px rgba(0, 0, 0, 0.1),
            inset -1px -1px 2px rgba(255, 255, 255, 0.5);
    }

    .speaker-grille {
        display: flex;
        gap: 8px;
        height: 60%;
        align-items: center;
    }

    .grille-slot {
        width: 6px;
        height: 100%;
        background: #333;
        border-radius: 3px;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
    }

    .controls-right {
        display: flex;
        align-items: center;
        gap: 30px;
    }

    .power-light {
        width: 12px;
        height: 12px;
        background: #ff3333;
        border-radius: 50%;
        box-shadow:
            0 0 5px #ff3333,
            inset -1px -1px 2px rgba(0, 0, 0, 0.3);
        position: relative;
    }

    .power-light::after {
        content: "POWER";
        position: absolute;
        bottom: -18px;
        left: 50%;
        transform: translateX(-50%);
        font-family: sans-serif;
        font-size: 8px;
        color: #666;
        font-weight: bold;
        letter-spacing: 1px;
    }

    .dial-mount {
        width: 90px;
        height: 90px;
        position: relative;
        /* Ensure dial fits */
    }

    /* --- Feet --- */
    .tv-feet {
        position: absolute;
        bottom: -15px;
        width: 80%;
        display: flex;
        justify-content: space-between;
        z-index: 5;
    }

    .foot {
        width: 60px;
        height: 30px;
        background: #333;
        border-radius: 0 0 10px 10px;
    }

    @media (max-width: 768px) {
        .tv-unit {
            width: 95vw;
        }

        .control-panel {
            height: 100px;
        }

        .dial-mount {
            width: 70px;
            height: 70px;
        }
    }
</style>
