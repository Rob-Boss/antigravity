<script lang="ts">
    // Visual only
</script>

<div class="hud-myst-detailed">
    <div class="letterbox">
        <div class="scene-view">
            <div class="sky-gradient"></div>

            <!-- Trees -->
            <div class="tree t1"></div>
            <div class="tree t2"></div>

            <!-- Gazebo -->
            <div class="gazebo-base"></div>
            <div class="pillar p1"></div>
            <div class="pillar p2"></div>
            <div class="pillar p3"></div>
            <div class="gazebo-roof"></div>

            <!-- Fountain -->
            <div class="fountain"></div>
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

    .tree {
        position: absolute;
        bottom: 50px;
        width: 100px;
        height: 200px;
        background: #2f1e1e;
        border-radius: 50% 50% 0 0;
        opacity: 0.9;
    }
    .t1 {
        left: 10%;
    }
    .t2 {
        right: 10%;
        height: 250px;
    }

    .gazebo-base {
        position: absolute;
        bottom: 50px;
        left: 50%;
        transform: translateX(-50%);
        width: 200px;
        height: 20px;
        background: #5d4037;
        border-radius: 50%;
    }

    .pillar {
        position: absolute;
        bottom: 70px;
        width: 10px;
        height: 150px;
        background: #8b7355; /* Stone/Marble */
    }
    .p1 {
        left: 35%;
    }
    .p2 {
        right: 35%;
    }
    .p3 {
        left: 50%;
        transform: translateX(-50%);
        width: 12px;
        z-index: -1;
        filter: brightness(0.8);
    }

    .gazebo-roof {
        position: absolute;
        bottom: 220px;
        left: 50%;
        transform: translateX(-50%);
        width: 220px;
        height: 80px;
        background: #4a3b2a;
        clip-path: polygon(50% 0, 100% 100%, 0 100%);
    }

    .fountain {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 40px;
        background: #8b7355;
        border-radius: 5px;
    }
</style>
