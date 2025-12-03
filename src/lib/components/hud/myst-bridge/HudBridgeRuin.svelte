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

<div class="hud-bridge-ruin" on:mousemove={handleMouseMove}>
    <div
        class="sky-layer"
        style="transform: translate({x * -20}px, {y * -20}px)"
    >
        <div class="sky-gradient"></div>
        <div class="sun"></div>
        <div class="cloud c1"></div>
    </div>

    <div class="scene-container">
        <!-- Ruined Pillars -->
        <div class="pillar p1"></div>
        <div class="pillar p2"></div>

        <!-- Broken Deck -->
        <div class="deck d1"></div>
        <div class="deck d2"></div>
        <div class="debris"></div>

        <!-- Objects: Relics -->
        <div class="relic r1" style="transform: translate({x * 5}px, 0)"></div>
    </div>

    <div class="reflection-container">
        <div class="scene-container reflected">
            <div class="pillar p1"></div>
            <div class="pillar p2"></div>
            <div class="deck d1"></div>
            <div class="deck d2"></div>
            <div
                class="relic r1"
                style="transform: translate({x * 5}px, 0)"
            ></div>
        </div>
        <div class="water-overlay"></div>
    </div>

    <div class="dither"></div>
</div>

<style>
    .hud-bridge-ruin {
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
        background: linear-gradient(to bottom, #333, #5d4037); /* Stormy */
    }
    .sun {
        position: absolute;
        top: 20%;
        left: 20%;
        width: 80px;
        height: 80px;
        background: #fff;
        border-radius: 50%;
        filter: blur(20px);
        opacity: 0.3;
    }
    .cloud {
        position: absolute;
        background: #222;
        border-radius: 50px;
        filter: blur(20px);
        opacity: 0.8;
    }
    .c1 {
        top: 30%;
        left: 40%;
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
        background: linear-gradient(to bottom, #333, #000);
    }
    .reflected {
        transform: scaleY(-1) translateY(100%);
        transform-origin: bottom;
        height: 150%;
        filter: blur(2px) wave(5px);
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

    .pillar {
        position: absolute;
        bottom: 0;
        width: 60px;
        height: 200px;
        background: #5d4037;
        clip-path: polygon(0 0, 100% 10%, 90% 100%, 10% 100%);
    }
    .p1 {
        left: 20%;
    }
    .p2 {
        right: 20%;
        height: 150px;
    }

    .deck {
        position: absolute;
        bottom: 180px;
        height: 20px;
        background: #4a3b2a;
    }
    .d1 {
        left: 0;
        width: 40%;
        transform: rotate(5deg);
    }
    .d2 {
        right: 0;
        width: 30%;
        bottom: 140px;
        transform: rotate(-10deg);
    }

    .debris {
        position: absolute;
        bottom: 0;
        left: 45%;
        width: 100px;
        height: 50px;
        background: #4a3b2a;
        clip-path: polygon(20% 0, 80% 20%, 100% 100%, 0 100%);
    }

    .relic {
        position: absolute;
        bottom: 200px;
        left: 25%;
        width: 40px;
        height: 40px;
        background: #ffd700;
        clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
        box-shadow: 0 0 20px #ffd700;
        animation: float 4s infinite ease-in-out;
    }

    @keyframes float {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }
</style>
