<script lang="ts">
    import { createViewerStore } from "$lib/stores/viewerStore";
    import PixelTransition from "$lib/components/PixelTransition.svelte";

    const { currentIndex, images, nextImage, prevImage, selectRandomImage } =
        createViewerStore();
</script>

<div class="yellow-cube">
    <div class="cube-body">
        <div class="screen-frame">
            {#key $currentIndex}
                <PixelTransition
                    src={images[$currentIndex]}
                    alt="Yellow Cube Car"
                />
            {/key}
            <div class="scan-lines"></div>
        </div>

        <div class="control-panel">
            <div class="speaker-holes">
                {#each Array(12) as _}
                    <div class="hole"></div>
                {/each}
            </div>
            <div class="buttons">
                <button class="sq-btn" on:click={prevImage}></button>
                <button class="sq-btn red" on:click={selectRandomImage}
                ></button>
                <button class="sq-btn" on:click={nextImage}></button>
            </div>
        </div>
    </div>
</div>

<style>
    .yellow-cube {
        display: flex;
        justify-content: center;
        perspective: 800px;
    }

    .cube-body {
        width: 280px;
        height: 340px;
        background: #fdd835; /* Retro Yellow */
        border-radius: 20px;
        padding: 20px;
        box-shadow:
            15px 15px 0 rgba(0, 0, 0, 0.1),
            inset 5px 5px 10px rgba(255, 255, 255, 0.4);
        display: flex;
        flex-direction: column;
        gap: 20px;
        transform: rotateY(-10deg);
    }

    .screen-frame {
        width: 100%;
        height: 200px;
        background: #222;
        border-radius: 10px;
        border: 4px solid #fbc02d;
        overflow: hidden;
        position: relative;
    }

    .scan-lines {
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.2) 3px
        );
        pointer-events: none;
    }

    .control-panel {
        flex: 1;
        background: #fff9c4;
        border-radius: 10px;
        padding: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .speaker-holes {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 5px;
    }

    .hole {
        width: 6px;
        height: 6px;
        background: #fbc02d;
        border-radius: 50%;
    }

    .buttons {
        display: flex;
        justify-content: space-around;
    }

    .sq-btn {
        width: 40px;
        height: 40px;
        background: #e0e0e0;
        border: 2px solid #bdbdbd;
        border-radius: 5px;
        cursor: pointer;
        box-shadow: 0 4px 0 #9e9e9e;
        transition:
            transform 0.1s,
            box-shadow 0.1s;
    }
    .sq-btn:active {
        transform: translateY(4px);
        box-shadow: 0 0 0 #9e9e9e;
    }
    .sq-btn.red {
        background: #ef5350;
        border-color: #d32f2f;
        box-shadow: 0 4px 0 #b71c1c;
    }
    .sq-btn.red:active {
        box-shadow: 0 0 0 #b71c1c;
    }
</style>
