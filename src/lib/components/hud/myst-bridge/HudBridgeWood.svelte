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

<div class="hud-bridge-wood" on:mousemove={handleMouseMove}>
    <div
        class="sky-layer"
        style="transform: translate({x * -20}px, {y * -20}px)"
    >
        <div class="sky-gradient"></div>
        <div class="sun"></div>
        <div class="cloud c1"></div>
    </div>

    <div class="scene-container">
        <div
            class="cliff c-left"
            style="transform: translate({x * -10}px, 0)"
        ></div>
        <div
            class="cliff c-right"
            style="transform: translate({x * -5}px, 0)"
        ></div>

        <!-- Truss Bridge -->
        <div class="truss-container">
            {#each Array(10) as _, i}
                <div class="truss-x" style="left: {i * 10}%"></div>
            {/each}
            <div class="deck-planks"></div>
        </div>

        <!-- Objects: Crates -->
        <div
            class="crate cr1"
            style="transform: translate({x * 5}px, 0) rotate(5deg)"
        ></div>
        <div
            class="crate cr2"
            style="transform: translate({x * 8}px, 0) rotate(-2deg)"
        ></div>
    </div>

    <div class="reflection-container">
        <div class="scene-container reflected">
            <div
                class="cliff c-left"
                style="transform: translate({x * -10}px, 0)"
            ></div>
            <div
                class="cliff c-right"
                style="transform: translate({x * -5}px, 0)"
            ></div>
            <div class="truss-container">
                {#each Array(10) as _, i}
                    <div class="truss-x" style="left: {i * 10}%"></div>
                {/each}
                <div class="deck-planks"></div>
            </div>
            <div
                class="crate cr1"
                style="transform: translate({x * 5}px, 0) rotate(5deg)"
            ></div>
            <div
                class="crate cr2"
                style="transform: translate({x * 8}px, 0) rotate(-2deg)"
            ></div>
        </div>
        <div class="water-overlay"></div>
    </div>

    <div class="dither"></div>
</div>

<style>
    .hud-bridge-wood {
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
        background: linear-gradient(to bottom, #6d8c9c, #8c7a6d);
    }
    .sun {
        position: absolute;
        top: 10%;
        left: 10%;
        width: 80px;
        height: 80px;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 0 40px #fff;
    }
    .cloud {
        position: absolute;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50px;
        filter: blur(15px);
    }
    .c1 {
        top: 20%;
        right: 20%;
        width: 400px;
        height: 80px;
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
        background: linear-gradient(to bottom, #4a6d8c, #2f1e1e);
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

    .cliff {
        position: absolute;
        bottom: 0;
        width: 30%;
        height: 100%;
        background: #5d4037;
    }
    .c-left {
        left: 0;
        clip-path: polygon(0 0, 100% 40%, 80% 100%, 0 100%);
    }
    .c-right {
        right: 0;
        clip-path: polygon(0 40%, 100% 0, 100% 100%, 20% 100%);
    }

    .truss-container {
        position: absolute;
        bottom: 50px;
        left: 10%;
        width: 80%;
        height: 100px;
        border-bottom: 10px solid #4a3b2a;
    }
    .truss-x {
        position: absolute;
        bottom: 0;
        width: 10%;
        height: 100%;
        border-left: 5px solid #4a3b2a;
        border-right: 5px solid #4a3b2a;
    }
    .truss-x::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
                to top right,
                transparent 48%,
                #4a3b2a 48%,
                #4a3b2a 52%,
                transparent 52%
            ),
            linear-gradient(
                to top left,
                transparent 48%,
                #4a3b2a 48%,
                #4a3b2a 52%,
                transparent 52%
            );
    }
    .deck-planks {
        position: absolute;
        top: 0;
        width: 100%;
        height: 20px;
        background: repeating-linear-gradient(
            90deg,
            #5d4037,
            #5d4037 10px,
            #2f1e1e 12px
        );
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
    }

    .crate {
        position: absolute;
        bottom: 170px;
        width: 60px;
        height: 60px;
        background: #8b7355;
        border: 2px solid #4a3b2a;
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
    }
    .crate::after {
        content: "";
        position: absolute;
        inset: 5px;
        border: 2px solid #4a3b2a;
    }
    .cr1 {
        left: 40%;
    }
    .cr2 {
        left: 55%;
        width: 50px;
        height: 50px;
        bottom: 170px;
    }
</style>
