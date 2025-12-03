<script lang="ts">
    import { createViewerStore } from "$lib/stores/viewerStore";
    import PixelTransition from "$lib/components/PixelTransition.svelte";

    const { currentIndex, images, nextImage, prevImage, selectRandomImage } =
        createViewerStore();
</script>

<div class="orange-sphere">
    <div class="sphere-body">
        <div class="screen-cutout">
            {#key $currentIndex}
                <PixelTransition
                    src={images[$currentIndex]}
                    alt="Orange Sphere Car"
                />
            {/key}
            <div class="bubble-reflection"></div>
        </div>

        <div class="side-controls">
            <button class="dial" on:click={prevImage}></button>
            <button class="dial big" on:click={selectRandomImage}></button>
            <button class="dial" on:click={nextImage}></button>
        </div>
    </div>

    <div class="tripod-base">
        <div class="leg l"></div>
        <div class="leg m"></div>
        <div class="leg r"></div>
    </div>
</div>

<style>
    .orange-sphere {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .sphere-body {
        width: 300px;
        height: 300px;
        background: #ff7043; /* Retro Orange */
        border-radius: 50%;
        position: relative;
        box-shadow:
            inset -20px -20px 50px rgba(0, 0, 0, 0.2),
            inset 20px 20px 50px rgba(255, 255, 255, 0.4);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2;
    }

    .screen-cutout {
        width: 220px;
        height: 220px;
        background: #222;
        border-radius: 40%;
        overflow: hidden;
        position: relative;
        border: 10px solid #d84315;
        box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
    }

    .bubble-reflection {
        position: absolute;
        top: 20%;
        left: 20%;
        width: 40px;
        height: 20px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        transform: rotate(-45deg);
        filter: blur(4px);
        pointer-events: none;
    }

    .side-controls {
        position: absolute;
        right: -15px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        gap: 10px;
        background: #d84315;
        padding: 10px 5px;
        border-radius: 20px;
    }

    .dial {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #ffccbc;
        border: none;
        cursor: pointer;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    }
    .dial.big {
        width: 40px;
        height: 40px;
        background: #fff;
    }

    .tripod-base {
        position: relative;
        width: 200px;
        height: 60px;
        margin-top: -30px;
        z-index: 1;
    }

    .leg {
        position: absolute;
        top: 0;
        width: 20px;
        height: 60px;
        background: #5d4037;
        border-radius: 10px;
    }
    .leg.l {
        left: 20px;
        transform: rotate(30deg);
    }
    .leg.m {
        left: 90px;
        height: 50px;
    }
    .leg.r {
        right: 20px;
        transform: rotate(-30deg);
    }
</style>
