<script lang="ts">
    // Visual only
</script>

<div class="hud-myst-detailed">
    <div class="letterbox">
        <div class="scene-view">
            <div class="sky-gradient"></div>

            <!-- Floating Island -->
            <div class="island">
                <div class="rock-base"></div>
                <div class="grass-top"></div>
            </div>

            <!-- Hut -->
            <div class="hut">
                <div class="hut-wall"></div>
                <div class="hut-roof"></div>
            </div>

            <!-- Tree -->
            <div class="tree"></div>
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

    .island {
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translateX(-50%);
        width: 300px;
        height: 200px;
    }

    .rock-base {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 100%;
        background: #5d4037;
        clip-path: polygon(10% 0, 90% 0, 70% 80%, 50% 100%, 30% 80%);
    }

    .grass-top {
        position: absolute;
        top: 0;
        width: 100%;
        height: 20px;
        background: #4a3b2a; /* Dried grass color */
        border-radius: 50%;
    }

    .hut {
        position: absolute;
        top: 25%;
        left: 55%;
        width: 60px;
        height: 80px;
    }
    .hut-wall {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 50px;
        background: #8b7355;
    }
    .hut-roof {
        position: absolute;
        top: 0;
        width: 80px;
        left: -10px;
        height: 40px;
        background: #2f1e1e;
        clip-path: polygon(50% 0, 100% 100%, 0 100%);
    }

    .tree {
        position: absolute;
        top: 15%;
        left: 40%;
        width: 40px;
        height: 120px;
        background: #2f1e1e;
        clip-path: polygon(
            40% 100%,
            60% 100%,
            60% 30%,
            100% 30%,
            50% 0,
            0 30%,
            40% 30%
        );
    }
</style>
