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
            <!-- Base Scene (Overcast) -->
            <div class="sky-bg"></div>
            <div class="hedge left"></div>
            <div class="hedge right"></div>
            <div class="fountain-base"></div>

            <!-- Revealed Scene (Sunlit) -->
            <div
                class="reveal-layer"
                style="
					mask-image: radial-gradient(circle at {x}% {y}%, black 15%, transparent 30%);
					-webkit-mask-image: radial-gradient(circle at {x}% {y}%, black 15%, transparent 30%);
				"
            >
                <div class="sky-bg lit"></div>
                <div class="hedge left lit"></div>
                <div class="hedge right lit"></div>
                <div class="fountain-base lit">
                    <div class="water"></div>
                </div>
                <div class="flower f1"></div>
                <div class="flower f2"></div>
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

    .sky-bg {
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, #445, #667);
    }
    .sky-bg.lit {
        background: linear-gradient(to bottom, #87ceeb, #e0f7fa);
    }

    .hedge {
        position: absolute;
        bottom: 0;
        width: 200px;
        height: 300px;
        background: #1a261a;
        border-radius: 100px 100px 0 0;
    }
    .left {
        left: -50px;
    }
    .right {
        right: -50px;
    }

    .hedge.lit {
        background: radial-gradient(circle at 30% 30%, #4caf50, #1b5e20);
        /* Leaf texture */
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.2'/%3E%3C/svg%3E");
    }

    .fountain-base {
        position: absolute;
        bottom: 50px;
        left: 50%;
        transform: translateX(-50%);
        width: 200px;
        height: 100px;
        background: #333;
        border-radius: 10px;
    }
    .fountain-base.lit {
        background: linear-gradient(to right, #888, #ccc, #888);
    }

    .water {
        position: absolute;
        top: -50px;
        left: 50%;
        transform: translateX(-50%);
        width: 10px;
        height: 60px;
        background: #fff;
        opacity: 0.6;
        box-shadow: 0 0 10px #fff;
    }

    .flower {
        position: absolute;
        width: 20px;
        height: 20px;
        background: #ff4081;
        border-radius: 50%;
        box-shadow: 0 0 5px #ff4081;
    }
    .f1 {
        bottom: 100px;
        left: 50px;
    }
    .f2 {
        bottom: 120px;
        right: 60px;
    }

    .reveal-layer {
        position: absolute;
        inset: 0;
    }
</style>
