<script lang="ts">
    import { createViewerStore } from "$lib/stores/viewerStore";
    import { fade } from "svelte/transition";

    const { currentIndex, images, nextImage, prevImage, selectRandomImage } =
        createViewerStore();
</script>

<div class="holo-sphere">
    <div class="emitter-base">
        <div class="projection-field">
            <div class="hologram-content">
                {#key $currentIndex}
                    <img
                        src={images[$currentIndex]}
                        alt="Holo Sphere Car"
                        class="car-image"
                        in:fade={{ duration: 200 }}
                        out:fade={{ duration: 200 }}
                    />
                {/key}
                <div class="scan-rings"></div>
                <div class="grid-floor"></div>
            </div>
        </div>
        <div class="emitter-glow"></div>
    </div>

    <div class="touch-interface">
        <button class="touch-pad" on:click={prevImage}></button>
        <button class="touch-pad rnd" on:click={selectRandomImage}></button>
        <button class="touch-pad" on:click={nextImage}></button>
    </div>
</div>

<style>
    .holo-sphere {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 450px;
        justify-content: flex-end;
    }

    .emitter-base {
        width: 200px;
        height: 40px;
        background: #1a1a1a;
        border-radius: 50%;
        position: relative;
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
        margin-bottom: 20px;
    }

    .emitter-glow {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        height: 10px;
        background: #00e5ff;
        filter: blur(10px);
        border-radius: 50%;
    }

    .projection-field {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: radial-gradient(
            circle,
            rgba(0, 229, 255, 0.1) 0%,
            transparent 70%
        );
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        border: 1px solid rgba(0, 229, 255, 0.1);
    }

    .hologram-content {
        width: 80%;
        height: 80%;
        position: relative;
        animation: float 4s ease-in-out infinite;
    }

    .car-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: drop-shadow(0 0 5px #00e5ff) hue-rotate(180deg);
        opacity: 0.8;
    }

    .scan-rings {
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 4px,
            rgba(0, 229, 255, 0.2) 5px
        );
        mask-image: radial-gradient(circle, black 40%, transparent 80%);
        pointer-events: none;
    }

    .grid-floor {
        position: absolute;
        bottom: 0;
        left: -50%;
        width: 200%;
        height: 100px;
        background: linear-gradient(
                90deg,
                rgba(0, 229, 255, 0.1) 1px,
                transparent 1px
            ),
            linear-gradient(0deg, rgba(0, 229, 255, 0.1) 1px, transparent 1px);
        background-size: 20px 20px;
        transform: perspective(300px) rotateX(60deg);
        pointer-events: none;
    }

    @keyframes float {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }

    .touch-interface {
        display: flex;
        gap: 30px;
        margin-top: 10px;
    }

    .touch-pad {
        width: 10px;
        height: 10px;
        background: #333;
        border: 1px solid #555;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s;
    }
    .touch-pad:hover {
        background: #00e5ff;
        box-shadow: 0 0 10px #00e5ff;
        transform: scale(1.5);
    }
    .touch-pad.rnd {
        border-radius: 0;
        transform: rotate(45deg);
    }
    .touch-pad.rnd:hover {
        transform: rotate(45deg) scale(1.5);
    }
</style>
