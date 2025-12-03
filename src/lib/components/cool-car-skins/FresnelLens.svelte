<script lang="ts">
    import { createViewerStore } from "$lib/stores/viewerStore";
    import { fade } from "svelte/transition";

    const { currentIndex, images, nextImage, prevImage, selectRandomImage } =
        createViewerStore();
</script>

<div class="fresnel-lens">
    <div class="lens-frame">
        <div class="lens-glass">
            {#key $currentIndex}
                <img
                    src={images[$currentIndex]}
                    alt="Fresnel Car"
                    class="car-image"
                    in:fade={{ duration: 300 }}
                    out:fade={{ duration: 300 }}
                />
            {/key}
            <div class="fresnel-rings"></div>
        </div>
        <div class="handle"></div>
    </div>

    <div class="simple-controls">
        <button class="lens-btn" on:click={prevImage}>&larr;</button>
        <button class="lens-btn rnd" on:click={selectRandomImage}>?</button>
        <button class="lens-btn" on:click={nextImage}>&rarr;</button>
    </div>
</div>

<style>
    .fresnel-lens {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .lens-frame {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .lens-glass {
        width: 340px;
        height: 340px;
        border-radius: 50%;
        background: #fff;
        position: relative;
        overflow: hidden;
        border: 10px solid #e0e0e0;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }

    .car-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        position: absolute;
        transform: scale(1.4); /* Magnified */
    }

    .fresnel-rings {
        position: absolute;
        inset: 0;
        background: repeating-radial-gradient(
            circle,
            transparent,
            transparent 10px,
            rgba(0, 0, 0, 0.03) 11px,
            rgba(255, 255, 255, 0.1) 12px
        );
        pointer-events: none;
        border-radius: 50%;
    }

    .handle {
        width: 20px;
        height: 80px;
        background: #e0e0e0;
        margin-top: -5px;
        border-radius: 0 0 10px 10px;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    }

    .simple-controls {
        display: flex;
        gap: 10px;
    }

    .lens-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #f5f5f5;
        border: 1px solid #ddd;
        cursor: pointer;
        font-size: 18px;
        color: #555;
        transition: background 0.2s;
    }
    .lens-btn:hover {
        background: #fff;
    }
    .lens-btn.rnd {
        font-weight: bold;
        color: #333;
    }
</style>
