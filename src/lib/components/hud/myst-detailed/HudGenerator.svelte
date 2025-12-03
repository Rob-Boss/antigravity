<script lang="ts">
    // Visual only
</script>

<div class="hud-myst-detailed">
    <div class="letterbox">
        <div class="scene-view">
            <!-- Interior Walls -->
            <div class="wall-bg"></div>

            <!-- The Generator -->
            <div class="flywheel-housing">
                <div class="flywheel">
                    <div class="spoke s1"></div>
                    <div class="spoke s2"></div>
                </div>
            </div>

            <div class="pipe p1"></div>
            <div class="pipe p2"></div>

            <div class="vent"></div>
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
        background: linear-gradient(to right, #2f1e1e, #5d4037, #2f1e1e);
    }

    .flywheel-housing {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 300px;
        height: 200px;
        background: #5d4037;
        border-radius: 150px 150px 0 0;
        box-shadow: 0 0 50px rgba(0, 0, 0, 0.8);
        overflow: hidden;
        border: 10px solid #8b7355;
        border-bottom: none;
    }

    .flywheel {
        position: absolute;
        top: 20px;
        left: 20px;
        right: 20px;
        bottom: -150px;
        background: #2f1e1e;
        border-radius: 50%;
        border: 20px solid #8b7355; /* Brass */
        animation: spin 10s linear infinite;
    }

    .spoke {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: 20px;
        background: #8b7355;
        transform-origin: center;
    }
    .s1 {
        transform: translateY(-50%);
    }
    .s2 {
        transform: translateY(-50%) rotate(90deg);
    }

    .pipe {
        position: absolute;
        width: 40px;
        background: linear-gradient(90deg, #5d4037, #8b7355, #5d4037);
        box-shadow: 5px 0 10px rgba(0, 0, 0, 0.5);
    }
    .p1 {
        top: 0;
        bottom: 0;
        left: 50px;
    }
    .p2 {
        top: 0;
        bottom: 0;
        right: 50px;
    }

    .vent {
        position: absolute;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 60px;
        background: #2f1e1e;
        background-image: repeating-linear-gradient(
            0deg,
            #2f1e1e,
            #2f1e1e 5px,
            #000 5px,
            #000 10px
        );
        border: 4px solid #8b7355;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>
