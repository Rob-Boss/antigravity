<script lang="ts">
    import { createViewerStore } from "$lib/stores/viewerStore";
    import { fly } from "svelte/transition";
    import { sineInOut } from "svelte/easing";

    const {
        currentIndex,
        direction,
        images,
        nextImage,
        prevImage,
        selectRandomImage,
    } = createViewerStore();
</script>

<div class="crystal-prism">
    <div class="prism-shape">
        <div class="facet front">
            {#key $currentIndex}
                <img
                    src={images[$currentIndex]}
                    alt="Crystal Car"
                    class="car-image"
                    in:fly={{ y: 50, duration: 800, easing: sineInOut }}
                    out:fly={{
                        y: -50,
                        duration: 800,
                        easing: sineInOut,
                        opacity: 0,
                    }}
                />
            {/key}
            <div class="refraction"></div>
            <div class="shimmer"></div>
        </div>

        <div class="floating-controls">
            <button class="shard left" on:click={prevImage}></button>
            <button class="shard center" on:click={selectRandomImage}></button>
            <button class="shard right" on:click={nextImage}></button>
        </div>
    </div>
</div>

<style>
    .crystal-prism {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 450px;
        perspective: 1000px;
    }

    .prism-shape {
        position: relative;
        width: 300px;
        height: 400px;
        transform-style: preserve-3d;
        animation: float 6s ease-in-out infinite;
    }

    .facet.front {
        position: absolute;
        inset: 0;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.4);
        clip-path: polygon(
            50% 0%,
            100% 25%,
            100% 75%,
            50% 100%,
            0% 75%,
            0% 25%
        );
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow:
            0 0 30px rgba(255, 255, 255, 0.2),
            inset 0 0 20px rgba(255, 255, 255, 0.1);
    }

    .car-image {
        width: 80%;
        height: auto;
        max-height: 60%;
        object-fit: contain;
        filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2));
    }

    .refraction {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.4) 0%,
            transparent 50%,
            rgba(255, 255, 255, 0.1) 100%
        );
        pointer-events: none;
        mix-blend-mode: overlay;
    }

    .shimmer {
        position: absolute;
        top: -100%;
        left: -100%;
        width: 300%;
        height: 300%;
        background: linear-gradient(
            45deg,
            transparent 45%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 55%
        );
        animation: shine 4s infinite;
        pointer-events: none;
    }

    .floating-controls {
        position: absolute;
        bottom: -60px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 20px;
    }

    .shard {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.5);
        transform: rotate(45deg);
        cursor: pointer;
        transition: all 0.3s;
        backdrop-filter: blur(2px);
    }

    .shard:hover {
        background: rgba(255, 255, 255, 0.4);
        box-shadow: 0 0 15px rgba(255, 255, 255, 0.6);
        transform: rotate(45deg) scale(1.1);
    }

    .shard.center {
        background: rgba(200, 200, 255, 0.3);
    }

    @keyframes float {
        0%,
        100% {
            transform: translateY(0) rotateY(0deg);
        }
        50% {
            transform: translateY(-20px) rotateY(5deg);
        }
    }

    @keyframes shine {
        0% {
            transform: translate(-50%, -50%);
        }
        100% {
            transform: translate(50%, 50%);
        }
    }
</style>
