<script lang="ts">
    import { createViewerStore } from "$lib/stores/viewerStore";
    import PixelTransition from "$lib/components/PixelTransition.svelte";

    const { currentIndex, images, nextImage, prevImage, selectRandomImage } =
        createViewerStore();
</script>

<div class="philco-predicta">
    <div class="screen-housing">
        <div class="gold-trim">
            <div class="crt-mask">
                {#key $currentIndex}
                    <PixelTransition
                        src={images[$currentIndex]}
                        alt="Philco Car"
                    />
                {/key}
                <div class="glass-glare"></div>
            </div>
        </div>

        <div class="top-knobs">
            <button class="knob" on:click={prevImage}></button>
            <button class="knob center" on:click={selectRandomImage}></button>
            <button class="knob" on:click={nextImage}></button>
        </div>
    </div>

    <div class="swivel-neck"></div>

    <div class="base-unit">
        <div class="speaker-grill"></div>
    </div>
</div>

<style>
    .philco-predicta {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 450px;
    }

    .screen-housing {
        width: 360px;
        height: 280px;
        background: #f8bbd0; /* Retro Pink */
        border-radius: 30px;
        position: relative;
        padding: 15px;
        clip-path: polygon(
            0 0,
            100% 0,
            90% 100%,
            10% 100%
        ); /* Trapezoid shape */
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        z-index: 3;
    }

    .gold-trim {
        width: 100%;
        height: 100%;
        border: 4px solid #ffd700; /* Gold */
        border-radius: 20px;
        padding: 5px;
        background: #fff;
    }

    .crt-mask {
        width: 100%;
        height: 100%;
        background: #222;
        border-radius: 15px;
        overflow: hidden;
        position: relative;
        box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.5);
    }

    .glass-glare {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 40%,
            rgba(255, 255, 255, 0.05) 100%
        );
        pointer-events: none;
    }

    .top-knobs {
        position: absolute;
        top: -15px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 30px;
        background: #fff;
        padding: 5px 20px;
        border-radius: 20px;
        border: 2px solid #ffd700;
    }

    .knob {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background: #f48fb1;
        border: 2px solid #ad1457;
        cursor: pointer;
        transition: transform 0.2s;
    }
    .knob:hover {
        transform: rotate(45deg);
    }
    .knob.center {
        width: 30px;
        height: 30px;
        background: #ad1457;
    }

    .swivel-neck {
        width: 60px;
        height: 40px;
        background: #333;
        margin-top: -10px;
        z-index: 2;
    }

    .base-unit {
        width: 200px;
        height: 80px;
        background: #fce4ec;
        border-radius: 10px;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
    }

    .speaker-grill {
        width: 80%;
        height: 60%;
        background: repeating-linear-gradient(
            90deg,
            #f8bbd0,
            #f8bbd0 2px,
            #f48fb1 2px,
            #f48fb1 4px
        );
        border-radius: 5px;
    }
</style>
