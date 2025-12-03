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

<div class="hud-bridge-rope" on:mousemove={handleMouseMove}>
    <div
        class="sky-layer"
        style="transform: translate({x * -20}px, {y * -20}px)"
    >
        <div class="sky-gradient"></div>
        <div class="sun"></div>
        <div class="cloud c1"></div>
    </div>

    <div class="scene-container">
        <div class="cliff c-left"></div>
        <div class="cliff c-right"></div>

        <!-- Rope Bridge -->
        <div class="main-rope"></div>
        <div class="slats">
            {#each Array(15) as _, i}
                <div class="slat" style="left: {i * 6 + 5}%"></div>
            {/each}
        </div>

        <!-- Objects: Lanterns -->
        <div
            class="lantern l1"
            style="transform: translate({x * 10}px, {Math.sin(
                Date.now() / 1000,
            ) * 5}px)"
        ></div>
        <div
            class="lantern l2"
            style="transform: translate({x * 15}px, {Math.cos(
                Date.now() / 1000,
            ) * 5}px)"
        ></div>
    </div>

    <div class="reflection-container">
        <div class="scene-container reflected">
            <div class="cliff c-left"></div>
            <div class="cliff c-right"></div>
            <div class="main-rope"></div>
            <div class="slats">
                {#each Array(15) as _, i}
                    <div class="slat" style="left: {i * 6 + 5}%"></div>
                {/each}
            </div>
            <div
                class="lantern l1"
                style="transform: translate({x * 10}px, 0)"
            ></div>
            <div
                class="lantern l2"
                style="transform: translate({x * 15}px, 0)"
            ></div>
        </div>
        <div class="water-overlay"></div>
    </div>

    <div class="dither"></div>
</div>

<style>
    .hud-bridge-rope {
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
        background: linear-gradient(to bottom, #ffcc80, #8c7a6d); /* Sunset */
    }
    .sun {
        position: absolute;
        bottom: 20%;
        left: 50%;
        width: 200px;
        height: 200px;
        background: #ff9800;
        border-radius: 50%;
        filter: blur(10px);
        opacity: 0.8;
    }
    .cloud {
        position: absolute;
        background: #5d4037;
        border-radius: 50px;
        filter: blur(20px);
        opacity: 0.4;
    }
    .c1 {
        top: 40%;
        left: 10%;
        width: 500px;
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
        background: linear-gradient(to bottom, #8c7a6d, #2f1e1e);
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
            rgba(255, 255, 255, 0.05),
            transparent 4px
        );
        mix-blend-mode: overlay;
    }

    .cliff {
        position: absolute;
        bottom: 0;
        width: 20%;
        height: 100%;
        background: #2f1e1e;
    }
    .c-left {
        left: 0;
    }
    .c-right {
        right: 0;
    }

    .main-rope {
        position: absolute;
        top: 40%;
        left: 0;
        width: 100%;
        height: 200px;
        border-bottom: 4px solid #8b7355;
        border-radius: 50%;
        transform: scaleY(0.5);
    }

    .slats {
        position: absolute;
        top: 45%;
        left: 0;
        width: 100%;
        height: 100px;
    }
    .slat {
        position: absolute;
        top: 0;
        width: 4%;
        height: 10px;
        background: #5d4037;
        box-shadow: 0 5px 5px rgba(0, 0, 0, 0.5);
    }

    .lantern {
        position: absolute;
        bottom: 100px; /* Hanging low */
        width: 30px;
        height: 50px;
        background: #ffeb3b;
        border: 2px solid #4a3b2a;
        box-shadow: 0 0 20px #ffeb3b;
        animation: sway 3s infinite ease-in-out;
    }
    .l1 {
        left: 30%;
    }
    .l2 {
        left: 60%;
    }

    @keyframes sway {
        0%,
        100% {
            transform: rotate(5deg);
        }
        50% {
            transform: rotate(-5deg);
        }
    }
</style>
