<script lang="ts">
    let torchX = 50;
    let torchY = 50;

    function handleMouseMove(e: MouseEvent) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        torchX = ((e.clientX - rect.left) / rect.width) * 100;
        torchY = ((e.clientY - rect.top) / rect.height) * 100;
    }
</script>

<div class="hud-cave" on:mousemove={handleMouseMove}>
    <div class="dither-layer"></div>

    <div
        class="torch-mask"
        style="background: radial-gradient(circle at {torchX}% {torchY}%, transparent 10%, rgba(0,0,0,0.8) 40%, #000 70%)"
    ></div>

    <div class="cave-scene">
        <!-- Dithered Rock Formations -->
        <div class="rock r1"></div>
        <div class="rock r2"></div>
        <div class="rock r3"></div>

        <!-- Mysterious Object -->
        <div class="artifact">?</div>
    </div>

    <div class="ui-compass">
        <div class="arrow">N</div>
    </div>
</div>

<style>
    .hud-cave {
        width: 100%;
        height: 100%;
        background: #fff;
        position: relative;
        overflow: hidden;
        cursor: crosshair;
    }

    /* Global Dither Pattern */
    .dither-layer {
        position: absolute;
        inset: 0;
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzjIHFBmAApgMakCDg6OCAC9Sw0R+g065AAAAABJRU5ErkJggg==");
        opacity: 0.2;
        pointer-events: none;
        z-index: 10;
    }

    .torch-mask {
        position: absolute;
        inset: 0;
        z-index: 20;
        pointer-events: none;
    }

    .cave-scene {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .rock {
        position: absolute;
        background: #000;
        clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
    }
    .r1 {
        bottom: 0;
        left: -50px;
        width: 300px;
        height: 400px;
        background: repeating-linear-gradient(
            45deg,
            #000,
            #000 2px,
            #fff 2px,
            #fff 4px
        );
    }
    .r2 {
        bottom: 0;
        right: -20px;
        width: 250px;
        height: 300px;
        background: repeating-linear-gradient(
            -45deg,
            #000,
            #000 3px,
            #fff 3px,
            #fff 5px
        );
    }
    .r3 {
        top: -50px;
        left: 100px;
        width: 400px;
        height: 200px;
        transform: rotate(180deg);
        background: radial-gradient(
            circle,
            #000 20%,
            #fff 21%,
            #fff 40%,
            #000 41%
        );
        background-size: 10px 10px;
    }

    .artifact {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 48px;
        font-family: serif;
        font-weight: bold;
        animation: float 2s ease-in-out infinite;
    }

    .ui-compass {
        position: absolute;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border: 2px solid #000;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        z-index: 30;
    }

    @keyframes float {
        0%,
        100% {
            transform: translate(-50%, -50%);
        }
        50% {
            transform: translate(-50%, -60%);
        }
    }
</style>
