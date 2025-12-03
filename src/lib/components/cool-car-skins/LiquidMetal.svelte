<script lang="ts">
    import { createViewerStore } from "$lib/stores/viewerStore";
    import { fade } from "svelte/transition";

    const { currentIndex, images, nextImage, prevImage, selectRandomImage } =
        createViewerStore();
</script>

<div class="liquid-metal">
    <div class="mercury-pool">
        <div class="fluid-surface">
            {#key $currentIndex}
                <img
                    src={images[$currentIndex]}
                    alt="Liquid Car"
                    class="car-image"
                    in:fade={{ duration: 600 }}
                    out:fade={{ duration: 600 }}
                />
            {/key}
            <div class="chrome-reflection"></div>
        </div>
    </div>

    <div class="droplet-controls">
        <button class="drop" on:click={prevImage}></button>
        <button class="drop big" on:click={selectRandomImage}></button>
        <button class="drop" on:click={nextImage}></button>
    </div>
</div>

<style>
    .liquid-metal {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30px;
    }

    .mercury-pool {
        width: 360px;
        height: 300px;
        filter: url("#goo"); /* Requires SVG filter in global or parent, simulating here with CSS */
    }

    .fluid-surface {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #e0e0e0, #9e9e9e);
        border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
        position: relative;
        overflow: hidden;
        box-shadow:
            inset 10px 10px 20px rgba(255, 255, 255, 0.8),
            inset -10px -10px 20px rgba(0, 0, 0, 0.2),
            10px 20px 30px rgba(0, 0, 0, 0.2);
        animation: morph 8s ease-in-out infinite;
    }

    .car-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        position: absolute;
        mix-blend-mode: multiply;
        opacity: 0.7;
        filter: grayscale(100%) contrast(1.2);
    }

    .chrome-reflection {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            45deg,
            transparent 40%,
            rgba(255, 255, 255, 0.8) 45%,
            rgba(255, 255, 255, 0.8) 55%,
            transparent 60%
        );
        background-size: 200% 200%;
        animation: shine 4s ease-in-out infinite;
        pointer-events: none;
    }

    @keyframes morph {
        0%,
        100% {
            border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
        }
        33% {
            border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%;
        }
        66% {
            border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%;
        }
    }

    @keyframes shine {
        0% {
            background-position: 100% 100%;
        }
        100% {
            background-position: 0% 0%;
        }
    }

    .droplet-controls {
        display: flex;
        gap: 20px;
        filter: drop-shadow(0 5px 5px rgba(0, 0, 0, 0.2));
    }

    .drop {
        width: 30px;
        height: 30px;
        background: #e0e0e0;
        border-radius: 50% 0 50% 50%;
        transform: rotate(-45deg);
        border: none;
        cursor: pointer;
        transition: transform 0.2s;
    }
    .drop:hover {
        transform: rotate(-45deg) scale(1.1);
    }

    .drop.big {
        width: 40px;
        height: 40px;
    }
</style>
