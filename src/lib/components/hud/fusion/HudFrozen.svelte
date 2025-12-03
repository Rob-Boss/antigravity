<script lang="ts">
    let x = 50;
    let y = 50;

    function handleMouseMove(e: MouseEvent) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        x = ((e.clientX - rect.left) / rect.width) * 100;
        y = ((e.clientY - rect.top) / rect.height) * 100;
    }
</script>

<div class="hud-frozen" on:mousemove={handleMouseMove}>
    <!-- Blizzard Layer -->
    <div class="blizzard"></div>

    <!-- Thermal Reveal -->
    <div
        class="thermal-layer"
        style="
			mask-image: radial-gradient(circle at {x}% {y}%, black 20%, transparent 40%);
			-webkit-mask-image: radial-gradient(circle at {x}% {y}%, black 20%, transparent 40%);
		"
    >
        <div class="heat-sig h1"></div>
        <div class="heat-sig h2"></div>
    </div>

    <div class="visor-ui" style="left: {x}%; top: {y}%">
        <div class="crosshair"></div>
        <div class="temp-readout">-40°C / 37°C</div>
    </div>
</div>

<style>
    .hud-frozen {
        width: 100%;
        height: 100%;
        background: #fff;
        position: relative;
        overflow: hidden;
        cursor: none;
    }

    .blizzard {
        position: absolute;
        inset: 0;
        background: #fff;
        opacity: 0.9;
        /* Noise for snow */
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.2'/%3E%3C/svg%3E");
    }

    .thermal-layer {
        position: absolute;
        inset: 0;
        background: #0000ff; /* Cold blue background */
    }

    .heat-sig {
        position: absolute;
        border-radius: 50%;
        background: radial-gradient(circle, #fff, #ff0, #f00, transparent);
        filter: blur(10px);
    }
    .h1 {
        top: 40%;
        left: 30%;
        width: 100px;
        height: 150px;
    }
    .h2 {
        top: 60%;
        right: 20%;
        width: 80px;
        height: 80px;
    }

    .visor-ui {
        position: absolute;
        transform: translate(-50%, -50%);
        pointer-events: none;
    }

    .crosshair {
        width: 100px;
        height: 100px;
        border: 2px solid #f00;
        border-radius: 50%;
    }
    .crosshair::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 4px;
        height: 4px;
        background: #f00;
        transform: translate(-50%, -50%);
    }

    .temp-readout {
        position: absolute;
        top: 110%;
        left: 50%;
        transform: translateX(-50%);
        color: #f00;
        font-family: monospace;
        font-weight: bold;
        white-space: nowrap;
        background: rgba(0, 0, 0, 0.5);
        padding: 2px;
    }
</style>
