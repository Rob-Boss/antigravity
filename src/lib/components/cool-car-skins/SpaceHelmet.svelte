<script lang="ts">
    import { createViewerStore } from "$lib/stores/viewerStore";
    import PixelTransition from "$lib/components/PixelTransition.svelte";

    const { currentIndex, images, nextImage, prevImage, selectRandomImage } =
        createViewerStore();
</script>

<div class="space-helmet">
    <div class="helmet-shell">
        <div class="visor-area">
            {#key $currentIndex}
                <PixelTransition
                    src={images[$currentIndex]}
                    alt="Space Helmet Car"
                />
            {/key}
            <div class="visor-reflection"></div>
        </div>

        <div class="chin-guard">
            <button class="pill-btn" on:click={prevImage}></button>
            <button class="pill-btn red" on:click={selectRandomImage}></button>
            <button class="pill-btn" on:click={nextImage}></button>
        </div>
    </div>
</div>

<style>
    .space-helmet {
        display: flex;
        justify-content: center;
    }

    .helmet-shell {
        width: 300px;
        height: 320px;
        background: #fff;
        border-radius: 120px 120px 80px 80px;
        padding: 15px;
        box-shadow:
            0 20px 40px rgba(0, 0, 0, 0.1),
            inset 0 -10px 20px rgba(0, 0, 0, 0.05);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .visor-area {
        width: 260px;
        height: 180px;
        background: #222;
        border-radius: 100px 100px 20px 20px;
        overflow: hidden;
        position: relative;
        border: 5px solid #eceff1;
        box-shadow: inset 0 0 30px #000;
    }

    .visor-reflection {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 50%;
        background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.2),
            transparent
        );
        border-radius: 100px 100px 0 0;
        pointer-events: none;
    }

    .chin-guard {
        width: 200px;
        height: 60px;
        background: #cfd8dc;
        border-radius: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 15px;
        box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .pill-btn {
        width: 40px;
        height: 20px;
        border-radius: 10px;
        background: #90a4ae;
        border: none;
        cursor: pointer;
        transition: background 0.2s;
    }
    .pill-btn:hover {
        background: #78909c;
    }
    .pill-btn.red {
        background: #ff7043;
        width: 50px;
    }
    .pill-btn.red:hover {
        background: #f4511e;
    }
</style>
