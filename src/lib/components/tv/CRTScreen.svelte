<script lang="ts">
    import { onMount } from "svelte";
    import StaticChannel from "./StaticChannel.svelte";

    export let channel: number = 1;
    export let isTransitioning: boolean = false;

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D | null;

    // Map channels to content
    const channelContent = {
        1: "SWARDY",
        2: "Fridge",
        3: "Sequencer",
    };

    onMount(() => {
        if (canvas) {
            ctx = canvas.getContext("2d");
        }
    });
</script>

<div class="crt-screen">
    <!-- CRT Effects Layer -->
    <div class="crt-effects">
        <div class="scanlines"></div>
        <div class="screen-glow"></div>
        <div class="barrel-distortion"></div>
    </div>

    <!-- Content Layer -->
    <div class="screen-content">
        {#if isTransitioning}
            <StaticChannel type="rolling" />
        {:else if channel <= 3}
            <!-- Actual content channels -->
            <div class="channel-placeholder">
                <h2>{channelContent[channel]}</h2>
                <p>Channel {channel}</p>
                <p class="note">
                    Coming Soon: Actual {channelContent[channel]} content will render
                    here
                </p>
            </div>
        {:else}
            <!-- Static channels (4-13) -->
            <StaticChannel
                type={[
                    "white-noise",
                    "color-bars",
                    "snow",
                    "interference",
                    "vhs-tracking",
                    "signal-loss",
                    "chromatic",
                    "analog-glitch",
                    "test-pattern",
                    "dead-channel",
                ][channel - 4]}
            />
        {/if}
    </div>
</div>

<style>
    .crt-screen {
        position: relative;
        width: 100%;
        height: 100%;
        background: #000;
        overflow: hidden;
    }

    .crt-effects {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 100;
    }

    .scanlines {
        position: absolute;
        width: 100%;
        height: 100%;
        background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15) 0px,
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
        );
        pointer-events: none;
        animation: scanline-drift 10s linear infinite;
    }

    @keyframes scanline-drift {
        0% {
            transform: translateY(0);
        }
        100% {
            transform: translateY(4px);
        }
    }

    .screen-glow {
        position: absolute;
        width: 100%;
        height: 100%;
        background: radial-gradient(
            ellipse at center,
            rgba(100, 200, 255, 0.03) 0%,
            transparent 60%
        );
        mix-blend-mode: screen;
    }

    .barrel-distortion {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 2%;
        box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.5);
    }

    .screen-content {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
    }

    .channel-placeholder {
        text-align: center;
        padding: 2rem;
    }

    .channel-placeholder h2 {
        font-size: 3rem;
        margin-bottom: 1rem;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    .channel-placeholder p {
        font-size: 1.2rem;
        opacity: 0.8;
    }

    .note {
        margin-top: 2rem;
        font-size: 0.9rem;
        opacity: 0.5;
        font-style: italic;
    }
</style>
