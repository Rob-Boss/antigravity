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

<div class="hud-bridge-fog" on:mousemove={handleMouseMove}>
    <div
        class="sky-layer"
        style="transform: translate({x * -20}px, {y * -20}px)"
    >
        <div class="sky-gradient"></div>
    </div>

    <div class="scene-container">
        <!-- Bridge disappearing into fog -->
        <div class="bridge-path"></div>

        <!-- Objects: Beacons -->
        <div class="beacon b1" style="transform: translate({x * 5}px, 0)"></div>
        <div
            class="beacon b2"
            style="transform: translate({x * 10}px, 0)"
        ></div>
        <div
            class="beacon b3"
            style="transform: translate({x * 15}px, 0)"
        ></div>

        <!-- Fog Overlay -->
        <div class="fog-overlay"></div>
    </div>

    <div class="reflection-container">
        <div class="scene-container reflected">
            <div class="bridge-path"></div>
            <div
                class="beacon b1"
                style="transform: translate({x * 5}px, 0)"
            ></div>
            <div
                class="beacon b2"
                style="transform: translate({x * 10}px, 0)"
            ></div>
            <div
                class="beacon b3"
                style="transform: translate({x * 15}px, 0)"
            ></div>
        </div>
        <div class="water-overlay"></div>
    </div>

    <div class="dither"></div>
</div>

<style>
    .hud-bridge-fog {
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
        background: #ccc;
    }
    .sky-gradient {
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, #eee, #999);
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
        background: linear-gradient(to bottom, #999, #555);
    }
    .reflected {
        transform: scaleY(-1) translateY(100%);
        transform-origin: bottom;
        height: 150%;
        filter: blur(5px) wave(5px);
        opacity: 0.5;
    }
    .water-overlay {
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.05),
            transparent 4px
        );
        mix-blend-mode: overlay;
    }

    .bridge-path {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%) perspective(500px) rotateX(60deg);
        width: 200px;
        height: 600px;
        background: #555;
        box-shadow: 0 0 50px #000;
    }

    .beacon {
        position: absolute;
        bottom: 100px;
        width: 20px;
        height: 100px;
        background: #333;
    }
    .beacon::after {
        content: "";
        position: absolute;
        top: 0;
        left: -5px;
        width: 30px;
        height: 30px;
        background: #f00;
        border-radius: 50%;
        box-shadow: 0 0 30px #f00;
        animation: blink 2s infinite;
    }
    .b1 {
        left: 40%;
        bottom: 50px;
        transform: scale(0.8);
    }
    .b2 {
        left: 55%;
        bottom: 150px;
    }
    .b3 {
        left: 45%;
        bottom: 250px;
        transform: scale(1.2);
    }

    .fog-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, transparent, #eee 80%);
        opacity: 0.8;
    }

    @keyframes blink {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.3;
        }
    }
</style>
