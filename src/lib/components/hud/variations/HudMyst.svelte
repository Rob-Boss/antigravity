<script lang="ts">
    let active = false;
</script>

<div class="hud-myst" on:click={() => (active = !active)}>
    <div class="letterbox">
        <div class="scene-view">
            <!-- Pre-rendered style gradient -->
            <div class="sky-gradient"></div>
            <div class="terrain"></div>

            <div class="structure" class:open={active}>
                <div class="door"></div>
            </div>
        </div>
    </div>

    <div class="cursor-hand"></div>
</div>

<style>
    .hud-myst {
        width: 100%;
        height: 100%;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
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
        /* Dither filter simulation */
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
        top: 0;
        width: 100%;
        height: 60%;
        background: linear-gradient(to bottom, #4a6d8c, #8c7a6d);
    }

    .terrain {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 40%;
        background: #5d4037;
        clip-path: polygon(0 20%, 30% 0, 60% 30%, 100% 10%, 100% 100%, 0 100%);
    }

    .structure {
        position: absolute;
        top: 30%;
        left: 50%;
        transform: translateX(-50%);
        width: 200px;
        height: 200px;
        background: #8b7355;
        box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: flex-end;
        justify-content: center;
    }

    .door {
        width: 80px;
        height: 120px;
        background: #2f1e1e;
        transition: transform 1s ease-in-out;
        transform-origin: left;
    }

    .open .door {
        transform: perspective(500px) rotateY(-80deg);
    }

    .cursor-hand {
        position: fixed;
        top: 50%;
        left: 50%;
        width: 32px;
        height: 32px;
        background: #fff;
        clip-path: polygon(
            40% 0,
            60% 0,
            60% 40%,
            100% 40%,
            100% 60%,
            60% 60%,
            60% 100%,
            40% 100%,
            40% 60%,
            0 60%,
            0 40%,
            40% 40%
        );
        mix-blend-mode: difference;
        pointer-events: none;
    }
</style>
