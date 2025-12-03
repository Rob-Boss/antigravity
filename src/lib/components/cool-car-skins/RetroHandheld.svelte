<script lang="ts">
    import { createViewerStore } from "$lib/stores/viewerStore";
    import { fly } from "svelte/transition";
    import { linear } from "svelte/easing";

    const {
        currentIndex,
        direction,
        images,
        nextImage,
        prevImage,
        selectRandomImage,
    } = createViewerStore();
</script>

<div class="retro-handheld">
    <div class="case">
        <div class="screen-lens">
            <div class="power-led"></div>
            <div class="screen-lcd">
                {#key $currentIndex}
                    <img
                        src={images[$currentIndex]}
                        alt="Handheld Car"
                        class="car-image"
                        in:fly={{ x: 100 * $direction, duration: 0 }}
                    />
                {/key}
                <div class="pixel-grid"></div>
            </div>
            <span class="brand">NINTENDO</span>
        </div>

        <div class="controls-area">
            <div class="d-pad">
                <button class="d-btn up"></button>
                <button class="d-btn right" on:click={nextImage}></button>
                <button class="d-btn down"></button>
                <button class="d-btn left" on:click={prevImage}></button>
                <div class="d-center"></div>
            </div>

            <div class="action-btns">
                <div class="btn-wrapper">
                    <button class="round-btn b" on:click={selectRandomImage}
                    ></button>
                    <span class="btn-label">B</span>
                </div>
                <div class="btn-wrapper">
                    <button class="round-btn a" on:click={nextImage}></button>
                    <span class="btn-label">A</span>
                </div>
            </div>
        </div>

        <div class="start-select">
            <div class="pill-btn"></div>
            <div class="pill-btn"></div>
        </div>

        <div class="speaker-slots">
            <div class="slot"></div>
            <div class="slot"></div>
            <div class="slot"></div>
            <div class="slot"></div>
            <div class="slot"></div>
            <div class="slot"></div>
        </div>
    </div>
</div>

<style>
    .retro-handheld {
        display: flex;
        justify-content: center;
    }

    .case {
        width: 320px;
        height: 520px;
        background: #c0c0c0; /* Classic Grey */
        border-radius: 10px 10px 40px 10px;
        padding: 30px 20px;
        box-shadow:
            inset -5px -5px 10px rgba(0, 0, 0, 0.1),
            5px 5px 15px rgba(0, 0, 0, 0.2);
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .screen-lens {
        background: #777;
        width: 280px;
        height: 220px;
        border-radius: 10px 10px 30px 10px;
        padding: 30px 40px;
        box-sizing: border-box;
        position: relative;
        box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.3);
        margin-bottom: 40px;
    }

    .power-led {
        position: absolute;
        top: 100px;
        left: 10px;
        width: 8px;
        height: 8px;
        background: #f00;
        border-radius: 50%;
        box-shadow: 0 0 2px #f00;
    }

    .screen-lcd {
        width: 100%;
        height: 100%;
        background: #9ca04c; /* Pea soup green */
        box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.4);
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .car-image {
        width: 90%;
        height: 90%;
        object-fit: contain;
        position: absolute;
        filter: grayscale(100%) contrast(1.5) brightness(0.9);
        mix-blend-mode: multiply;
    }

    .pixel-grid {
        position: absolute;
        inset: 0;
        background-image: linear-gradient(
                transparent 2px,
                rgba(0, 0, 0, 0.1) 2px
            ),
            linear-gradient(90deg, transparent 2px, rgba(0, 0, 0, 0.1) 2px);
        background-size: 3px 3px;
        pointer-events: none;
    }

    .brand {
        position: absolute;
        bottom: 10px;
        left: 20px;
        color: #ccc;
        font-family: sans-serif;
        font-style: italic;
        font-weight: bold;
        font-size: 12px;
    }

    .controls-area {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        margin-bottom: 30px;
    }

    .d-pad {
        position: relative;
        width: 90px;
        height: 90px;
    }

    .d-btn {
        position: absolute;
        background: #333;
        border: none;
        cursor: pointer;
        width: 30px;
        height: 30px;
    }
    .d-btn:active {
        background: #222;
    }

    .d-btn.up {
        top: 0;
        left: 30px;
        border-radius: 3px 3px 0 0;
    }
    .d-btn.right {
        top: 30px;
        right: 0;
        border-radius: 0 3px 3px 0;
    }
    .d-btn.down {
        bottom: 0;
        left: 30px;
        border-radius: 0 0 3px 3px;
    }
    .d-btn.left {
        top: 30px;
        left: 0;
        border-radius: 3px 0 0 3px;
    }

    .d-center {
        position: absolute;
        top: 30px;
        left: 30px;
        width: 30px;
        height: 30px;
        background: #333;
    }
    .d-center::after {
        content: "";
        position: absolute;
        top: 5px;
        left: 5px;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, #222 20%, transparent 25%);
        background-size: 4px 4px;
    }

    .action-btns {
        display: flex;
        gap: 15px;
        transform: rotate(-25deg);
        margin-top: 20px;
    }

    .btn-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
    }

    .round-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #a02040; /* Maroon */
        border: none;
        box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        cursor: pointer;
    }
    .round-btn:active {
        box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.5);
    }

    .btn-label {
        font-family: sans-serif;
        font-weight: bold;
        color: #333;
        font-size: 14px;
    }

    .start-select {
        display: flex;
        gap: 15px;
        margin-bottom: 40px;
    }

    .pill-btn {
        width: 50px;
        height: 12px;
        background: #999;
        border-radius: 6px;
        transform: rotate(-25deg);
        border: 1px solid #888;
    }

    .speaker-slots {
        position: absolute;
        bottom: 30px;
        right: 30px;
        transform: rotate(-25deg);
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 6px;
    }

    .slot {
        width: 6px;
        height: 40px;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 3px;
    }
</style>
