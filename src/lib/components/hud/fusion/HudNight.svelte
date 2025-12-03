<script lang="ts">
    let x = 50;
    let y = 50;

    function handleMouseMove(e: MouseEvent) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        x = ((e.clientX - rect.left) / rect.width) * 100;
        y = ((e.clientY - rect.top) / rect.height) * 100;
    }
</script>

<div class="hud-night" on:mousemove={handleMouseMove}>
    <div class="scanlines"></div>

    <!-- Dark Warehouse -->
    <div class="dark-layer">
        <div class="crate c1"></div>
        <div class="crate c2"></div>
    </div>

    <!-- Night Vision Reveal -->
    <div
        class="vision-layer"
        style="
			mask-image: radial-gradient(circle at {x}% {y}%, black 15%, transparent 30%);
			-webkit-mask-image: radial-gradient(circle at {x}% {y}%, black 15%, transparent 30%);
		"
    >
        <div class="intruder">
            <div class="body"></div>
            <div class="head"></div>
        </div>
    </div>

    <div class="rec-ui">REC ● [CAM 04]</div>
</div>

<style>
    .hud-night {
        width: 100%;
        height: 100%;
        background: #000;
        position: relative;
        overflow: hidden;
        cursor: none;
    }

    .scanlines {
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
            0deg,
            rgba(0, 255, 0, 0.1),
            rgba(0, 255, 0, 0.1) 1px,
            transparent 1px,
            transparent 3px
        );
        pointer-events: none;
        z-index: 20;
    }

    .dark-layer {
        position: absolute;
        inset: 0;
        background: #051005;
    }

    .crate {
        position: absolute;
        background: #0a200a;
        border: 1px solid #0f300f;
    }
    .c1 {
        bottom: 20px;
        left: 20px;
        width: 100px;
        height: 100px;
    }
    .c2 {
        bottom: 20px;
        right: 50px;
        width: 150px;
        height: 120px;
    }

    .vision-layer {
        position: absolute;
        inset: 0;
        background: #00ff00; /* Night vision green */
        mix-blend-mode: hard-light;
        filter: contrast(150%) brightness(120%);
        /* Noise texture */
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E");
    }

    .intruder {
        position: absolute;
        bottom: 40px;
        left: 45%;
        width: 40px;
        height: 100px;
    }
    .body {
        width: 100%;
        height: 70%;
        background: #004400;
        position: absolute;
        bottom: 0;
    }
    .head {
        width: 30px;
        height: 30px;
        background: #004400;
        border-radius: 50%;
        position: absolute;
        top: 0;
        left: 5px;
    }

    .rec-ui {
        position: absolute;
        top: 20px;
        right: 20px;
        color: #00ff00;
        font-family: monospace;
        animation: blink 1s infinite;
        z-index: 30;
    }

    @keyframes blink {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
    }
</style>
