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
            <!-- Base Scene (Murky) -->
            <div class="swamp-bg"></div>
            <div class="tree t1"></div>
            <div class="tree t2"></div>

            <!-- Revealed Scene (Fireflies) -->
            <div
                class="reveal-layer"
                style="
					mask-image: radial-gradient(circle at {x}% {y}%, black 15%, transparent 30%);
					-webkit-mask-image: radial-gradient(circle at {x}% {y}%, black 15%, transparent 30%);
				"
            >
                <div class="swamp-bg lit"></div>
                <div class="tree t1 lit"></div>
                <div class="tree t2 lit"></div>

                {#each Array(10) as _}
                    <div
                        class="firefly"
                        style="
							top: {Math.random() * 80 + 10}%;
							left: {Math.random() * 80 + 10}%;
							animation-delay: {Math.random()}s;
						"
                    ></div>
                {/each}
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

    .swamp-bg {
        position: absolute;
        inset: 0;
        background: #0a1a0a;
    }
    .swamp-bg.lit {
        background: radial-gradient(circle at 50% 100%, #1b5e20, #0a1a0a);
        /* Watery texture */
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.2'/%3E%3C/svg%3E");
    }

    .tree {
        position: absolute;
        bottom: 0;
        width: 60px;
        height: 300px;
        background: #050a05;
        clip-path: polygon(20% 0, 80% 0, 100% 100%, 0 100%);
    }
    .tree.lit {
        background: linear-gradient(90deg, #1a261a, #2e3d2e, #1a261a);
    }
    .t1 {
        left: 20%;
        height: 350px;
        transform: rotate(5deg);
    }
    .t2 {
        right: 20%;
        height: 250px;
        transform: rotate(-5deg);
    }

    .firefly {
        position: absolute;
        width: 4px;
        height: 4px;
        background: #ccff00;
        border-radius: 50%;
        box-shadow: 0 0 5px #ccff00;
        animation: float 3s infinite ease-in-out;
    }

    .reveal-layer {
        position: absolute;
        inset: 0;
    }

    @keyframes float {
        0%,
        100% {
            transform: translate(0, 0);
            opacity: 0.5;
        }
        50% {
            transform: translate(5px, -5px);
            opacity: 1;
        }
    }
</style>
