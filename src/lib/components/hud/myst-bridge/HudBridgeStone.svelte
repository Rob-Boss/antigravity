<script lang="ts">
    import { onMount } from "svelte";

    let x = 0;
    let y = 0;
    let w = 0;
    let h = 0;

    function handleMouseMove(e: MouseEvent) {
        x = (e.clientX - w / 2) / (w / 2); // -1 to 1
        y = (e.clientY - h / 2) / (h / 2); // -1 to 1
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

<div class="hud-bridge-stone" on:mousemove={handleMouseMove}>
    <!-- Parallax Sky -->
    <div
        class="sky-layer"
        style="transform: translate({x * -20}px, {y * -20}px)"
    >
        <div class="sky-gradient"></div>
        <div class="sun"></div>
        <div class="cloud c1"></div>
        <div class="cloud c2"></div>
        <div class="cloud c3"></div>
    </div>

    <!-- Scene Container (for reflection duplication) -->
    <div class="scene-container">
        <!-- Hills -->
        <div class="hill h1" style="transform: translate({x * -10}px, 0)"></div>
        <div class="hill h2" style="transform: translate({x * -5}px, 0)"></div>

        <!-- The Bridge -->
        <div class="bridge-arch"></div>
        <div class="bridge-deck"></div>

        <!-- Dummy Objects -->
        <div class="object o1" style="transform: translate({x * 5}px, 0)"></div>
        <div
            class="object o2"
            style="transform: translate({x * 10}px, 0)"
        ></div>
        <div
            class="object o3"
            style="transform: translate({x * 15}px, 0)"
        ></div>
    </div>

    <!-- Reflection (Flipped Scene) -->
    <div class="reflection-container">
        <div class="scene-container reflected">
            <div
                class="hill h1"
                style="transform: translate({x * -10}px, 0)"
            ></div>
            <div
                class="hill h2"
                style="transform: translate({x * -5}px, 0)"
            ></div>
            <div class="bridge-arch"></div>
            <div class="bridge-deck"></div>
            <div
                class="object o1"
                style="transform: translate({x * 5}px, 0)"
            ></div>
            <div
                class="object o2"
                style="transform: translate({x * 10}px, 0)"
            ></div>
            <div
                class="object o3"
                style="transform: translate({x * 15}px, 0)"
            ></div>
        </div>
        <div class="water-overlay"></div>
    </div>

    <!-- Dither Overlay -->
    <div class="dither"></div>
</div>

<style>
    .hud-bridge-stone {
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
        inset: -50px; /* Oversize for parallax */
        background: #4a6d8c;
    }

    .sky-gradient {
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, #4a6d8c, #8c7a6d);
    }

    .sun {
        position: absolute;
        top: 20%;
        right: 20%;
        width: 100px;
        height: 100px;
        background: #fff;
        border-radius: 50%;
        box-shadow:
            0 0 50px #fff,
            0 0 100px #ffd700;
        filter: blur(2px);
    }

    .cloud {
        position: absolute;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50px;
        filter: blur(10px);
    }
    .c1 {
        top: 10%;
        left: 10%;
        width: 300px;
        height: 60px;
    }
    .c2 {
        top: 30%;
        left: 40%;
        width: 200px;
        height: 40px;
    }
    .c3 {
        top: 15%;
        right: 30%;
        width: 250px;
        height: 50px;
    }

    .scene-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 60%; /* Top 60% is world */
        overflow: hidden;
    }

    .reflection-container {
        position: absolute;
        top: 60%; /* Starts where world ends */
        left: 0;
        width: 100%;
        height: 40%;
        overflow: hidden;
        background: linear-gradient(to bottom, #4a6d8c, #2f1e1e);
    }

    .reflected {
        transform: scaleY(-1) translateY(100%); /* Flip vertical */
        transform-origin: bottom;
        height: 150%; /* Stretch slightly */
        filter: blur(2px) wave(5px);
        opacity: 0.7;
    }

    .water-overlay {
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.05),
            rgba(255, 255, 255, 0.05) 1px,
            transparent 1px,
            transparent 4px
        );
        mix-blend-mode: overlay;
    }

    .hill {
        position: absolute;
        bottom: 0;
        background: #5d4037;
        border-radius: 100% 100% 0 0;
    }
    .h1 {
        left: -10%;
        width: 60%;
        height: 60%;
        opacity: 0.8;
    }
    .h2 {
        right: -10%;
        width: 70%;
        height: 50%;
    }

    .bridge-arch {
        position: absolute;
        bottom: 0;
        left: 10%;
        width: 80%;
        height: 200px;
        border: 60px solid #8b7355;
        border-bottom: none;
        border-radius: 50% 50% 0 0;
        box-shadow: inset 0 20px 50px rgba(0, 0, 0, 0.5);
    }

    .bridge-deck {
        position: absolute;
        bottom: 200px;
        left: 0;
        width: 100%;
        height: 40px;
        background: linear-gradient(to bottom, #8b7355, #5d4037);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }

    .object {
        position: absolute;
        bottom: 240px; /* On deck */
        width: 60px;
        height: 60px;
        background: radial-gradient(circle at 30% 30%, #ffd700, #8b7355);
        border-radius: 50%;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
        transition: transform 0.1s ease-out;
    }
    .o1 {
        left: 30%;
    }
    .o2 {
        left: 50%;
        width: 80px;
        height: 80px;
        bottom: 240px;
    }
    .o3 {
        left: 70%;
    }
</style>
