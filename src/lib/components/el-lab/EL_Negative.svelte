<script lang="ts">
    let offset = { x: 0, y: 0 };

    function handleMouseMove(e: MouseEvent) {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        offset = {
            x: (clientX / innerWidth - 0.5) * 20,
            y: (clientY / innerHeight - 0.5) * 20,
        };
    }
</script>

<div class="el-riso" on:mousemove={handleMouseMove}>
    <div class="paper-texture"></div>

    <div class="content-wrapper">
        <!-- Layer 1: White -->
        <div
            class="ink-layer white"
            style="transform: translate({offset.x}px, {offset.y}px)"
        >
            <div class="text-stack">
                <div class="line">ERIC</div>
                <div class="line">LUTTRELL</div>
            </div>
        </div>

        <!-- Layer 2: White (Offset) -->
        <div
            class="ink-layer white"
            style="transform: translate({-offset.x}px, {-offset.y}px)"
        >
            <div class="text-stack">
                <div class="line">ERIC</div>
                <div class="line">LUTTRELL</div>
            </div>
        </div>
    </div>
</div>

<style>
    .el-riso {
        width: 100%;
        height: 100%;
        background: #000; /* Black background */
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "Inter", sans-serif;
    }

    .paper-texture {
        position: absolute;
        inset: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E");
        pointer-events: none;
        z-index: 100;
        mix-blend-mode: overlay;
    }

    .content-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .ink-layer {
        position: absolute;
        inset: -100px;
        display: flex;
        align-items: center;
        justify-content: center;
        mix-blend-mode: difference; /* Inverts colors on overlap */
    }

    .white {
        color: #fff;
    }

    .text-stack {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        line-height: 0.85;
    }

    .line {
        font-size: 12vw;
        font-weight: 900;
        letter-spacing: -0.04em;
        white-space: nowrap;
    }
</style>
