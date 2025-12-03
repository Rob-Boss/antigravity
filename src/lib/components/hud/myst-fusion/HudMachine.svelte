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
            <!-- Base Scene (Dark Industrial) -->
            <div class="wall-bg"></div>
            <div class="gear g1"></div>
            <div class="gear g2"></div>
            <div class="pipe p1"></div>

            <!-- Revealed Scene (Steam & Rust) -->
            <div
                class="reveal-layer"
                style="
					mask-image: radial-gradient(circle at {x}% {y}%, black 15%, transparent 30%);
					-webkit-mask-image: radial-gradient(circle at {x}% {y}%, black 15%, transparent 30%);
				"
            >
                <div class="wall-bg lit"></div>
                <div class="gear g1 lit"></div>
                <div class="gear g2 lit"></div>
                <div class="pipe p1 lit"></div>
                <div class="steam"></div>
                <div class="gauge">
                    <div class="needle"></div>
                </div>
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

    .wall-bg {
        position: absolute;
        inset: 0;
        background: #1a1a1a;
    }
    .wall-bg.lit {
        background: #3e2723;
        /* Rust texture */
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E");
    }

    .gear {
        position: absolute;
        border-radius: 50%;
        background: #222;
    }
    .gear.lit {
        background: radial-gradient(circle, #8d6e63, #3e2723);
        border: 4px dashed #5d4037;
    }
    .g1 {
        top: 20%;
        left: 10%;
        width: 200px;
        height: 200px;
    }
    .g2 {
        bottom: 10%;
        right: 20%;
        width: 150px;
        height: 150px;
        transform: rotate(15deg);
    }

    .pipe {
        position: absolute;
        background: #111;
    }
    .pipe.lit {
        background: linear-gradient(90deg, #555, #999, #555);
    }
    .p1 {
        top: 10%;
        right: 10%;
        width: 20px;
        height: 400px;
    }

    .steam {
        position: absolute;
        top: 40%;
        right: 12%;
        width: 40px;
        height: 100px;
        background: #fff;
        filter: blur(20px);
        opacity: 0.4;
        animation: rise 2s infinite linear;
    }

    .gauge {
        position: absolute;
        top: 30%;
        right: 8%;
        width: 60px;
        height: 60px;
        background: #fff;
        border-radius: 50%;
        border: 4px solid #555;
    }
    .needle {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 25px;
        height: 2px;
        background: #f00;
        transform-origin: left;
        transform: rotate(-45deg);
        animation: twitch 0.5s infinite;
    }

    .reveal-layer {
        position: absolute;
        inset: 0;
    }

    @keyframes rise {
        from {
            transform: translateY(0);
            opacity: 0.4;
        }
        to {
            transform: translateY(-50px);
            opacity: 0;
        }
    }
    @keyframes twitch {
        0% {
            transform: rotate(-45deg);
        }
        50% {
            transform: rotate(-30deg);
        }
        100% {
            transform: rotate(-45deg);
        }
    }
</style>
