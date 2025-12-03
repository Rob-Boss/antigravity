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

<div class="sketch-pad">
    <div class="paper-sheet">
        <div class="tape top"></div>

        <div class="drawing-area">
            {#key $currentIndex}
                <img
                    src={images[$currentIndex]}
                    alt="Sketch Car"
                    class="car-image"
                    in:fade={{ duration: 200 }}
                    out:fade={{ duration: 200 }}
                />
            {/key}
            <div class="scribble-overlay"></div>
        </div>

        <div class="doodle-controls">
            <button class="arrow-doodle left" on:click={prevImage}> ← </button>
            <button class="random-doodle" on:click={selectRandomImage}>
                ?
            </button>
            <button class="arrow-doodle right" on:click={nextImage}> → </button>
        </div>

        <div class="pencil-mark">Fig. {$currentIndex + 1}</div>
    </div>
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap");

    .sketch-pad {
        display: flex;
        justify-content: center;
        font-family: "Indie Flower", cursive;
    }

    .paper-sheet {
        background: #fff9c4;
        width: 400px;
        padding: 40px;
        box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.1);
        position: relative;
        transform: rotate(-2deg);
    }

    .tape {
        position: absolute;
        top: -15px;
        left: 50%;
        transform: translateX(-50%) rotate(2deg);
        width: 100px;
        height: 30px;
        background: rgba(255, 255, 255, 0.6);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .drawing-area {
        border: 3px solid #333;
        border-radius: 2px 255px 3px 25px / 255px 5px 225px 3px; /* Rough border */
        height: 250px;
        position: relative;
        overflow: hidden;
        background: #fff;
        margin-bottom: 20px;
    }

    .car-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        position: absolute;
        filter: grayscale(100%) contrast(1.5) brightness(1.1);
        mix-blend-mode: multiply;
    }

    .scribble-overlay {
        position: absolute;
        inset: 0;
        background-image: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(0, 0, 0, 0.05) 10px,
            rgba(0, 0, 0, 0.05) 12px
        );
        pointer-events: none;
    }

    .doodle-controls {
        display: flex;
        justify-content: center;
        gap: 30px;
        align-items: center;
    }

    .arrow-doodle {
        background: none;
        border: 2px solid #333;
        border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
        font-family: "Indie Flower", cursive;
        font-size: 30px;
        cursor: pointer;
        width: 50px;
        height: 50px;
        transition: transform 0.1s;
    }

    .arrow-doodle:hover {
        transform: scale(1.1) rotate(-5deg);
    }

    .random-doodle {
        background: none;
        border: 2px dashed #333;
        border-radius: 50%;
        font-family: "Indie Flower", cursive;
        font-size: 24px;
        font-weight: bold;
        width: 40px;
        height: 40px;
        cursor: pointer;
    }

    .random-doodle:hover {
        transform: rotate(10deg);
        background: rgba(0, 0, 0, 0.05);
    }

    .pencil-mark {
        position: absolute;
        bottom: 10px;
        right: 20px;
        font-size: 18px;
        color: #555;
        transform: rotate(-5deg);
    }
</style>
