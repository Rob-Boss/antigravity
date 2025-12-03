<script lang="ts">
    import { createViewerStore } from "$lib/stores/viewerStore";
    import { fade } from "svelte/transition";

    const { currentIndex, images, nextImage, prevImage, selectRandomImage } =
        createViewerStore();
</script>

<div class="fishbowl">
    <div class="bowl-glass">
        <div class="water">
            {#key $currentIndex}
                <img
                    src={images[$currentIndex]}
                    alt="Fishbowl Car"
                    class="car-image"
                    in:fade={{ duration: 800 }}
                    out:fade={{ duration: 800 }}
                />
            {/key}
            <div class="bubbles">
                <div class="bubble b1"></div>
                <div class="bubble b2"></div>
                <div class="bubble b3"></div>
            </div>
            <div class="surface-line"></div>
        </div>
        <div class="glass-highlight"></div>
    </div>

    <div class="base-controls">
        <button class="pebble" on:click={prevImage}></button>
        <button class="pebble big" on:click={selectRandomImage}></button>
        <button class="pebble" on:click={nextImage}></button>
    </div>
</div>

<style>
    .fishbowl {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .bowl-glass {
        width: 350px;
        height: 350px;
        border-radius: 50%;
        background: radial-gradient(
            circle at 70% 30%,
            rgba(255, 255, 255, 0.1),
            rgba(0, 100, 255, 0.1)
        );
        border: 2px solid rgba(255, 255, 255, 0.3);
        box-shadow:
            inset 0 0 30px rgba(0, 100, 255, 0.2),
            0 20px 30px rgba(0, 0, 0, 0.1);
        position: relative;
        overflow: hidden;
        transform: perspective(800px) rotateX(5deg);
    }

    .water {
        position: absolute;
        bottom: 20px;
        left: 20px;
        right: 20px;
        top: 60px;
        border-radius: 40% 40% 50% 50%;
        background: linear-gradient(
            to bottom,
            rgba(0, 200, 255, 0.1),
            rgba(0, 100, 255, 0.2)
        );
        overflow: hidden;
        animation: wobble 5s ease-in-out infinite;
    }

    .car-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        position: absolute;
        filter: blur(0.5px);
        transform: scale(0.9);
    }

    .surface-line {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 20px;
        border-bottom: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
    }

    .glass-highlight {
        position: absolute;
        top: 15%;
        right: 15%;
        width: 20px;
        height: 10px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        transform: rotate(-45deg);
        filter: blur(2px);
    }

    .bubbles .bubble {
        position: absolute;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 50%;
    }
    .b1 {
        width: 10px;
        height: 10px;
        bottom: 10%;
        left: 30%;
        animation: rise 4s infinite;
    }
    .b2 {
        width: 15px;
        height: 15px;
        bottom: 15%;
        left: 60%;
        animation: rise 5s infinite 1s;
    }
    .b3 {
        width: 8px;
        height: 8px;
        bottom: 5%;
        left: 45%;
        animation: rise 3s infinite 0.5s;
    }

    @keyframes rise {
        0% {
            transform: translateY(0);
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px);
            opacity: 0;
        }
    }

    @keyframes wobble {
        0%,
        100% {
            border-radius: 40% 40% 50% 50%;
        }
        50% {
            border-radius: 42% 38% 50% 50%;
        }
    }

    .base-controls {
        display: flex;
        gap: 15px;
    }

    .pebble {
        width: 30px;
        height: 20px;
        border-radius: 15px;
        background: #90a4ae;
        border: none;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        transition: transform 0.1s;
    }
    .pebble:hover {
        transform: translateY(-2px);
    }
    .pebble:active {
        transform: translateY(0);
    }

    .pebble.big {
        width: 40px;
        height: 25px;
        background: #546e7a;
    }
</style>
