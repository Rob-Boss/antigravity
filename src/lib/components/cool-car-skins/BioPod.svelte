<script lang="ts">
    import { createViewerStore } from "$lib/stores/viewerStore";
    import { fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";

    const {
        currentIndex,
        direction,
        images,
        nextImage,
        prevImage,
        selectRandomImage,
    } = createViewerStore();
</script>

<div class="bio-pod">
    <div class="pod-shell">
        <div class="liquid-screen">
            {#key $currentIndex}
                <img
                    src={images[$currentIndex]}
                    alt="Bio Car"
                    class="car-image"
                    in:fly={{
                        x: 200 * $direction,
                        duration: 400,
                        easing: cubicOut,
                    }}
                    out:fly={{
                        x: -200 * $direction,
                        duration: 400,
                        easing: cubicOut,
                    }}
                />
            {/key}
            <div class="bubbles">
                <div class="bubble b1"></div>
                <div class="bubble b2"></div>
                <div class="bubble b3"></div>
            </div>
        </div>
        <div class="organic-controls">
            <button class="bio-btn left" on:click={prevImage}></button>
            <button class="bio-btn center" on:click={selectRandomImage}
            ></button>
            <button class="bio-btn right" on:click={nextImage}></button>
        </div>
    </div>
</div>

<style>
    .bio-pod {
        width: 380px;
        display: flex;
        justify-content: center;
    }

    .pod-shell {
        background: linear-gradient(135deg, #a5d6a7, #66bb6a);
        padding: 25px;
        border-radius: 60px 60px 100px 100px;
        box-shadow:
            0 20px 40px rgba(76, 175, 80, 0.3),
            inset 0 5px 15px rgba(255, 255, 255, 0.4);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        position: relative;
    }

    .liquid-screen {
        width: 280px;
        height: 280px;
        background: #e0f2f1;
        border-radius: 50%;
        position: relative;
        overflow: hidden;
        box-shadow: inset 0 0 20px rgba(0, 150, 136, 0.2);
        border: 4px solid rgba(255, 255, 255, 0.5);
    }

    .car-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        position: absolute;
        z-index: 2;
    }

    .bubbles {
        position: absolute;
        inset: 0;
        z-index: 1;
        pointer-events: none;
    }

    .bubble {
        position: absolute;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 50%;
    }

    .b1 {
        width: 20px;
        height: 20px;
        bottom: 20px;
        left: 30%;
        animation: float 4s infinite ease-in-out;
    }
    .b2 {
        width: 15px;
        height: 15px;
        bottom: 40px;
        left: 60%;
        animation: float 5s infinite ease-in-out 1s;
    }
    .b3 {
        width: 10px;
        height: 10px;
        bottom: 10px;
        left: 45%;
        animation: float 3s infinite ease-in-out 0.5s;
    }

    @keyframes float {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-20px);
        }
    }

    .organic-controls {
        display: flex;
        gap: 20px;
        background: rgba(255, 255, 255, 0.2);
        padding: 10px 20px;
        border-radius: 30px;
    }

    .bio-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        transition: transform 0.2s;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    .bio-btn:hover {
        transform: scale(1.1);
    }

    .bio-btn:active {
        transform: scale(0.9);
    }

    .bio-btn.left {
        background: #81c784;
    }
    .bio-btn.center {
        background: #ffcc80;
        width: 50px;
        height: 50px;
    }
    .bio-btn.right {
        background: #81c784;
    }

    .bio-btn::after {
        content: "";
        display: block;
        width: 30%;
        height: 30%;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        margin: 20% auto;
    }
</style>
