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
            <!-- Base Scene (Dark Stone) -->
            <div class="stone-bg"></div>
            <div class="pillar p1"></div>
            <div class="pillar p2"></div>
            <div class="altar"></div>

            <!-- Revealed Scene (Gold & Glyphs) -->
            <div
                class="reveal-layer"
                style="
					mask-image: radial-gradient(circle at {x}% {y}%, black 15%, transparent 30%);
					-webkit-mask-image: radial-gradient(circle at {x}% {y}%, black 15%, transparent 30%);
				"
            >
                <div class="stone-bg lit"></div>
                <div class="pillar p1 lit">
                    <div class="glyph">𓀀</div>
                </div>
                <div class="pillar p2 lit">
                    <div class="glyph">𓁁</div>
                </div>
                <div class="altar lit">
                    <div class="orb"></div>
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

    .stone-bg {
        position: absolute;
        inset: 0;
        background: #111;
    }
    .stone-bg.lit {
        background: #333;
        /* Stone texture */
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.2'/%3E%3C/svg%3E");
    }

    .pillar {
        position: absolute;
        top: 10%;
        bottom: 10%;
        width: 80px;
        background: #222;
    }
    .pillar.lit {
        background: linear-gradient(90deg, #444, #666, #444);
    }
    .p1 {
        left: 20%;
    }
    .p2 {
        right: 20%;
    }

    .glyph {
        font-size: 40px;
        color: #ffd700;
        text-align: center;
        margin-top: 50px;
        text-shadow: 0 0 10px #ffd700;
        opacity: 0.8;
    }

    .altar {
        position: absolute;
        bottom: 10%;
        left: 50%;
        transform: translateX(-50%);
        width: 150px;
        height: 100px;
        background: #222;
        clip-path: polygon(20% 0, 80% 0, 100% 100%, 0 100%);
    }
    .altar.lit {
        background: linear-gradient(to bottom, #444, #222);
    }

    .orb {
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 60px;
        background: #ffd700;
        border-radius: 50%;
        box-shadow: 0 0 20px #ffd700;
    }

    .reveal-layer {
        position: absolute;
        inset: 0;
    }
</style>
