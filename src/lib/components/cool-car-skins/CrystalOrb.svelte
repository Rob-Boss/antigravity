<script lang="ts">
    import { createViewerStore } from "$lib/stores/viewerStore";
    import { fade } from "svelte/transition";

    const { currentIndex, images, nextImage, prevImage, selectRandomImage } =
        createViewerStore();
</script>

<div class="crystal-orb">
    <div class="orb">
        <div class="refraction-layer">
            {#key $currentIndex}
                <img
                    src={images[$currentIndex]}
                    alt="Crystal Orb Car"
                    class="car-image"
                    in:fade={{ duration: 500 }}
                    out:fade={{ duration: 500 }}
                />
            {/key}
            <!-- Inverted reflection at bottom -->
            <img
                src={images[$currentIndex]}
                alt=""
                class="car-image inverted"
            />
        </div>
        <div class="specular"></div>
    </div>

    <div class="stand">
        <button class="touch-point" on:click={prevImage}></button>
        <button class="touch-point center" on:click={selectRandomImage}
        ></button>
        <button class="touch-point" on:click={nextImage}></button>
    </div>
</div>

<style>
    .crystal-orb {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }

    .orb {
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: #fff;
        position: relative;
        overflow: hidden;
        box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.1),
            inset 0 0 40px rgba(0, 0, 0, 0.2),
            0 20px 40px rgba(0, 0, 0, 0.3);
    }

    .refraction-layer {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        background: radial-gradient(circle, #fff 0%, #e0f7fa 100%);
    }

    .car-image {
        width: 120%; /* Zoomed in for refraction effect */
        height: 120%;
        object-fit: contain;
        position: absolute;
        transform: scale(1.5); /* Magnify */
    }

    .car-image.inverted {
        transform: scaleY(-1) scale(1.5);
        opacity: 0.3;
        mask-image: linear-gradient(to top, black, transparent);
        bottom: -50%;
    }

    .specular {
        position: absolute;
        top: 10%;
        left: 10%;
        width: 30%;
        height: 20%;
        background: white;
        border-radius: 50%;
        filter: blur(10px);
        opacity: 0.8;
        transform: rotate(-45deg);
    }

    .stand {
        width: 120px;
        height: 20px;
        background: #333;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 15px;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
    }

    .touch-point {
        width: 8px;
        height: 8px;
        background: #666;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        transition: background 0.2s;
    }
    .touch-point:hover {
        background: #fff;
    }
    .touch-point.center {
        width: 10px;
        height: 10px;
        background: #888;
    }
</style>
