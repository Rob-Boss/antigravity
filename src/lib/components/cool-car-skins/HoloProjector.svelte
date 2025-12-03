<script lang="ts">
    import { createViewerStore } from "$lib/stores/viewerStore";
    import { fade } from "svelte/transition";

    const {
        currentIndex,
        direction,
        images,
        nextImage,
        prevImage,
        selectRandomImage,
    } = createViewerStore();
</script>

<div class="holo-projector">
    <div class="projection-zone">
        <div class="hologram">
            {#key $currentIndex}
                <img
                    src={images[$currentIndex]}
                    alt="Holo Car"
                    class="car-image"
                    in:fade={{ duration: 300 }}
                    out:fade={{ duration: 300 }}
                />
            {/key}
            <div class="scan-beam"></div>
            <div class="flicker-overlay"></div>
        </div>
        <div class="light-cone"></div>
    </div>

    <div class="base-unit">
        <div class="emitter-lens"></div>
        <div class="base-controls">
            <button class="touch-pad left" on:click={prevImage}></button>
            <div class="status-ring"></div>
            <button class="touch-pad right" on:click={nextImage}></button>
        </div>
        <button class="random-sensor" on:click={selectRandomImage}>RND</button>
    </div>
</div>

<style>
    .holo-projector {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 500px;
        justify-content: flex-end;
    }

    .projection-zone {
        position: relative;
        width: 400px;
        height: 300px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        margin-bottom: 20px;
    }

    .hologram {
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 10;
        opacity: 0.8;
        transform-origin: bottom center;
        animation: hover 3s ease-in-out infinite;
    }

    .car-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: drop-shadow(0 0 10px #00e5ff) hue-rotate(180deg) brightness(1.5);
        mix-blend-mode: screen;
    }

    .scan-beam {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 10px;
        background: rgba(0, 229, 255, 0.5);
        box-shadow: 0 0 20px #00e5ff;
        animation: scan 2s linear infinite;
        opacity: 0.3;
        pointer-events: none;
    }

    .flicker-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 229, 255, 0.1);
        pointer-events: none;
        animation: flicker 0.1s infinite;
    }

    .light-cone {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 300px;
        height: 300px;
        background: linear-gradient(
            to top,
            rgba(0, 229, 255, 0.2),
            transparent
        );
        clip-path: polygon(20% 100%, 80% 100%, 100% 0, 0 0);
        pointer-events: none;
        z-index: 1;
    }

    .base-unit {
        width: 300px;
        height: 80px;
        background: #212121;
        border-radius: 40px;
        position: relative;
        box-shadow:
            0 0 20px rgba(0, 229, 255, 0.2),
            inset 0 5px 10px rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 20;
    }

    .emitter-lens {
        position: absolute;
        top: -10px;
        width: 100px;
        height: 20px;
        background: #00e5ff;
        border-radius: 50%;
        box-shadow: 0 0 20px #00e5ff;
        filter: blur(2px);
    }

    .base-controls {
        display: flex;
        justify-content: space-between;
        width: 80%;
        align-items: center;
    }

    .touch-pad {
        width: 40px;
        height: 40px;
        border-radius: 5px;
        background: #333;
        border: 1px solid #444;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .touch-pad::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(0, 229, 255, 0.5);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition:
            width 0.3s,
            height 0.3s;
    }
    .touch-pad:active::after {
        width: 100px;
        height: 100px;
    }

    .status-ring {
        width: 60px;
        height: 6px;
        background: #00e5ff;
        border-radius: 3px;
        box-shadow: 0 0 10px #00e5ff;
    }

    .random-sensor {
        position: absolute;
        bottom: -30px;
        background: transparent;
        border: 1px solid #00e5ff;
        color: #00e5ff;
        font-size: 10px;
        padding: 2px 8px;
        border-radius: 10px;
        cursor: pointer;
        opacity: 0.5;
        transition: opacity 0.2s;
    }
    .random-sensor:hover {
        opacity: 1;
        box-shadow: 0 0 10px #00e5ff;
    }

    @keyframes scan {
        0% {
            top: 0;
            opacity: 0;
        }
        10% {
            opacity: 0.5;
        }
        90% {
            opacity: 0.5;
        }
        100% {
            top: 100%;
            opacity: 0;
        }
    }

    @keyframes flicker {
        0% {
            opacity: 0.1;
        }
        50% {
            opacity: 0.15;
        }
        100% {
            opacity: 0.1;
        }
    }

    @keyframes hover {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }
</style>
