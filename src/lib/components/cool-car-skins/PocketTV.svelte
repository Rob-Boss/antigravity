<script lang="ts">
    import { createViewerStore } from "$lib/stores/viewerStore";
    import PixelTransition from "$lib/components/PixelTransition.svelte";

    const { currentIndex, images, nextImage, prevImage, selectRandomImage } =
        createViewerStore();
</script>

<div class="pocket-tv">
    <div class="handheld-body">
        <div class="antenna"></div>
        <div class="screen-recess">
            {#key $currentIndex}
                <PixelTransition
                    src={images[$currentIndex]}
                    alt="Pocket TV Car"
                />
            {/key}
            <div class="lcd-shadow"></div>
        </div>

        <div class="controls-area">
            <div class="d-pad">
                <button class="d-btn left" on:click={prevImage}></button>
                <button class="d-btn right" on:click={nextImage}></button>
            </div>
            <div class="action-btn">
                <button class="a-btn" on:click={selectRandomImage}></button>
            </div>
        </div>

        <div class="speaker-grill">
            <span>||||||</span>
        </div>
    </div>
</div>

<style>
    .pocket-tv {
        display: flex;
        justify-content: center;
    }

    .handheld-body {
        width: 240px;
        height: 360px;
        background: #d32f2f; /* Retro Red */
        border-radius: 20px 20px 40px 40px;
        padding: 20px;
        position: relative;
        box-shadow:
            5px 5px 0 #b71c1c,
            10px 10px 20px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .antenna {
        position: absolute;
        top: -60px;
        right: 30px;
        width: 8px;
        height: 80px;
        background: #90a4ae;
        border-radius: 4px;
        z-index: -1;
    }
    .antenna::after {
        content: "";
        position: absolute;
        top: -10px;
        left: -3px;
        width: 14px;
        height: 14px;
        background: #cfd8dc;
        border-radius: 50%;
    }

    .screen-recess {
        width: 100%;
        height: 180px;
        background: #9e9e9e;
        border-radius: 10px;
        padding: 10px;
        box-sizing: border-box;
        box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.3);
    }

    .lcd-shadow {
        position: absolute;
        inset: 0;
        box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
        pointer-events: none;
    }

    .controls-area {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
    }

    .d-pad {
        width: 80px;
        height: 80px;
        position: relative;
    }

    .d-btn {
        position: absolute;
        width: 30px;
        height: 30px;
        background: #212121;
        border: none;
        cursor: pointer;
    }
    .d-btn.left {
        top: 25px;
        left: 0;
        border-radius: 5px 0 0 5px;
    }
    .d-btn.right {
        top: 25px;
        right: 0;
        border-radius: 0 5px 5px 0;
    }
    .d-btn:active {
        background: #424242;
    }

    /* Center piece of D-pad */
    .d-pad::after {
        content: "";
        position: absolute;
        top: 25px;
        left: 30px;
        width: 20px;
        height: 30px;
        background: #212121;
    }

    .a-btn {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #fdd835;
        border: 4px solid #f9a825;
        cursor: pointer;
        box-shadow: 0 4px 0 rgba(0, 0, 0, 0.2);
    }
    .a-btn:active {
        transform: translateY(4px);
        box-shadow: none;
    }

    .speaker-grill {
        text-align: right;
        color: rgba(0, 0, 0, 0.2);
        font-weight: 900;
        font-size: 24px;
        letter-spacing: -2px;
        transform: rotate(-10deg);
        margin-top: -10px;
    }
</style>
