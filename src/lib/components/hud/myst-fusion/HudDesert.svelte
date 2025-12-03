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
            <!-- Base Scene (Dark Sand) -->
            <div class="sand-bg"></div>
            <div class="dune d1"></div>
            <div class="dune d2"></div>

            <!-- Revealed Scene (Bright Sun) -->
            <div
                class="reveal-layer"
                style="
					mask-image: radial-gradient(circle at {x}% {y}%, black 15%, transparent 30%);
					-webkit-mask-image: radial-gradient(circle at {x}% {y}%, black 15%, transparent 30%);
				"
            >
                <div class="sand-bg lit"></div>
                <div class="dune d1 lit"></div>
                <div class="dune d2 lit"></div>
                <div class="sun"></div>
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

    .sand-bg {
        position: absolute;
        inset: 0;
        background: #3e2723;
    }
    .sand-bg.lit {
        background: #ffecb3;
        /* Sand texture */
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.2'/%3E%3C/svg%3E");
    }

    .dune {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 40%;
        background: #2d1b0e;
        clip-path: ellipse(80% 100% at 50% 100%);
    }
    .dune.lit {
        background: linear-gradient(to top, #ffd54f, #ffecb3);
    }
    .d1 {
        left: -20%;
        height: 50%;
        transform: rotate(-5deg);
    }
    .d2 {
        right: -20%;
        height: 40%;
        transform: rotate(5deg);
    }

    .sun {
        position: absolute;
        top: 20%;
        left: 50%;
        transform: translateX(-50%);
        width: 80px;
        height: 80px;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 0 50px #fff;
    }

    .reveal-layer {
        position: absolute;
        inset: 0;
    }
</style>
