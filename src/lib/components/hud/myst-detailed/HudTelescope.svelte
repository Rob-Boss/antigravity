<script lang="ts">
    // Visual only
</script>

<div class="hud-myst-detailed">
    <div class="letterbox">
        <div class="scene-view">
            <div class="sky-gradient"></div>

            <!-- Dome Interior -->
            <div class="dome-wall"></div>
            <div class="dome-slot"></div>

            <!-- Telescope -->
            <div class="telescope-mount"></div>
            <div class="telescope-tube"></div>
            <div class="eyepiece"></div>

            <!-- Gears -->
            <div class="gear g1"></div>
            <div class="gear g2"></div>
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
        background: linear-gradient(
            to bottom,
            #001,
            #1a237e
        ); /* Night sky for telescope */
    }

    .dome-wall {
        position: absolute;
        inset: 0;
        background: #5d4037;
        clip-path: polygon(
            0 0,
            30% 0,
            30% 100%,
            0 100%,
            0 0,
            100% 0,
            100% 100%,
            70% 100%,
            70% 0
        );
    }

    .dome-slot {
        position: absolute;
        left: 30%;
        width: 40%;
        height: 100%;
        /* Shows sky through here */
    }

    .telescope-mount {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 150px;
        background: #2f1e1e;
        clip-path: polygon(20% 0, 80% 0, 100% 100%, 0 100%);
    }

    .telescope-tube {
        position: absolute;
        bottom: 120px;
        left: 50%;
        transform: translateX(-50%) rotate(-45deg);
        width: 60px;
        height: 300px;
        background: linear-gradient(90deg, #5d4037, #8b7355, #5d4037);
        border: 4px solid #4a3b2a;
    }

    .eyepiece {
        position: absolute;
        bottom: 100px;
        left: 35%;
        width: 30px;
        height: 30px;
        background: #8b7355;
        border-radius: 50%;
    }

    .gear {
        position: absolute;
        width: 60px;
        height: 60px;
        background: #8b7355;
        border-radius: 50%;
        border: 5px dashed #4a3b2a;
    }
    .g1 {
        bottom: 50px;
        left: 40%;
    }
    .g2 {
        bottom: 80px;
        left: 45%;
        width: 40px;
        height: 40px;
    }
</style>
