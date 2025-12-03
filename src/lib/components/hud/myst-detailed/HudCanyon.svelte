<script lang="ts">
    // Visual only
</script>

<div class="hud-myst-detailed">
    <div class="letterbox">
        <div class="scene-view">
            <div class="sky-gradient"></div>

            <!-- Canyon Walls -->
            <div class="wall w1"></div>
            <div class="wall w2"></div>
            <div class="wall w3"></div>
            <div class="wall w4"></div>

            <!-- Suspension Bridge -->
            <div class="bridge-rope"></div>
            <div class="bridge-planks">
                {#each Array(20) as _, i}
                    <div class="plank" style="left: {i * 5}%"></div>
                {/each}
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

    .sky-gradient {
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, #4a6d8c, #8c7a6d);
    }

    .wall {
        position: absolute;
        bottom: 0;
        width: 60%;
        height: 100%;
        background: #5d4037;
    }
    .w1 {
        left: -10%;
        clip-path: polygon(0 0, 100% 40%, 80% 100%, 0 100%);
        background: linear-gradient(to right, #2f1e1e, #5d4037);
    }
    .w2 {
        right: -10%;
        clip-path: polygon(0 30%, 100% 0, 100% 100%, 20% 100%);
        background: linear-gradient(to left, #2f1e1e, #5d4037);
    }
    .w3 {
        left: -20%;
        height: 60%;
        background: #4a3b2a;
        clip-path: polygon(0 0, 100% 50%, 60% 100%, 0 100%);
    }
    .w4 {
        right: -20%;
        height: 50%;
        background: #4a3b2a;
        clip-path: polygon(0 40%, 100% 0, 100% 100%, 20% 100%);
    }

    .bridge-rope {
        position: absolute;
        top: 40%;
        left: 0;
        width: 100%;
        height: 100px;
        border-bottom: 2px solid #8b7355;
        border-radius: 50%;
        transform: scaleY(0.5);
    }

    .bridge-planks {
        position: absolute;
        top: 45%;
        left: 20%;
        width: 60%;
        height: 20px;
    }
    .plank {
        position: absolute;
        top: 0;
        width: 4%;
        height: 10px;
        background: #2f1e1e;
    }
</style>
