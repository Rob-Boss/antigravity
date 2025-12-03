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

<div class="minimal-frame">
    <div class="canvas">
        {#key $currentIndex}
            <img
                src={images[$currentIndex]}
                alt="Minimal Car"
                class="car-image"
                in:fade={{ duration: 600 }}
                out:fade={{ duration: 600 }}
            />
        {/key}

        <div class="hover-controls">
            <button class="min-btn left" on:click={prevImage}>
                <svg viewBox="0 0 24 24" width="24" height="24"
                    ><path
                        d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
                    /></svg
                >
            </button>

            <div class="center-actions">
                <span class="counter"
                    >{$currentIndex + 1} / {images.length}</span
                >
                <button class="min-btn random" on:click={selectRandomImage}>
                    <svg viewBox="0 0 24 24" width="20" height="20"
                        ><path
                            d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"
                        /></svg
                    >
                </button>
            </div>

            <button class="min-btn right" on:click={nextImage}>
                <svg viewBox="0 0 24 24" width="24" height="24"
                    ><path
                        d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
                    /></svg
                >
            </button>
        </div>
    </div>
</div>

<style>
    .minimal-frame {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .canvas {
        width: 500px;
        height: 350px;
        background: #fff;
        position: relative;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
        border-radius: 4px;
        overflow: hidden;
        transition: box-shadow 0.3s;
    }

    .canvas:hover {
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    }

    .car-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        position: absolute;
        padding: 40px;
        box-sizing: border-box;
    }

    .hover-controls {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(
            to top,
            rgba(255, 255, 255, 0.9),
            transparent
        );
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
    }

    .canvas:hover .hover-controls {
        opacity: 1;
        transform: translateY(0);
    }

    .min-btn {
        background: rgba(0, 0, 0, 0.05);
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: background 0.2s;
        fill: #333;
    }

    .min-btn:hover {
        background: rgba(0, 0, 0, 0.1);
    }

    .center-actions {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .counter {
        font-family: "Helvetica Neue", sans-serif;
        font-size: 12px;
        color: #999;
        letter-spacing: 1px;
    }
</style>
