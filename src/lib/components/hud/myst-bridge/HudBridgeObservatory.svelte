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

<div class="hud-bridge-observatory" on:mousemove={handleMouseMove}>
    <div
        class="sky-layer"
        style="transform: translate({x * -20}px, {y * -20}px)"
    >
        <div class="sky-gradient"></div>
        <div class="star s1"></div>
        <div class="star s2"></div>
        <div class="star s3"></div>
    </div>

    <div class="scene-container">
        <!-- Metal Grating Bridge -->
        <div class="grating"></div>
        <div class="rail r1"></div>
        <div class="rail r2"></div>

        <!-- Dome Structure -->
        <div class="dome"></div>

        <!-- Objects: Lenses -->
        <div class="lens l1" style="transform: translate({x * 10}px, 0)"></div>
        <div class="lens l2" style="transform: translate({x * 15}px, 0)"></div>
    </div>

    <div class="reflection-container">
        <div class="scene-container reflected">
            <div class="grating"></div>
            <div class="rail r1"></div>
            <div class="rail r2"></div>
            <div class="dome"></div>
            <div
                class="lens l1"
                style="transform: translate({x * 10}px, 0)"
            ></div>
            <div
                class="lens l2"
                style="transform: translate({x * 15}px, 0)"
            ></div>
        </div>
        <div class="water-overlay"></div>
    </div>

    <div class="dither"></div>
</div>

<style>
    .hud-bridge-observatory {
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
        background: #000;
    }
    .sky-gradient {
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, #000022, #1a237e);
    }
    .star {
        position: absolute;
        width: 4px;
        height: 4px;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 0 10px #fff;
    }
    .s1 {
        top: 20%;
        left: 20%;
    }
    .s2 {
        top: 30%;
        right: 30%;
    }
    .s3 {
        top: 10%;
        left: 50%;
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
        background: linear-gradient(to bottom, #1a237e, #000);
    }
    .reflected {
        transform: scaleY(-1) translateY(100%);
        transform-origin: bottom;
        height: 150%;
        filter: blur(2px) wave(5px);
        opacity: 0.7;
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

    .grating {
        position: absolute;
        bottom: 0;
        left: 20%;
        width: 60%;
        height: 200px;
        background: repeating-linear-gradient(
                90deg,
                #2f1e1e,
                #2f1e1e 10px,
                transparent 10px,
                transparent 20px
            ),
            repeating-linear-gradient(
                0deg,
                #2f1e1e,
                #2f1e1e 10px,
                transparent 10px,
                transparent 20px
            );
        background-color: rgba(47, 30, 30, 0.5);
        transform: perspective(500px) rotateX(45deg);
    }

    .rail {
        position: absolute;
        bottom: 0;
        width: 10px;
        height: 200px;
        background: #8b7355;
    }
    .r1 {
        left: 20%;
    }
    .r2 {
        right: 20%;
    }

    .dome {
        position: absolute;
        bottom: 150px;
        left: 50%;
        transform: translateX(-50%);
        width: 200px;
        height: 100px;
        background: #5d4037;
        border-radius: 100px 100px 0 0;
        border: 4px solid #8b7355;
    }

    .lens {
        position: absolute;
        bottom: 100px;
        width: 60px;
        height: 60px;
        background: rgba(100, 200, 255, 0.3);
        border: 2px solid #8b7355;
        border-radius: 50%;
        box-shadow: 0 0 20px rgba(100, 200, 255, 0.5);
        backdrop-filter: blur(2px);
    }
    .l1 {
        left: 35%;
    }
    .l2 {
        left: 55%;
        width: 80px;
        height: 80px;
        bottom: 80px;
    }
</style>
