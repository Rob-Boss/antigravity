<script lang="ts">
    // Visual only
</script>

<div class="hud-myst-detailed">
    <div class="letterbox">
        <div class="scene-view">
            <div class="sky-gradient"></div>

            <!-- Stone Circle -->
            <div class="stone s1"></div>
            <div class="stone s2"></div>
            <div class="stone s3"></div>
            <div class="stone s4"></div>

            <!-- Altar -->
            <div class="altar-base">
                <div class="glyph"></div>
            </div>

            <!-- Orb -->
            <div class="orb"></div>
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

    .stone {
        position: absolute;
        bottom: 0;
        width: 60px;
        height: 200px;
        background: linear-gradient(90deg, #5d4037, #8b7355, #5d4037);
        border-radius: 10px 10px 0 0;
    }
    .s1 {
        left: 10%;
        height: 250px;
    }
    .s2 {
        left: 25%;
        height: 180px;
    }
    .s3 {
        right: 25%;
        height: 180px;
    }
    .s4 {
        right: 10%;
        height: 250px;
    }

    .altar-base {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 150px;
        height: 100px;
        background: #5d4037;
        clip-path: polygon(10% 0, 90% 0, 100% 100%, 0 100%);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .glyph {
        width: 40px;
        height: 40px;
        background: #8b7355;
        clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
    }

    .orb {
        position: absolute;
        bottom: 110px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 60px;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 0 30px #fff;
        opacity: 0.8;
    }
</style>
