<script lang="ts">
    import { createViewerStore } from "$lib/stores/viewerStore";
    import { fade } from "svelte/transition";

    const { currentIndex, images, nextImage, prevImage, selectRandomImage } =
        createViewerStore();
</script>

<div class="glitch-sphere">
    <div class="sphere-container">
        <div class="glitch-screen">
            {#key $currentIndex}
                <div class="glitch-layers">
                    <img src={images[$currentIndex]} alt="" class="layer r" />
                    <img src={images[$currentIndex]} alt="" class="layer g" />
                    <img src={images[$currentIndex]} alt="" class="layer b" />
                    <img
                        src={images[$currentIndex]}
                        alt="Glitch Car"
                        class="layer base"
                    />
                </div>
            {/key}
            <div class="scan-noise"></div>
            <div class="vignette"></div>
        </div>
        <div class="ring-controls">
            <button class="ring-btn" on:click={prevImage}>&lt;</button>
            <button class="ring-btn rnd" on:click={selectRandomImage}>X</button>
            <button class="ring-btn" on:click={nextImage}>&gt;</button>
        </div>
    </div>
</div>

<style>
    .glitch-sphere {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 400px;
    }

    .sphere-container {
        position: relative;
        width: 320px;
        height: 320px;
    }

    .glitch-screen {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #000;
        position: relative;
        overflow: hidden;
        box-shadow:
            0 0 20px rgba(255, 0, 255, 0.3),
            inset 0 0 50px rgba(0, 0, 0, 0.8);
        border: 2px solid rgba(255, 255, 255, 0.1);
    }

    .glitch-layers {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .layer {
        width: 100%;
        height: 100%;
        object-fit: contain;
        position: absolute;
        top: 0;
        left: 0;
        mix-blend-mode: screen;
    }

    .layer.r {
        filter: drop-shadow(2px 0 0 red);
        animation: glitch-anim-1 2s infinite linear alternate-reverse;
        opacity: 0.7;
    }
    .layer.g {
        filter: drop-shadow(-2px 0 0 green);
        animation: glitch-anim-2 3s infinite linear alternate-reverse;
        opacity: 0.7;
    }
    .layer.b {
        filter: drop-shadow(0 2px 0 blue);
        animation: glitch-anim-1 2.5s infinite linear alternate-reverse;
        opacity: 0.7;
    }
    .layer.base {
        position: relative;
        z-index: 2;
    }

    .scan-noise {
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.05) 3px
        );
        pointer-events: none;
        z-index: 10;
        animation: scroll 5s linear infinite;
    }

    .vignette {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle, transparent 50%, black 100%);
        pointer-events: none;
        z-index: 11;
    }

    .ring-controls {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 360px;
        height: 360px;
        transform: translate(-50%, -50%);
        border: 1px dashed rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        pointer-events: none; /* Let clicks pass through to buttons */
    }

    .ring-btn {
        pointer-events: auto;
        position: absolute;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #111;
        border: 1px solid #333;
        color: #fff;
        font-family: monospace;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.2s;
    }

    .ring-btn:hover {
        background: #fff;
        color: #000;
        box-shadow: 0 0 10px #fff;
    }

    .ring-btn:nth-child(1) {
        top: 50%;
        left: -20px;
        transform: translateY(-50%);
    }
    .ring-btn:nth-child(2) {
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%);
        color: #f0f;
        border-color: #f0f;
    }
    .ring-btn:nth-child(3) {
        top: 50%;
        right: -20px;
        transform: translateY(-50%);
    }

    @keyframes glitch-anim-1 {
        0% {
            clip-path: inset(20% 0 80% 0);
            transform: translate(-2px, 1px);
        }
        20% {
            clip-path: inset(60% 0 10% 0);
            transform: translate(2px, -1px);
        }
        40% {
            clip-path: inset(40% 0 50% 0);
            transform: translate(-2px, 2px);
        }
        60% {
            clip-path: inset(80% 0 5% 0);
            transform: translate(2px, -2px);
        }
        80% {
            clip-path: inset(10% 0 70% 0);
            transform: translate(-1px, 1px);
        }
        100% {
            clip-path: inset(30% 0 20% 0);
            transform: translate(1px, -1px);
        }
    }
    @keyframes glitch-anim-2 {
        0% {
            clip-path: inset(10% 0 60% 0);
            transform: translate(2px, -1px);
        }
        20% {
            clip-path: inset(80% 0 5% 0);
            transform: translate(-2px, 2px);
        }
        40% {
            clip-path: inset(30% 0 20% 0);
            transform: translate(1px, -1px);
        }
        60% {
            clip-path: inset(10% 0 80% 0);
            transform: translate(-1px, 2px);
        }
        80% {
            clip-path: inset(50% 0 30% 0);
            transform: translate(2px, -2px);
        }
        100% {
            clip-path: inset(20% 0 70% 0);
            transform: translate(-2px, 1px);
        }
    }
    @keyframes scroll {
        0% {
            background-position: 0 0;
        }
        100% {
            background-position: 0 100%;
        }
    }
</style>
