<script lang="ts">
    // Visual only
</script>

<div class="hud-myst-detailed">
    <div class="letterbox">
        <div class="scene-view">
            <div class="sky-gradient"></div>
            <div class="ocean"></div>

            <!-- Ship Deck -->
            <div class="deck"></div>
            <div class="railing">
                {#each Array(10) as _, i}
                    <div class="post" style="left: {i * 10}%"></div>
                {/each}
                <div class="rail-top"></div>
            </div>

            <!-- Mast -->
            <div class="mast"></div>
            <div class="sail"></div>

            <!-- Ropes -->
            <div class="rope r1"></div>
            <div class="rope r2"></div>
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

    .sky-gradient {
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, #4a6d8c, #8c7a6d);
    }

    .ocean {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 40%;
        background: linear-gradient(to bottom, #2f1e1e, #1a1010);
    }

    .deck {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 150px;
        background: #5d4037;
        transform: perspective(500px) rotateX(45deg);
        background-image: repeating-linear-gradient(
            90deg,
            #5d4037,
            #5d4037 20px,
            #4a3b2a 21px,
            #4a3b2a 22px
        );
    }

    .railing {
        position: absolute;
        bottom: 80px;
        left: 0;
        width: 100%;
        height: 60px;
    }
    .post {
        position: absolute;
        bottom: 0;
        width: 10px;
        height: 100%;
        background: #4a3b2a;
    }
    .rail-top {
        position: absolute;
        top: 0;
        width: 100%;
        height: 10px;
        background: #8b7355;
    }

    .mast {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 40px;
        height: 500px;
        background: linear-gradient(90deg, #5d4037, #8b7355, #5d4037);
    }

    .sail {
        position: absolute;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        width: 300px;
        height: 200px;
        background: #d7ccc8;
        border-radius: 10px;
        box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.2);
        clip-path: polygon(10% 0, 90% 0, 100% 90%, 0 90%);
    }

    .rope {
        position: absolute;
        width: 2px;
        height: 400px;
        background: #8b7355;
        opacity: 0.6;
    }
    .r1 {
        top: 50px;
        left: 20%;
        transform: rotate(15deg);
    }
    .r2 {
        top: 50px;
        right: 20%;
        transform: rotate(-15deg);
    }
</style>
