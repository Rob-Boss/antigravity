<script lang="ts">
    import { onMount } from "svelte";

    let x = 0;
    let y = 0;
    let w = 0;
    let h = 0;

    function handleMouseMove(e: MouseEvent) {
        x = (e.clientX - w / 2) / (w / 2);
        y = (e.clientY - h / 2) / (h / 2);
    }

    onMount(() => {
        w = window.innerWidth;
        h = window.innerHeight;
    });
</script>

<svelte:window
    on:resize={() => {
        w = window.innerWidth;
        h = window.innerHeight;
    }}
/>

<div class="hud-bridge-crystal" on:mousemove={handleMouseMove}>
    <div
        class="sky-layer"
        style="transform: translate({x * -20}px, {y * -20}px)"
    >
        <div class="sky-gradient"></div>
        <div class="sun"></div>
    </div>

    <div class="scene-container">
        <!-- Crystal Spikes -->
        <div class="spike s1"></div>
        <div class="spike s2"></div>
        <div class="spike s3"></div>

        <!-- Transparent Deck -->
        <div class="crystal-deck"></div>

        <!-- Objects: Prisms -->
        <div class="prism p1" style="transform: translate({x * 5}px, 0)"></div>
        <div class="prism p2" style="transform: translate({x * 10}px, 0)"></div>
    </div>

    <div class="reflection-container">
        <div class="scene-container reflected">
            <div class="spike s1"></div>
            <div class="spike s2"></div>
            <div class="spike s3"></div>
            <div class="crystal-deck"></div>
            <div
                class="prism p1"
                style="transform: translate({x * 5}px, 0)"
            ></div>
            <div
                class="prism p2"
                style="transform: translate({x * 10}px, 0)"
            ></div>
        </div>
        <div class="water-overlay"></div>
    </div>

    <div class="dither"></div>
</div>

<style>
    .hud-bridge-crystal {
        width: 100%;
        height: 100%;
        background: #000;
        position: relative;
        overflow: hidden;
        cursor: none;
    }

    .dither {
        position: absolute;
        inset: 0;
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzjIHFBmAApgMakCDg6OCAC9Sw0R+g065AAAAABJRU5ErkJggg==");
        opacity: 0.1;
        pointer-events: none;
        z-index: 100;
    }

    .sky-layer {
        position: absolute;
        inset: -50px;
        background: #4a6d8c;
    }
    .sky-gradient {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            to bottom,
            #e040fb,
            #4a148c
        ); /* Purple alien sky */
    }
    .sun {
        position: absolute;
        top: 10%;
        left: 50%;
        width: 100px;
        height: 100px;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 0 50px #e040fb;
    }

    .scene-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 60%;
        overflow: hidden;
    }
    .reflection-container {
        position: absolute;
        top: 60%;
        left: 0;
        width: 100%;
        height: 40%;
        overflow: hidden;
        background: linear-gradient(to bottom, #4a148c, #000);
    }
    .reflected {
        transform: scaleY(-1) translateY(100%);
        transform-origin: bottom;
        height: 150%;
        filter: blur(2px) wave(5px);
        opacity: 0.8;
    }
    .water-overlay {
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.1),
            transparent 4px
        );
        mix-blend-mode: overlay;
    }

    .spike {
        position: absolute;
        bottom: 0;
        width: 100px;
        height: 300px;
        background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.4),
            rgba(224, 64, 251, 0.2)
        );
        clip-path: polygon(50% 0, 100% 100%, 0 100%);
        backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.5);
    }
    .s1 {
        left: 10%;
    }
    .s2 {
        left: 45%;
        height: 200px;
    }
    .s3 {
        right: 10%;
    }

    .crystal-deck {
        position: absolute;
        bottom: 150px;
        left: 0;
        width: 100%;
        height: 20px;
        background: rgba(255, 255, 255, 0.2);
        box-shadow: 0 0 20px rgba(224, 64, 251, 0.5);
    }

    .prism {
        position: absolute;
        bottom: 180px;
        width: 40px;
        height: 60px;
        background: rgba(255, 255, 255, 0.8);
        clip-path: polygon(50% 0, 100% 100%, 0 100%);
        box-shadow: 0 0 20px #fff;
        animation: spin 5s infinite linear;
    }
    .p1 {
        left: 30%;
    }
    .p2 {
        left: 60%;
    }

    @keyframes spin {
        0% {
            transform: rotateY(0deg);
        }
        100% {
            transform: rotateY(360deg);
        }
    }
</style>
