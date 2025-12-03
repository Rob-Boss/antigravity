<script lang="ts">
    let x = 50;
    let y = 50;

    function handleMouseMove(e: MouseEvent) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        x = ((e.clientX - rect.left) / rect.width) * 100;
        y = ((e.clientY - rect.top) / rect.height) * 100;
    }
</script>

<div class="hud-circuit" on:mousemove={handleMouseMove}>
    <!-- Dead Panel -->
    <div class="panel-dead">
        <div class="chip"></div>
        <div class="trace t1"></div>
        <div class="trace t2"></div>
    </div>

    <!-- Live Current Reveal -->
    <div
        class="current-layer"
        style="
			mask-image: radial-gradient(circle at {x}% {y}%, black 5%, transparent 15%);
			-webkit-mask-image: radial-gradient(circle at {x}% {y}%, black 5%, transparent 15%);
		"
    >
        <div class="chip live"></div>
        <div class="trace t1 live"></div>
        <div class="trace t2 live"></div>
        <div class="spark"></div>
    </div>

    <div class="probe" style="left: {x}%; top: {y}%"></div>
</div>

<style>
    .hud-circuit {
        width: 100%;
        height: 100%;
        background: #111;
        position: relative;
        overflow: hidden;
        cursor: none;
    }

    .panel-dead {
        position: absolute;
        inset: 0;
        background: #222;
    }

    .chip {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100px;
        height: 100px;
        background: #333;
        border: 2px solid #444;
    }

    .trace {
        position: absolute;
        background: #333;
    }
    .t1 {
        top: 50%;
        left: 0;
        width: 50%;
        height: 10px;
        transform: translateY(-5px);
    }
    .t2 {
        top: 0;
        left: 50%;
        width: 10px;
        height: 50%;
        transform: translateX(-5px);
    }

    .current-layer {
        position: absolute;
        inset: 0;
        background: #000;
    }

    .live {
        background: #00ffff;
        box-shadow: 0 0 20px #00ffff;
    }

    .spark {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 10px;
        height: 10px;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 0 10px #fff;
        animation: zap 0.1s infinite;
    }

    .probe {
        position: absolute;
        width: 20px;
        height: 20px;
        border: 2px solid #f00;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
    }
    .probe::after {
        content: "+";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #f00;
    }

    @keyframes zap {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(2);
        }
    }
</style>
