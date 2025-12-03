<script lang="ts">
    import { createViewerStore } from "$lib/stores/viewerStore";
    import { fade } from "svelte/transition";

    const { currentIndex, images, nextImage, prevImage, selectRandomImage } =
        createViewerStore();
</script>

<div class="soap-bubble">
    <div class="bubble-sphere">
        <div class="iridescence">
            {#key $currentIndex}
                <img
                    src={images[$currentIndex]}
                    alt="Bubble Car"
                    class="car-image"
                    in:fade={{ duration: 400 }}
                    out:fade={{ duration: 400 }}
                />
            {/key}
            <div class="surface-swirl"></div>
            <div class="highlight"></div>
        </div>
    </div>

    <div class="float-controls">
        <button class="bubble-btn" on:click={prevImage}></button>
        <button class="bubble-btn pop" on:click={selectRandomImage}></button>
        <button class="bubble-btn" on:click={nextImage}></button>
    </div>
</div>

<style>
    .soap-bubble {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30px;
        height: 450px;
        justify-content: center;
    }

    .bubble-sphere {
        width: 320px;
        height: 320px;
        border-radius: 50%;
        position: relative;
        animation: float-wobble 6s ease-in-out infinite;
        box-shadow:
            0 20px 30px rgba(0, 0, 0, 0.1),
            inset 0 0 20px rgba(255, 255, 255, 0.5);
    }

    .iridescence {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: radial-gradient(
            circle at 30% 30%,
            rgba(255, 255, 255, 0.1),
            rgba(255, 255, 255, 0.05) 60%,
            rgba(255, 200, 255, 0.2) 80%,
            rgba(200, 255, 255, 0.4) 100%
        );
        position: relative;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .car-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        position: absolute;
        opacity: 0.9;
        transform: scale(0.9);
        filter: contrast(0.9) brightness(1.1);
    }

    .surface-swirl {
        position: absolute;
        inset: -50%;
        width: 200%;
        height: 200%;
        background: conic-gradient(
            from 0deg,
            transparent,
            rgba(255, 0, 0, 0.1),
            rgba(255, 255, 0, 0.1),
            rgba(0, 255, 0, 0.1),
            rgba(0, 255, 255, 0.1),
            rgba(0, 0, 255, 0.1),
            rgba(255, 0, 255, 0.1),
            transparent
        );
        mix-blend-mode: color-dodge;
        animation: spin 10s linear infinite;
        pointer-events: none;
        opacity: 0.5;
    }

    .highlight {
        position: absolute;
        top: 15%;
        left: 20%;
        width: 50px;
        height: 30px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        transform: rotate(-45deg);
        filter: blur(8px);
    }

    @keyframes float-wobble {
        0%,
        100% {
            transform: translateY(0) scale(1);
            border-radius: 50%;
        }
        33% {
            transform: translateY(-15px) scale(1.02, 0.98);
            border-radius: 52% 48% 51% 49%;
        }
        66% {
            transform: translateY(10px) scale(0.98, 1.02);
            border-radius: 49% 51% 48% 52%;
        }
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .float-controls {
        display: flex;
        gap: 20px;
    }

    .bubble-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.5);
        cursor: pointer;
        transition: transform 0.2s;
        backdrop-filter: blur(2px);
    }
    .bubble-btn:hover {
        transform: scale(1.2);
        background: rgba(255, 255, 255, 0.4);
    }
    .bubble-btn.pop {
        background: rgba(255, 200, 200, 0.3);
    }
</style>
