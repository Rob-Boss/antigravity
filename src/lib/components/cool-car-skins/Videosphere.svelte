<script lang="ts">
    import { createViewerStore } from "$lib/stores/viewerStore";
    import PixelTransition from "$lib/components/PixelTransition.svelte";

    const { currentIndex, images, nextImage, prevImage, selectRandomImage } =
        createViewerStore();
</script>

<div class="videosphere">
    <div class="helmet-body">
        <div class="antenna-left"></div>
        <div class="antenna-right"></div>

        <div class="visor-glass">
            <div class="screen-curve">
                {#key $currentIndex}
                    <PixelTransition
                        src={images[$currentIndex]}
                        alt="Videosphere Car"
                    />
                {/key}
                <div class="reflection-highlight"></div>
            </div>
        </div>

        <div class="top-controls">
            <button class="round-btn" on:click={prevImage}></button>
            <button class="round-btn" on:click={selectRandomImage}></button>
            <button class="round-btn" on:click={nextImage}></button>
        </div>
    </div>

    <div class="base-stand"></div>
</div>

<style>
    .videosphere {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }

    .helmet-body {
        width: 320px;
        height: 320px;
        background: #42a5f5; /* Retro Blue */
        border-radius: 45% 45% 50% 50% / 50% 50% 45% 45%; /* Organic blob shape */
        position: relative;
        box-shadow:
            inset -10px -10px 30px rgba(0, 0, 0, 0.2),
            inset 10px 10px 30px rgba(255, 255, 255, 0.4),
            0 20px 40px rgba(0, 0, 0, 0.3);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2;
    }

    .visor-glass {
        width: 240px;
        height: 200px;
        background: #111;
        border-radius: 50% 50% 40% 40% / 60% 60% 40% 40%;
        border: 8px solid #1e88e5;
        overflow: hidden;
        position: relative;
        box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
        margin-top: 20px;
    }

    .screen-curve {
        width: 100%;
        height: 100%;
        border-radius: 50% / 10%;
        overflow: hidden;
        position: relative;
    }

    .reflection-highlight {
        position: absolute;
        top: 10%;
        right: 10%;
        width: 60px;
        height: 100px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        transform: rotate(20deg);
        filter: blur(5px);
        pointer-events: none;
    }

    .antenna-left,
    .antenna-right {
        position: absolute;
        top: -40px;
        width: 6px;
        height: 60px;
        background: #90caf9;
        border-radius: 3px;
        transform-origin: bottom center;
    }
    .antenna-left {
        left: 80px;
        transform: rotate(-20deg);
    }
    .antenna-right {
        right: 80px;
        transform: rotate(20deg);
    }

    .top-controls {
        position: absolute;
        top: 20px;
        display: flex;
        gap: 20px;
    }

    .round-btn {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #e3f2fd;
        border: none;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        transition: transform 0.1s;
    }
    .round-btn:active {
        transform: scale(0.9);
    }

    .base-stand {
        width: 180px;
        height: 40px;
        background: #1e88e5;
        border-radius: 50%;
        margin-top: -20px;
        z-index: 1;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    }
</style>
