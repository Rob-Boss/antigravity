<script lang="ts">
    import { createViewerStore } from "$lib/stores/viewerStore";
    import PixelTransition from "$lib/components/PixelTransition.svelte";

    const { currentIndex, images, nextImage, prevImage, selectRandomImage } =
        createViewerStore();
</script>

<div class="clear-tech">
    <div class="clear-case">
        <div class="circuit-board-bg"></div>

        <div class="screen-component">
            {#key $currentIndex}
                <PixelTransition
                    src={images[$currentIndex]}
                    alt="Clear Tech Car"
                />
            {/key}
        </div>

        <div class="controls-cluster">
            <button class="clear-btn" on:click={prevImage}>&lt;</button>
            <button class="clear-btn rnd" on:click={selectRandomImage}>R</button
            >
            <button class="clear-btn" on:click={nextImage}>&gt;</button>
        </div>
    </div>
</div>

<style>
    .clear-tech {
        display: flex;
        justify-content: center;
    }

    .clear-case {
        width: 320px;
        height: 320px;
        background: rgba(255, 255, 255, 0.2);
        border: 2px solid rgba(255, 255, 255, 0.4);
        border-radius: 20px;
        padding: 20px;
        position: relative;
        backdrop-filter: blur(5px);
        box-shadow:
            0 10px 30px rgba(0, 0, 0, 0.1),
            inset 0 0 20px rgba(255, 255, 255, 0.2);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .circuit-board-bg {
        position: absolute;
        inset: 0;
        background-image: linear-gradient(
                rgba(0, 100, 0, 0.1) 1px,
                transparent 1px
            ),
            linear-gradient(90deg, rgba(0, 100, 0, 0.1) 1px, transparent 1px);
        background-size: 20px 20px;
        z-index: -1;
        border-radius: 18px;
    }

    .screen-component {
        width: 260px;
        height: 200px;
        background: #000;
        border: 4px solid #444;
        border-radius: 5px;
        overflow: hidden;
    }

    .controls-cluster {
        display: flex;
        gap: 15px;
        background: rgba(0, 0, 0, 0.1);
        padding: 10px;
        border-radius: 15px;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .clear-btn {
        width: 40px;
        height: 40px;
        background: rgba(100, 0, 255, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        color: #fff;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.2s;
    }
    .clear-btn:hover {
        background: rgba(100, 0, 255, 0.5);
    }
    .clear-btn.rnd {
        background: rgba(255, 0, 100, 0.3);
    }
    .clear-btn.rnd:hover {
        background: rgba(255, 0, 100, 0.5);
    }
</style>
