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
            <!-- Base Scene (Dark Cave) -->
            <div class="cave-bg"></div>
            <div class="crystal c1"></div>
            <div class="crystal c2"></div>
            <div class="crystal c3"></div>

            <!-- Revealed Scene (Glowing) -->
            <div
                class="reveal-layer"
                style="
					mask-image: radial-gradient(circle at {x}% {y}%, black 15%, transparent 30%);
					-webkit-mask-image: radial-gradient(circle at {x}% {y}%, black 15%, transparent 30%);
				"
            >
                <div class="cave-bg lit"></div>
                <div class="crystal c1 lit"></div>
                <div class="crystal c2 lit"></div>
                <div class="crystal c3 lit"></div>
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

    .cave-bg {
        position: absolute;
        inset: 0;
        background: #100010;
    }
    .cave-bg.lit {
        background: radial-gradient(circle at 50% 50%, #300030, #100010);
    }

    .crystal {
        position: absolute;
        bottom: 0;
        background: #200020;
        clip-path: polygon(50% 0, 100% 40%, 80% 100%, 20% 100%, 0 40%);
    }
    .crystal.lit {
        background: linear-gradient(135deg, #e040fb, #7b1fa2);
        box-shadow: 0 0 20px #e040fb;
    }
    .c1 {
        left: 10%;
        width: 100px;
        height: 200px;
    }
    .c2 {
        left: 40%;
        width: 150px;
        height: 300px;
    }
    .c3 {
        right: 15%;
        width: 80px;
        height: 150px;
    }

    .reveal-layer {
        position: absolute;
        inset: 0;
    }
</style>
