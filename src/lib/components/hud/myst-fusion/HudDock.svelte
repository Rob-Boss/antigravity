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
            <!-- Base Scene (Foggy) -->
            <div class="fog-bg"></div>
            <div class="water-base"></div>
            <div class="post p1"></div>
            <div class="post p2"></div>
            <div class="post p3"></div>

            <!-- Revealed Scene (Lantern Light) -->
            <div
                class="reveal-layer"
                style="
					mask-image: radial-gradient(circle at {x}% {y}%, black 15%, transparent 30%);
					-webkit-mask-image: radial-gradient(circle at {x}% {y}%, black 15%, transparent 30%);
				"
            >
                <div class="fog-bg lit"></div>
                <div class="water-base lit"></div>
                <div class="post p1 lit"></div>
                <div class="post p2 lit"></div>
                <div class="post p3 lit"></div>
                <div class="boat"></div>
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

    .fog-bg {
        position: absolute;
        inset: 0;
        background: #222;
    }
    .fog-bg.lit {
        background: #556;
        /* Fog noise */
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E");
    }

    .water-base {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 40%;
        background: #112;
    }
    .water-base.lit {
        background: linear-gradient(to bottom, #223, #112);
    }

    .post {
        position: absolute;
        bottom: 20%;
        width: 40px;
        height: 150px;
        background: #111;
        border-radius: 5px;
    }
    .post.lit {
        background: linear-gradient(90deg, #3e2723, #5d4037, #3e2723);
    }
    .p1 {
        left: 20%;
        height: 200px;
    }
    .p2 {
        left: 50%;
        height: 150px;
        bottom: 30%;
    }
    .p3 {
        right: 20%;
        height: 180px;
    }

    .boat {
        position: absolute;
        bottom: 35%;
        left: 60%;
        width: 100px;
        height: 40px;
        background: #3e2723;
        clip-path: polygon(0 0, 100% 0, 80% 100%, 20% 100%);
        animation: bob 3s ease-in-out infinite;
    }

    .reveal-layer {
        position: absolute;
        inset: 0;
    }

    @keyframes bob {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(5px);
        }
    }
</style>
