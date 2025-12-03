<script lang="ts">
    import { createViewerStore } from "$lib/stores/viewerStore";
    import { fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";

    const {
        currentIndex,
        direction,
        images,
        nextImage,
        prevImage,
        selectRandomImage,
    } = createViewerStore();
</script>

<div class="retro-tv-refined">
    <div class="crt-monitor">
        <div class="screen-glass">
            {#key $currentIndex}
                <img
                    src={images[$currentIndex]}
                    alt="Retro TV Car"
                    class="car-image"
                    in:fly={{
                        x: 200 * $direction,
                        duration: 400,
                        easing: cubicOut,
                    }}
                    out:fly={{
                        x: -200 * $direction,
                        duration: 400,
                        easing: cubicOut,
                    }}
                />
            {/key}
            <div class="scanlines"></div>
            <div class="phosphor-glow"></div>
            <div class="reflection"></div>
        </div>

        <div class="simple-controls">
            <button class="knob" on:click={prevImage}></button>
            <button class="knob big" on:click={selectRandomImage}></button>
            <button class="knob" on:click={nextImage}></button>
        </div>
    </div>
</div>

<style>
    .retro-tv-refined {
        display: flex;
        justify-content: center;
        perspective: 1000px;
    }

    .crt-monitor {
        width: 380px;
        background: #222;
        padding: 20px;
        border-radius: 30px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .screen-glass {
        width: 100%;
        height: 280px;
        background: #111;
        border-radius: 50% / 10%; /* Strong horizontal curve */
        position: relative;
        overflow: hidden;
        box-shadow:
            inset 0 0 20px rgba(0, 0, 0, 0.8),
            0 0 0 4px #333;
        transform: scale(1.02); /* Slight bulge */
    }

    .car-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        position: absolute;
        filter: contrast(1.2) brightness(1.1) saturate(1.2);
    }

    .scanlines {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0) 50%,
            rgba(0, 0, 0, 0.2) 50%,
            rgba(0, 0, 0, 0.2)
        );
        background-size: 100% 4px;
        pointer-events: none;
        z-index: 10;
    }

    .phosphor-glow {
        position: absolute;
        inset: 0;
        background: radial-gradient(
            circle,
            transparent 60%,
            rgba(0, 255, 0, 0.05) 100%
        );
        pointer-events: none;
        z-index: 11;
        mix-blend-mode: screen;
    }

    .reflection {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 50%;
        background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.1),
            transparent
        );
        border-radius: 50% / 20%;
        pointer-events: none;
        z-index: 12;
    }

    .simple-controls {
        display: flex;
        gap: 20px;
        align-items: center;
    }

    .knob {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #444;
        border: none;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        cursor: pointer;
        transition: transform 0.1s;
    }

    .knob:active {
        transform: scale(0.9);
    }

    .knob.big {
        width: 30px;
        height: 30px;
        background: #d32f2f;
    }
</style>
