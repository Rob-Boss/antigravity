<script lang="ts">
    let x = 50;
    let y = 50;

    function handleMouseMove(e: MouseEvent) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        x = ((e.clientX - rect.left) / rect.width) * 100;
        y = ((e.clientY - rect.top) / rect.height) * 100;
    }
</script>

<div class="hud-arch" on:mousemove={handleMouseMove}>
    <!-- The Ancient Wall (Gold/Treasure) -->
    <div class="wall-gold">
        <div class="glyph g1">𓀀</div>
        <div class="glyph g2">𓀃</div>
        <div class="glyph g3">𓁁</div>
        <div class="gem"></div>
    </div>

    <!-- The Dust Layer (Covering it) -->
    <div
        class="dust-layer"
        style="
			mask-image: radial-gradient(circle at {x}% {y}%, transparent 10%, black 30%);
			-webkit-mask-image: radial-gradient(circle at {x}% {y}%, transparent 10%, black 30%);
		"
    ></div>

    <div class="brush-cursor" style="left: {x}%; top: {y}%"></div>
</div>

<style>
    .hud-arch {
        width: 100%;
        height: 100%;
        background: #ffd700;
        position: relative;
        overflow: hidden;
        cursor: none;
    }

    .wall-gold {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle, #ffd700, #b8860b);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .glyph {
        font-size: 100px;
        opacity: 0.5;
        position: absolute;
    }
    .g1 {
        top: 20%;
        left: 20%;
    }
    .g2 {
        bottom: 20%;
        right: 20%;
    }
    .g3 {
        top: 40%;
        left: 50%;
    }

    .gem {
        width: 50px;
        height: 50px;
        background: #f00;
        transform: rotate(45deg);
        box-shadow: 0 0 20px #f00;
    }

    .dust-layer {
        position: absolute;
        inset: 0;
        background: #8d6e63; /* Dirt color */
        /* Sand texture */
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E");
    }

    .brush-cursor {
        position: absolute;
        width: 100px;
        height: 100px;
        border: 2px dashed rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
    }
</style>
