<script lang="ts">
    import { createViewerStore } from "$lib/stores/viewerStore";
    import { fade } from "svelte/transition";

    const { currentIndex, images, nextImage, prevImage, selectRandomImage } =
        createViewerStore();
</script>

<div class="deep-sea">
    <div class="porthole">
        <div class="glass-thick">
            <div class="water-dark">
                {#key $currentIndex}
                    <img
                        src={images[$currentIndex]}
                        alt="Deep Sea Car"
                        class="car-image"
                        in:fade={{ duration: 1000 }}
                        out:fade={{ duration: 1000 }}
                    />
                {/key}
                <div class="murk"></div>
                <div class="condensation"></div>
            </div>
            <div class="glass-glare"></div>
        </div>

        <div class="bolts">
            {#each Array(8) as _, i}
                <div
                    class="bolt"
                    style="transform: rotate({i * 45}deg) translateY(-165px)"
                ></div>
            {/each}
        </div>
    </div>

    <div class="pressure-controls">
        <button class="valve" on:click={prevImage}></button>
        <button class="valve red" on:click={selectRandomImage}></button>
        <button class="valve" on:click={nextImage}></button>
    </div>
</div>

<style>
    .deep-sea {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .porthole {
        width: 360px;
        height: 360px;
        border-radius: 50%;
        background: #263238;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow:
            0 20px 40px rgba(0, 0, 0, 0.6),
            inset 0 0 50px #000;
        border: 15px solid #37474f;
    }

    .glass-thick {
        width: 280px;
        height: 280px;
        border-radius: 50%;
        background: #000;
        position: relative;
        overflow: hidden;
        box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.9);
        border: 2px solid rgba(255, 255, 255, 0.1);
    }

    .water-dark {
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, #004d40 0%, #000 100%);
        position: relative;
    }

    .car-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        position: absolute;
        opacity: 0.8;
        filter: blur(1px) sepia(0.4) hue-rotate(180deg);
    }

    .murk {
        position: absolute;
        inset: 0;
        background: radial-gradient(
            circle,
            transparent 40%,
            rgba(0, 0, 0, 0.8) 100%
        );
        pointer-events: none;
    }

    .condensation {
        position: absolute;
        inset: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E");
        opacity: 0.3;
        pointer-events: none;
        mix-blend-mode: overlay;
    }

    .glass-glare {
        position: absolute;
        top: 20%;
        left: 20%;
        width: 40px;
        height: 20px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        transform: rotate(-45deg);
        filter: blur(5px);
        pointer-events: none;
    }

    .bolt {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, #78909c, #37474f);
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        margin-top: -10px;
        margin-left: -10px;
    }
    .bolt::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 60%;
        height: 2px;
        background: #263238;
        transform: translate(-50%, -50%);
    }

    .pressure-controls {
        display: flex;
        gap: 20px;
        background: #263238;
        padding: 10px 20px;
        border-radius: 10px;
        border: 2px solid #37474f;
    }

    .valve {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #546e7a;
        border: 2px solid #78909c;
        cursor: pointer;
        position: relative;
    }
    .valve::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 4px;
        background: #37474f;
        transform: translate(-50%, -50%);
    }
    .valve::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 4px;
        height: 100%;
        background: #37474f;
        transform: translate(-50%, -50%);
    }
    .valve:active {
        transform: rotate(45deg);
    }

    .valve.red {
        background: #b71c1c;
        border-color: #e57373;
    }
</style>
