<script lang="ts">
    // No interaction needed for this visual pass
</script>

<div class="hud-myst-detailed">
    <div class="letterbox">
        <div class="scene-view">
            <div class="sky-gradient"></div>

            <!-- Background Hills -->
            <div class="hill h1"></div>
            <div class="hill h2"></div>

            <!-- The Tower -->
            <div class="tower-base">
                <div class="window w1"></div>
                <div class="window w2"></div>
                <div class="window w3"></div>
            </div>
            <div class="tower-roof"></div>
            <div class="spire"></div>
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
    /* Dither Overlay */
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

    .hill {
        position: absolute;
        bottom: 0;
        background: #5d4037;
    }
    .h1 {
        left: -20%;
        width: 80%;
        height: 40%;
        border-radius: 100% 100% 0 0;
        opacity: 0.8;
    }
    .h2 {
        right: -20%;
        width: 90%;
        height: 50%;
        border-radius: 100% 100% 0 0;
    }

    .tower-base {
        position: absolute;
        bottom: 10%;
        left: 50%;
        transform: translateX(-50%);
        width: 120px;
        height: 300px;
        background: linear-gradient(90deg, #5d4037, #8b7355, #5d4037);
        clip-path: polygon(20% 0, 80% 0, 100% 100%, 0 100%);
        box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.5);
    }

    .window {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 40px;
        background: #2f1e1e;
        border-top: 10px solid #4a3b2a; /* Arch */
        border-radius: 10px 10px 0 0;
    }
    .w1 {
        top: 20%;
    }
    .w2 {
        top: 50%;
    }
    .w3 {
        top: 80%;
    }

    .tower-roof {
        position: absolute;
        bottom: 310px; /* 300px base + 10% bottom offset approx */
        left: 50%;
        transform: translateX(-50%);
        width: 140px;
        height: 80px;
        background: #2f1e1e;
        clip-path: polygon(50% 0, 100% 100%, 0 100%);
    }

    .spire {
        position: absolute;
        bottom: 390px;
        left: 50%;
        transform: translateX(-50%);
        width: 10px;
        height: 50px;
        background: #8b7355;
    }
</style>
