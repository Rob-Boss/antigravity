<script lang="ts">
    import { createViewerStore } from "$lib/stores/viewerStore";
    import PixelTransition from "$lib/components/PixelTransition.svelte";

    const { currentIndex, images, nextImage, prevImage, selectRandomImage } =
        createViewerStore();
</script>

<div class="monolith">
    <div class="slab-body">
        <div class="screen-surface">
            {#key $currentIndex}
                <PixelTransition
                    src={images[$currentIndex]}
                    alt="Monolith Car"
                />
            {/key}
            <div class="gloss-overlay"></div>
        </div>

        <div class="touch-bar">
            <button class="led-dot" on:click={prevImage}></button>
            <button class="led-dot center" on:click={selectRandomImage}
            ></button>
            <button class="led-dot" on:click={nextImage}></button>
        </div>
    </div>
</div>

<style>
    .monolith {
        display: flex;
        justify-content: center;
    }

    .slab-body {
        width: 260px;
        height: 400px;
        background: #111;
        border-radius: 5px;
        padding: 20px;
        box-shadow:
            0 30px 60px rgba(0, 0, 0, 0.5),
            0 0 0 1px #333;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .screen-surface {
        width: 100%;
        height: 300px;
        background: #000;
        position: relative;
        overflow: hidden;
    }

    .gloss-overlay {
        position: absolute;
        top: 0;
        right: 0;
        width: 50%;
        height: 100%;
        background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.05)
        );
        pointer-events: none;
    }

    .touch-bar {
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 40px;
        border-top: 1px solid #333;
    }

    .led-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #333;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 0 0 rgba(255, 0, 0, 0);
    }

    .led-dot:hover {
        background: #f00;
        box-shadow: 0 0 10px #f00;
    }

    .led-dot.center {
        width: 8px;
        height: 8px;
    }
</style>
