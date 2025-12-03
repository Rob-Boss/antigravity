<script lang="ts">
    let x = 50;
    let y = 50;

    function handleMouseMove(e: MouseEvent) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        x = ((e.clientX - rect.left) / rect.width) * 100;
        y = ((e.clientY - rect.top) / rect.height) * 100;
    }
</script>

<div class="hud-psychic" on:mousemove={handleMouseMove}>
    <!-- Normal Room -->
    <div class="room-normal">
        <div class="wallpaper"></div>
        <div class="portrait"></div>
        <div class="chair"></div>
    </div>

    <!-- Spirit World Reveal -->
    <div
        class="spirit-layer"
        style="
			mask-image: radial-gradient(circle at {x}% {y}%, black 15%, transparent 25%);
			-webkit-mask-image: radial-gradient(circle at {x}% {y}%, black 15%, transparent 25%);
		"
    >
        <div class="ghost"></div>
        <div class="writing">GET OUT</div>
    </div>

    <div class="lens-rim" style="left: {x}%; top: {y}%"></div>
</div>

<style>
    .hud-psychic {
        width: 100%;
        height: 100%;
        background: #3e2723;
        position: relative;
        overflow: hidden;
        cursor: none;
    }

    .room-normal {
        position: absolute;
        inset: 0;
        filter: sepia(0.5);
    }

    .wallpaper {
        position: absolute;
        inset: 0;
        background-image: radial-gradient(#5d4037 2px, transparent 2px);
        background-size: 20px 20px;
        opacity: 0.5;
    }

    .portrait {
        position: absolute;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 140px;
        background: #1a1005;
        border: 4px solid #ffd700;
    }

    .chair {
        position: absolute;
        bottom: 0;
        left: 20%;
        width: 80px;
        height: 120px;
        background: #4e342e;
    }

    .spirit-layer {
        position: absolute;
        inset: 0;
        background: #000;
        filter: invert(1) hue-rotate(180deg); /* Spectral effect */
    }

    .ghost {
        position: absolute;
        top: 100px;
        right: 20%;
        width: 60px;
        height: 100px;
        background: #fff;
        border-radius: 30px 30px 0 0;
        opacity: 0.8;
        filter: blur(5px);
        animation: float 3s infinite ease-in-out;
    }

    .writing {
        position: absolute;
        top: 40%;
        left: 40%;
        font-family: "Times New Roman", serif;
        font-size: 48px;
        color: #f00;
        transform: rotate(-10deg);
        font-weight: bold;
        letter-spacing: 5px;
    }

    .lens-rim {
        position: absolute;
        width: 250px;
        height: 250px;
        border: 10px solid #c0c0c0;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    }

    @keyframes float {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-20px);
        }
    }
</style>
