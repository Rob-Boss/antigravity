<script lang="ts">
    let offset = { x: 0, y: 0 };

    function handleMouseMove(e: MouseEvent) {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        offset = {
            x: (clientX / innerWidth - 0.5) * 10,
            y: (clientY / innerHeight - 0.5) * 10,
        };
    }
</script>

<div class="hud-riso" on:mousemove={handleMouseMove}>
    <div class="paper-texture"></div>

    <!-- Layer 1: Pink -->
    <div
        class="ink-layer pink"
        style="transform: translate({offset.x}px, {offset.y}px)"
    >
        <div class="circle c1"></div>
        <div class="text-block">RISO</div>
    </div>

    <!-- Layer 2: Blue -->
    <div
        class="ink-layer blue"
        style="transform: translate({-offset.x}px, {-offset.y}px)"
    >
        <div class="circle c2"></div>
        <div class="text-block">GRAPH</div>
    </div>

    <!-- Layer 3: Yellow -->
    <div class="ink-layer yellow">
        <div class="stripe"></div>
    </div>
</div>

<style>
    .hud-riso {
        width: 100%;
        height: 100%;
        background: #fffbf0; /* Warm paper */
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .paper-texture {
        position: absolute;
        inset: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E");
        pointer-events: none;
        z-index: 100;
    }

    .ink-layer {
        position: absolute;
        inset: 0;
        mix-blend-mode: multiply;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .pink {
        color: #ff007f;
        fill: #ff007f;
    }
    .blue {
        color: #0044ff;
        fill: #0044ff;
    }
    .yellow {
        color: #ffcc00;
        fill: #ffcc00;
    }

    .circle {
        position: absolute;
        border-radius: 50%;
        opacity: 0.8;
    }

    .c1 {
        width: 300px;
        height: 300px;
        background: currentColor;
        top: 20%;
        left: 30%;
        /* Grainy gradient mask */
        mask-image: radial-gradient(circle, black 50%, transparent 80%);
    }

    .c2 {
        width: 250px;
        height: 250px;
        background: currentColor;
        bottom: 20%;
        right: 30%;
        mask-image: radial-gradient(circle, black 50%, transparent 80%);
    }

    .text-block {
        font-family: "Arial Black", sans-serif;
        font-size: 120px;
        font-weight: 900;
        opacity: 0.9;
        letter-spacing: -5px;
    }

    .stripe {
        position: absolute;
        width: 100%;
        height: 100px;
        background: repeating-linear-gradient(
            45deg,
            currentColor,
            currentColor 10px,
            transparent 10px,
            transparent 20px
        );
        opacity: 0.4;
        transform: rotate(-15deg);
    }
</style>
