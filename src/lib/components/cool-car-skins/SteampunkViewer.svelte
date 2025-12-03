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

<div class="steampunk-viewer">
    <div class="brass-frame">
        <div class="gear-assembly top-left">
            <div class="gear large"></div>
            <div class="gear small"></div>
        </div>

        <div class="view-port">
            <div class="lens-ring">
                {#key $currentIndex}
                    <img
                        src={images[$currentIndex]}
                        alt="Steampunk Car"
                        class="car-image"
                        in:fly={{
                            x: 200 * $direction,
                            duration: 600,
                            easing: cubicOut,
                        }}
                        out:fly={{
                            x: -200 * $direction,
                            duration: 600,
                            easing: cubicOut,
                        }}
                    />
                {/key}
                <div class="sepia-overlay"></div>
                <div class="scratch-overlay"></div>
            </div>
        </div>

        <div class="control-box">
            <div class="pipe-connector left"></div>
            <div class="pipe-connector right"></div>

            <button class="brass-btn" on:click={prevImage}>
                <span class="ornate-text">◄</span>
            </button>

            <div class="steam-vent">
                <div class="steam-cloud"></div>
                <button class="valve-wheel" on:click={selectRandomImage}>
                    <div class="spoke"></div>
                    <div class="spoke"></div>
                </button>
            </div>

            <button class="brass-btn" on:click={nextImage}>
                <span class="ornate-text">►</span>
            </button>
        </div>
    </div>
</div>

<style>
    .steampunk-viewer {
        display: flex;
        justify-content: center;
    }

    .brass-frame {
        position: relative;
        width: 450px;
        background: radial-gradient(#d4af37, #b8860b);
        padding: 40px;
        border: 8px solid #5d4037;
        border-radius: 20px;
        box-shadow:
            inset 0 0 30px #3e2723,
            0 20px 40px rgba(0, 0, 0, 0.5);
    }

    .view-port {
        background: #3e2723;
        padding: 15px;
        border-radius: 50%;
        border: 4px solid #8d6e63;
        box-shadow: inset 0 0 20px #000;
        width: 300px;
        height: 300px;
        margin: 0 auto 30px;
        position: relative;
    }

    .lens-ring {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        overflow: hidden;
        position: relative;
        background: #1a1a1a;
        border: 10px solid #b8860b;
        box-sizing: border-box;
    }

    .car-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        position: absolute;
        filter: sepia(0.8) contrast(1.2);
    }

    .sepia-overlay {
        position: absolute;
        inset: 0;
        background: radial-gradient(
            circle,
            transparent 40%,
            rgba(62, 39, 35, 0.6) 100%
        );
        pointer-events: none;
        mix-blend-mode: multiply;
    }

    .scratch-overlay {
        position: absolute;
        inset: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E");
        pointer-events: none;
        opacity: 0.4;
    }

    .control-box {
        background: #5d4037;
        border: 4px solid #b8860b;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        border-radius: 10px;
    }

    .brass-btn {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ffd700, #b8860b);
        border: 2px solid #8d6e63;
        box-shadow:
            inset 2px 2px 5px rgba(255, 255, 255, 0.5),
            inset -2px -2px 5px rgba(0, 0, 0, 0.5),
            0 5px 10px rgba(0, 0, 0, 0.3);
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .brass-btn:active {
        transform: translateY(2px);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    }

    .ornate-text {
        font-size: 24px;
        color: #3e2723;
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4);
    }

    .steam-vent {
        position: relative;
        width: 80px;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .valve-wheel {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        border: 6px solid #b71c1c; /* Red valve */
        background: transparent;
        position: relative;
        cursor: pointer;
        transition: transform 0.5s;
    }

    .valve-wheel:active {
        transform: rotate(180deg);
    }

    .spoke {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: 6px;
        background: #b71c1c;
        transform: translateY(-50%);
    }
    .spoke:nth-child(2) {
        transform: translateY(-50%) rotate(90deg);
    }

    .gear-assembly {
        position: absolute;
        top: -20px;
        left: -20px;
    }

    .gear {
        border-radius: 50%;
        background: #cd7f32; /* Bronze */
        border: 2px dashed #8d6e63;
        position: absolute;
        animation: spin 10s linear infinite;
    }

    .gear.large {
        width: 80px;
        height: 80px;
        top: 0;
        left: 0;
    }

    .gear.small {
        width: 50px;
        height: 50px;
        top: 60px;
        left: 50px;
        animation-direction: reverse;
        animation-duration: 5s;
        background: #b8860b;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>
