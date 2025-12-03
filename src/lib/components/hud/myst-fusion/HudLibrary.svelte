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
            <!-- Base Scene (Dark/Dim) -->
            <div class="room-bg"></div>
            <div class="bookshelf left">
                {#each Array(5) as _, i}
                    <div class="shelf" style="top: {i * 20 + 10}%"></div>
                {/each}
            </div>
            <div class="bookshelf right">
                {#each Array(5) as _, i}
                    <div class="shelf" style="top: {i * 20 + 10}%"></div>
                {/each}
            </div>

            <!-- Revealed Scene (Lit) -->
            <div
                class="reveal-layer"
                style="
					mask-image: radial-gradient(circle at {x}% {y}%, black 15%, transparent 30%);
					-webkit-mask-image: radial-gradient(circle at {x}% {y}%, black 15%, transparent 30%);
				"
            >
                <div class="room-bg lit"></div>
                <div class="bookshelf left">
                    {#each Array(5) as _, i}
                        <div class="book-row" style="top: {i * 20 + 5}%">
                            {#each Array(8) as _}
                                <div
                                    class="book"
                                    style="background: hsl({Math.random() * 40 +
                                        10}, 60%, 40%)"
                                ></div>
                            {/each}
                        </div>
                    {/each}
                </div>
                <div class="bookshelf right">
                    {#each Array(5) as _, i}
                        <div class="book-row" style="top: {i * 20 + 5}%">
                            {#each Array(8) as _}
                                <div
                                    class="book"
                                    style="background: hsl({Math.random() * 40 +
                                        10}, 60%, 40%)"
                                ></div>
                            {/each}
                        </div>
                    {/each}
                </div>

                <!-- Dust Motes Texture -->
                <div class="dust-overlay"></div>
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
    /* Dither Overlay */
    .scene-view::after {
        content: "";
        position: absolute;
        inset: 0;
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzjIHFBmAApgMakCDg6OCAC9Sw0R+g065AAAAABJRU5ErkJggg==");
        opacity: 0.15;
        pointer-events: none;
        z-index: 100;
    }

    .room-bg {
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, #2d1b0e, #1a0f08);
    }
    .room-bg.lit {
        background: linear-gradient(to bottom, #5d4037, #3e2723);
    }

    .bookshelf {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 150px;
        background: #1a0f08;
        border-right: 10px solid #2d1b0e;
        transform: perspective(500px) rotateY(10deg);
    }
    .left {
        left: 0;
        transform-origin: left;
    }
    .right {
        right: 0;
        transform: perspective(500px) rotateY(-10deg);
        transform-origin: right;
        border-left: 10px solid #2d1b0e;
        border-right: none;
    }

    .shelf {
        position: absolute;
        left: 0;
        right: 0;
        height: 10px;
        background: #000;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
    }

    .book-row {
        position: absolute;
        left: 10px;
        right: 10px;
        height: 40px;
        display: flex;
        gap: 2px;
        align-items: flex-end;
    }

    .book {
        flex: 1;
        height: 100%;
        border-radius: 2px 2px 0 0;
        box-shadow: inset 2px 0 5px rgba(0, 0, 0, 0.3);
    }

    .reveal-layer {
        position: absolute;
        inset: 0;
        background: transparent;
    }

    .dust-overlay {
        position: absolute;
        inset: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E");
        mix-blend-mode: overlay;
        opacity: 0.5;
    }
</style>
