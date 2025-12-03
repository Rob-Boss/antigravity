<script lang="ts">
    // Visual only
</script>

<div class="hud-myst-detailed">
    <div class="letterbox">
        <div class="scene-view">
            <div class="sky-gradient"></div>

            <!-- Water -->
            <div class="water"></div>

            <!-- Bridge Structure -->
            <div class="bridge-arch"></div>
            <div class="bridge-deck"></div>

            <!-- Reflections -->
            <div class="reflection"></div>
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

    .water {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 30%;
        background: linear-gradient(to bottom, #4a6d8c, #2f1e1e);
        opacity: 0.8;
    }

    .bridge-arch {
        position: absolute;
        bottom: 20%;
        left: 10%;
        width: 80%;
        height: 150px;
        background: transparent;
        border: 40px solid #8b7355;
        border-bottom: none;
        border-radius: 200px 200px 0 0;
        box-shadow: inset 10px 10px 20px rgba(0, 0, 0, 0.5);
    }

    .bridge-deck {
        position: absolute;
        bottom: calc(20% + 150px);
        left: 0;
        width: 100%;
        height: 40px;
        background: linear-gradient(to bottom, #8b7355, #5d4037);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
    }

    .reflection {
        position: absolute;
        bottom: 5%;
        left: 10%;
        width: 80%;
        height: 100px;
        background: transparent;
        border: 40px solid rgba(139, 115, 85, 0.3);
        border-top: none;
        border-radius: 0 0 200px 200px;
        filter: blur(5px);
        transform: scaleY(0.5);
    }
</style>
