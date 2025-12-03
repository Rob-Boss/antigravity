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
            <!-- Base Scene (Night Sky) -->
            <div class="sky-bg"></div>
            <div class="dome"></div>
            <div class="telescope-base"></div>

            <!-- Revealed Scene (Stars & Details) -->
            <div
                class="reveal-layer"
                style="
					mask-image: radial-gradient(circle at {x}% {y}%, black 15%, transparent 30%);
					-webkit-mask-image: radial-gradient(circle at {x}% {y}%, black 15%, transparent 30%);
				"
            >
                <div class="sky-bg lit">
                    {#each Array(50) as _}
                        <div
                            class="star"
                            style="
								top: {Math.random() * 100}%; 
								left: {Math.random() * 100}%;
								opacity: {Math.random()}
							"
                        ></div>
                    {/each}
                </div>
                <div class="dome lit"></div>
                <div class="telescope-base lit">
                    <div class="brass-highlight"></div>
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

    .sky-bg {
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, #001, #002);
    }
    .sky-bg.lit {
        background: linear-gradient(to bottom, #000033, #001144);
    }

    .star {
        position: absolute;
        width: 2px;
        height: 2px;
        background: #fff;
        box-shadow: 0 0 5px #fff;
    }

    .dome {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 40%;
        background: #111;
        clip-path: ellipse(60% 100% at 50% 100%);
    }
    .dome.lit {
        background: linear-gradient(to right, #222, #333, #222);
        border-top: 2px solid #444;
    }

    .telescope-base {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 200px;
        background: #1a1a1a;
        clip-path: polygon(20% 0, 80% 0, 100% 100%, 0 100%);
    }
    .telescope-base.lit {
        background: linear-gradient(
            90deg,
            #4d3d2d,
            #8c7355,
            #4d3d2d
        ); /* Brass */
    }

    .brass-highlight {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent 40%,
            rgba(255, 255, 255, 0.4) 50%,
            transparent 60%
        );
    }

    .reveal-layer {
        position: absolute;
        inset: 0;
    }
</style>
