<script lang="ts">
    // Visual only
</script>

<div class="hud-myst-detailed">
    <div class="letterbox">
        <div class="scene-view">
            <div class="wall-bg"></div>

            <!-- Bookshelves -->
            <div class="shelf left">
                {#each Array(6) as _, i}
                    <div class="book-row" style="top: {i * 15 + 5}%"></div>
                {/each}
            </div>
            <div class="shelf right">
                {#each Array(6) as _, i}
                    <div class="book-row" style="top: {i * 15 + 5}%"></div>
                {/each}
            </div>

            <!-- Desk -->
            <div class="desk">
                <div class="lamp-base"></div>
                <div class="lamp-shade"></div>
                <div class="open-book"></div>
            </div>
        </div>
    </div>
</div>

<style>
    .hud-myst-detailed {
        width: 100%;
        height: 100%;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
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
        filter: contrast(120%) brightness(90%);
    }
    .scene-view::after {
        content: "";
        position: absolute;
        inset: 0;
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzjIHFBmAApgMakCDg6OCAC9Sw0R+g065AAAAABJRU5ErkJggg==");
        opacity: 0.1;
        pointer-events: none;
    }

    .wall-bg {
        position: absolute;
        inset: 0;
        background: #2f1e1e;
    }

    .shelf {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 200px;
        background: #4a3b2a;
        border: 10px solid #5d4037;
    }
    .left {
        left: 0;
        transform: perspective(500px) rotateY(10deg);
    }
    .right {
        right: 0;
        transform: perspective(500px) rotateY(-10deg);
    }

    .book-row {
        position: absolute;
        left: 5px;
        right: 5px;
        height: 40px;
        background: repeating-linear-gradient(
            90deg,
            #5d4037,
            #5d4037 10px,
            #8b7355 10px,
            #8b7355 20px,
            #2f1e1e 20px,
            #2f1e1e 25px
        );
        box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
    }

    .desk {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 300px;
        height: 150px;
        background: #5d4037;
        border-top: 10px solid #8b7355;
        box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.5);
    }

    .lamp-base {
        position: absolute;
        bottom: 80px;
        left: 40px;
        width: 20px;
        height: 40px;
        background: #8b7355; /* Brass */
    }
    .lamp-shade {
        position: absolute;
        bottom: 110px;
        left: 20px;
        width: 60px;
        height: 40px;
        background: #4a6d8c; /* Green/Blue glass */
        border-radius: 30px 30px 0 0;
        opacity: 0.8;
        box-shadow: 0 0 20px #4a6d8c;
    }

    .open-book {
        position: absolute;
        bottom: 20px;
        right: 40px;
        width: 100px;
        height: 60px;
        background: #d7ccc8;
        transform: skewX(-20deg);
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
    }
</style>
