<script lang="ts">
    let x = 50;
    let y = 50;

    function handleMouseMove(e: MouseEvent) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        x = ((e.clientX - rect.left) / rect.width) * 100;
        y = ((e.clientY - rect.top) / rect.height) * 100;
    }
</script>

<div class="hud-myst-base" on:mousemove={handleMouseMove}>
    <div class="letterbox">
        <div class="scene-view">
            <!-- Base Scene (Starry Abyss) -->
            <div class="void-bg"></div>
            <div class="island i1"></div>
            <div class="island i2"></div>

            <!-- Revealed Scene (Bridge) -->
            <div
                class="reveal-layer"
                style="
					mask-image: radial-gradient(circle at {x}% {y}%, black 15%, transparent 30%);
					-webkit-mask-image: radial-gradient(circle at {x}% {y}%, black 15%, transparent 30%);
				"
            >
                <div class="void-bg lit"></div>
                <div class="island i1 lit"></div>
                <div class="island i2 lit"></div>
                <div class="bridge"></div>
                <div class="star s1"></div>
                <div class="star s2"></div>
                <div class="star s3"></div>
            </div>
        </div>
    </div>
</div>

<style>
    .hud-myst-base {
        width: 100%;
        height: 100%;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: none;
    }

    .letterbox {
        width: 640px;
        height: 480px;
        background: #000;
        border: 1px solid #333;
        position: relative;
        overflow: hidden;
    }

    .scene-view {
        width: 100%;
        height: 100%;
        position: relative;
        filter: contrast(110%) brightness(90%);
    }
    .scene-view::after {
        content: "";
        position: absolute;
        inset: 0;
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzjIHFBmAApgMakCDg6OCAC9Sw0R+g065AAAAABJRU5ErkJggg==");
        opacity: 0.15;
        pointer-events: none;
        z-index: 100;
    }

    .void-bg {
        position: absolute;
        inset: 0;
        background: #000;
    }
    .void-bg.lit {
        background: radial-gradient(circle at 50% 50%, #1a237e, #000);
    }

    .island {
        position: absolute;
        width: 150px;
        height: 80px;
        background: #111;
        border-radius: 50%;
        transform: rotateX(60deg);
    }
    .island.lit {
        background: radial-gradient(circle at 30% 30%, #5c6bc0, #283593);
        box-shadow: 0 0 20px rgba(92, 107, 192, 0.5);
    }
    .i1 {
        top: 30%;
        left: 20%;
    }
    .i2 {
        bottom: 30%;
        right: 20%;
    }

    .bridge {
        position: absolute;
        top: 40%;
        left: 30%;
        width: 300px;
        height: 100px;
        background: transparent;
        border-top: 4px dashed #fff;
        transform: rotate(15deg);
        opacity: 0.5;
        box-shadow: 0 -10px 20px rgba(255, 255, 255, 0.2);
    }

    .star {
        position: absolute;
        width: 4px;
        height: 4px;
        background: #fff;
        box-shadow: 0 0 10px #fff;
        animation: twinkle 2s infinite;
    }
    .s1 {
        top: 10%;
        right: 10%;
    }
    .s2 {
        bottom: 10%;
        left: 10%;
    }
    .s3 {
        top: 50%;
        left: 50%;
    }

    .reveal-layer {
        position: absolute;
        inset: 0;
    }

    @keyframes twinkle {
        0%,
        100% {
            opacity: 0.5;
            transform: scale(1);
        }
        50% {
            opacity: 1;
            transform: scale(1.5);
        }
    }
</style>
