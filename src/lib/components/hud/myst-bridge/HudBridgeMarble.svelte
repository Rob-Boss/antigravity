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

<div class="hud-bridge-marble" on:mousemove={handleMouseMove}>
    <div
        class="sky-layer"
        style="transform: translate({x * -20}px, {y * -20}px)"
    >
        <div class="sky-gradient"></div>
        <div class="sun"></div>
        <div class="cloud c1"></div>
    </div>

    <div class="scene-container">
        <!-- Marble Pillars -->
        <div class="pillar p1"></div>
        <div class="pillar p2"></div>
        <div class="pillar p3"></div>
        <div class="pillar p4"></div>

        <!-- Deck -->
        <div class="deck"></div>

        <!-- Objects: Obelisks -->
        <div
            class="obelisk o1"
            style="transform: translate({x * 5}px, 0)"
        ></div>
        <div
            class="obelisk o2"
            style="transform: translate({x * 10}px, 0)"
        ></div>
    </div>

    <div class="reflection-container">
        <div class="scene-container reflected">
            <div class="pillar p1"></div>
            <div class="pillar p2"></div>
            <div class="pillar p3"></div>
            <div class="pillar p4"></div>
            <div class="deck"></div>
            <div
                class="obelisk o1"
                style="transform: translate({x * 5}px, 0)"
            ></div>
            <div
                class="obelisk o2"
                style="transform: translate({x * 10}px, 0)"
            ></div>
        </div>
        <div class="water-overlay"></div>
    </div>

    <div class="dither"></div>
</div>

<style>
    .hud-bridge-marble {
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
            #87ceeb,
            #e0f7fa
        ); /* Bright day */
    }
    .sun {
        position: absolute;
        top: 10%;
        right: 10%;
        width: 120px;
        height: 120px;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 0 80px #fff;
    }
    .cloud {
        position: absolute;
        background: #fff;
        border-radius: 50px;
        filter: blur(20px);
        opacity: 0.6;
    }
    .c1 {
        top: 20%;
        left: 20%;
        width: 400px;
        height: 100px;
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
        background: linear-gradient(to bottom, #87ceeb, #4a6d8c);
    }
    .reflected {
        transform: scaleY(-1) translateY(100%);
        transform-origin: bottom;
        height: 150%;
        filter: blur(2px) wave(5px);
        opacity: 0.6;
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

    .pillar {
        position: absolute;
        bottom: 0;
        width: 40px;
        height: 300px;
        background: linear-gradient(90deg, #e0e0e0, #fff, #e0e0e0);
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    }
    .p1 {
        left: 20%;
    }
    .p2 {
        left: 30%;
    }
    .p3 {
        right: 30%;
    }
    .p4 {
        right: 20%;
    }

    .deck {
        position: absolute;
        bottom: 150px;
        left: 0;
        width: 100%;
        height: 30px;
        background: #fff;
        border-top: 5px solid #ffd700;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .obelisk {
        position: absolute;
        bottom: 180px;
        width: 40px;
        height: 120px;
        background: linear-gradient(135deg, #ffd700, #b8860b);
        clip-path: polygon(50% 0, 100% 20%, 80% 100%, 20% 100%, 0 20%);
        box-shadow: 0 0 20px #ffd700;
    }
    .o1 {
        left: 40%;
    }
    .o2 {
        left: 55%;
    }
</style>
