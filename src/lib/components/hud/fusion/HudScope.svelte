<script lang="ts">
    let x = 50;
    let y = 50;

    function handleMouseMove(e: MouseEvent) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        x = ((e.clientX - rect.left) / rect.width) * 100;
        y = ((e.clientY - rect.top) / rect.height) * 100;
    }
</script>

<div class="hud-scope" on:mousemove={handleMouseMove}>
    <!-- Blurry Background -->
    <div class="blur-sky">
        <div class="blob b1"></div>
        <div class="blob b2"></div>
        <div class="blob b3"></div>
    </div>

    <!-- Sharp Reveal -->
    <div
        class="sharp-sky"
        style="
			mask-image: radial-gradient(circle at {x}% {y}%, black 15%, transparent 20%);
			-webkit-mask-image: radial-gradient(circle at {x}% {y}%, black 15%, transparent 20%);
		"
    >
        <div class="planet p1">
            <div class="ring"></div>
        </div>
        <div class="galaxy g1"></div>
        <div class="star s1"></div>
    </div>

    <div class="lens-overlay" style="left: {x}%; top: {y}%"></div>
</div>

<style>
    .hud-scope {
        width: 100%;
        height: 100%;
        background: #000;
        position: relative;
        overflow: hidden;
        cursor: none;
    }

    .blur-sky {
        position: absolute;
        inset: 0;
        filter: blur(20px);
        opacity: 0.5;
    }

    .blob {
        position: absolute;
        background: #fff;
        border-radius: 50%;
    }
    .b1 {
        top: 20%;
        left: 20%;
        width: 100px;
        height: 100px;
        background: #ffccaa;
    }
    .b2 {
        bottom: 30%;
        right: 20%;
        width: 150px;
        height: 80px;
        background: #aaccff;
    }
    .b3 {
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
    }

    .sharp-sky {
        position: absolute;
        inset: 0;
        background: #000;
    }

    .planet {
        position: absolute;
        top: 20%;
        left: 20%;
        width: 100px;
        height: 100px;
        background: radial-gradient(circle at 30% 30%, #ffccaa, #aa5500);
        border-radius: 50%;
    }
    .ring {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 160px;
        height: 40px;
        border: 10px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: translate(-50%, -50%) rotate(-20deg);
    }

    .galaxy {
        position: absolute;
        bottom: 30%;
        right: 20%;
        width: 150px;
        height: 80px;
        background: radial-gradient(ellipse, #fff, #aaccff, transparent);
        transform: rotate(30deg);
    }

    .star {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 4px;
        height: 4px;
        background: #fff;
        box-shadow: 0 0 10px #fff;
    }

    .lens-overlay {
        position: absolute;
        width: 250px;
        height: 250px;
        border: 2px solid #fff;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.5); /* Dim surroundings */
    }
    .lens-overlay::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        border: 1px solid rgba(255, 255, 255, 0.5);
        transform: translate(-50%, -50%);
    }
</style>
