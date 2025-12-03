<script lang="ts">
    let x = 50;
    let y = 50;

    function handleMouseMove(e: MouseEvent) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        x = ((e.clientX - rect.left) / rect.width) * 100;
        y = ((e.clientY - rect.top) / rect.height) * 100;
    }
</script>

<div class="hud-deep" on:mousemove={handleMouseMove}>
    <div class="water-overlay"></div>

    <!-- Hidden Creatures -->
    <div
        class="spotlight-reveal"
        style="
			mask-image: radial-gradient(circle at {x}% {y}%, black 5%, transparent 30%);
			-webkit-mask-image: radial-gradient(circle at {x}% {y}%, black 5%, transparent 30%);
		"
    >
        <div class="creature c1">
            <div class="eye"></div>
        </div>
        <div class="creature c2">
            <div class="tentacle"></div>
        </div>
        <div class="ruins">
            <div class="pillar"></div>
            <div class="pillar p2"></div>
        </div>
    </div>

    <!-- Submarine UI -->
    <div class="sub-ui">
        <div class="depth">DEPTH: 10,900m</div>
        <div class="pressure">PRESSURE: CRITICAL</div>
    </div>
</div>

<style>
    .hud-deep {
        width: 100%;
        height: 100%;
        background: #000510;
        position: relative;
        overflow: hidden;
        cursor: none;
    }

    .water-overlay {
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
            0deg,
            rgba(0, 20, 40, 0.1),
            rgba(0, 20, 40, 0.1) 1px,
            transparent 1px,
            transparent 4px
        );
        pointer-events: none;
        z-index: 10;
    }

    .spotlight-reveal {
        position: absolute;
        inset: 0;
        background: #002233; /* Slightly lighter deep blue */
    }

    .creature {
        position: absolute;
        background: #00ffaa;
        box-shadow: 0 0 20px #00ffaa;
        opacity: 0.8;
    }

    .c1 {
        top: 30%;
        left: 20%;
        width: 100px;
        height: 40px;
        border-radius: 50%;
        animation: swim 10s linear infinite;
    }
    .eye {
        width: 10px;
        height: 10px;
        background: #fff;
        border-radius: 50%;
        position: absolute;
        right: 10px;
        top: 10px;
    }

    .c2 {
        bottom: 20%;
        right: 30%;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: radial-gradient(circle, #00ffaa, transparent);
        animation: pulse 2s infinite;
    }

    .ruins {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 200px;
    }
    .pillar {
        position: absolute;
        bottom: 0;
        left: 40%;
        width: 40px;
        height: 150px;
        background: #004455;
        border: 2px solid #006677;
    }
    .p2 {
        left: 60%;
        height: 100px;
    }

    .sub-ui {
        position: absolute;
        bottom: 20px;
        left: 20px;
        color: #00ffaa;
        font-family: monospace;
        text-shadow: 0 0 5px #00ffaa;
        z-index: 20;
    }

    @keyframes swim {
        from {
            transform: translateX(-200px);
        }
        to {
            transform: translateX(800px);
        }
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 0.5;
            transform: scale(1);
        }
        50% {
            opacity: 1;
            transform: scale(1.1);
        }
    }
</style>
