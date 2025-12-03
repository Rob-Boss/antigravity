<script lang="ts">
    import { createViewerStore } from "$lib/stores/viewerStore";
    import PixelTransition from "$lib/components/PixelTransition.svelte";

    const { currentIndex, images, nextImage, prevImage, selectRandomImage } =
        createViewerStore();
</script>

<div class="divoom-pc">
    <div class="monitor-casing">
        <div class="screen-bezel">
            <div class="screen-pixel-grid">
                {#key $currentIndex}
                    <PixelTransition
                        src={images[$currentIndex]}
                        alt="Retro PC Car"
                    />
                {/key}
                <div class="grid-overlay"></div>
            </div>
        </div>
    </div>

    <div class="keyboard-base">
        <div class="keys-row">
            <button class="mech-key" on:click={prevImage}>
                <span class="key-cap">&lt;</span>
            </button>
            <button class="mech-key gold" on:click={selectRandomImage}>
                <span class="key-cap">RND</span>
            </button>
            <button class="mech-key" on:click={nextImage}>
                <span class="key-cap">&gt;</span>
            </button>
        </div>
        <div class="joystick"></div>
    </div>
</div>

<style>
    .divoom-pc {
        display: flex;
        flex-direction: column;
        align-items: center;
        perspective: 1000px;
    }

    .monitor-casing {
        width: 300px;
        height: 260px;
        background: #81c784; /* Retro Green */
        border-radius: 40px;
        padding: 20px;
        box-shadow:
            0 10px 0 #558b2f,
            0 20px 20px rgba(0, 0, 0, 0.2);
        position: relative;
        z-index: 2;
    }

    .screen-bezel {
        width: 100%;
        height: 100%;
        background: #000;
        border-radius: 25px;
        padding: 15px;
        box-sizing: border-box;
        box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.1);
    }

    .screen-pixel-grid {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        border-radius: 15px;
    }

    .grid-overlay {
        position: absolute;
        inset: 0;
        background-image: linear-gradient(
                rgba(0, 0, 0, 0.1) 1px,
                transparent 1px
            ),
            linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
        background-size: 4px 4px;
        pointer-events: none;
        box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
    }

    .keyboard-base {
        width: 320px;
        height: 100px;
        background: #66bb6a;
        border-radius: 0 0 40px 40px;
        margin-top: -20px;
        padding-top: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        box-shadow:
            0 10px 0 #33691e,
            0 20px 30px rgba(0, 0, 0, 0.3);
        transform: rotateX(10deg);
        position: relative;
        z-index: 1;
    }

    .keys-row {
        display: flex;
        gap: 15px;
    }

    .mech-key {
        width: 50px;
        height: 50px;
        background: #a5d6a7;
        border: none;
        border-radius: 10px;
        box-shadow:
            0 6px 0 #558b2f,
            0 10px 10px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        position: relative;
        transition:
            transform 0.1s,
            box-shadow 0.1s;
    }

    .mech-key:active {
        transform: translateY(6px);
        box-shadow:
            0 0 0 #558b2f,
            inset 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    .mech-key.gold {
        background: #fdd835;
        box-shadow: 0 6px 0 #f9a825;
    }
    .mech-key.gold:active {
        box-shadow: 0 0 0 #f9a825;
    }

    .key-cap {
        font-family: monospace;
        font-weight: bold;
        color: #1b5e20;
        font-size: 1.2rem;
    }

    .joystick {
        width: 15px;
        height: 40px;
        background: linear-gradient(to right, #d4af37, #fdd835, #d4af37);
        border-radius: 5px;
        position: absolute;
        right: 30px;
        top: 30px;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
    }
    .joystick::before {
        content: "";
        position: absolute;
        top: -10px;
        left: -7px;
        width: 30px;
        height: 30px;
        background: radial-gradient(circle at 30% 30%, #fff, #d4af37);
        border-radius: 50%;
    }
</style>
