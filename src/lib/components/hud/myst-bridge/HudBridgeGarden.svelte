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

<div class="hud-bridge-garden" on:mousemove={handleMouseMove}>
    <div
        class="sky-layer"
        style="transform: translate({x * -20}px, {y * -20}px)"
    >
        <div class="sky-gradient"></div>
        <div class="sun"></div>
        <div class="cloud c1"></div>
    </div>

    <div class="scene-container">
        <!-- Stone Bridge covered in vines -->
        <div class="stone-arch"></div>
        <div class="vines"></div>

        <!-- Objects: Planters -->
        <div
            class="planter p1"
            style="transform: translate({x * 5}px, 0)"
        ></div>
        <div
            class="planter p2"
            style="transform: translate({x * 10}px, 0)"
        ></div>
    </div>

    <div class="reflection-container">
        <div class="scene-container reflected">
            <div class="stone-arch"></div>
            <div class="vines"></div>
            <div
                class="planter p1"
                style="transform: translate({x * 5}px, 0)"
            ></div>
            <div
                class="planter p2"
                style="transform: translate({x * 10}px, 0)"
            ></div>
        </div>
        <div class="water-overlay"></div>
    </div>

    <div class="dither"></div>
</div>

<style>
    .hud-bridge-garden {
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
            #a5d6a7,
            #8c7a6d
        ); /* Greenish sky */
    }
    .sun {
        position: absolute;
        top: 10%;
        right: 10%;
        width: 100px;
        height: 100px;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 0 50px #fff;
    }
    .cloud {
        position: absolute;
        background: #fff;
        border-radius: 50px;
        filter: blur(15px);
        opacity: 0.5;
    }
    .c1 {
        top: 20%;
        left: 20%;
        width: 300px;
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
        background: linear-gradient(to bottom, #8c7a6d, #2e7d32);
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

    .stone-arch {
        position: absolute;
        bottom: 0;
        left: 10%;
        width: 80%;
        height: 150px;
        background: #5d4037;
        border-radius: 50% 50% 0 0;
    }

    .vines {
        position: absolute;
        bottom: 0;
        left: 10%;
        width: 80%;
        height: 160px;
        background-image: radial-gradient(
            circle at 50% 50%,
            #2e7d32 2px,
            transparent 2px
        );
        background-size: 20px 20px;
        opacity: 0.8;
    }

    .planter {
        position: absolute;
        bottom: 150px;
        width: 60px;
        height: 40px;
        background: #8b7355;
        clip-path: polygon(0 0, 100% 0, 80% 100%, 20% 100%);
    }
    .planter::after {
        content: "";
        position: absolute;
        bottom: 40px;
        left: 10px;
        width: 40px;
        height: 40px;
        background: #2e7d32; /* Plant */
        border-radius: 50%;
    }
    .p1 {
        left: 30%;
    }
    .p2 {
        left: 60%;
    }
</style>
