<script lang="ts">
    // Visual only, maybe subtle parallax later if requested, but for now static curvy dunes
</script>

<div class="hud-myst-dunes">
    <div class="scene-view">
        <div class="sky-gradient"></div>

        <!-- Curvy Dunes -->
        <!-- Back dunes (lighter/faded) -->
        <div class="dune d4"></div>
        <div class="dune d3"></div>

        <!-- Front dunes (darker) -->
        <div class="dune d2"></div>
        <div class="dune d1"></div>
    </div>
</div>

<style>
    .hud-myst-dunes {
        width: 100%;
        height: 100%;
        background: #000;
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
        inset: 0;
        background: linear-gradient(to bottom, #4a6d8c, #8c7a6d);
    }

    .dune {
        position: absolute;
        bottom: 0;
        background: #5d4037;
        border-radius: 50% 50% 0 0;
    }

    /* Back dunes - slightly lighter for depth */
    .d3 {
        left: -10%;
        width: 80%;
        height: 60%;
        background: #6d4c41; /* Slightly lighter brown */
        border-radius: 100% 50% 0 0;
    }
    .d4 {
        right: -20%;
        width: 90%;
        height: 55%;
        background: #6d4c41;
        border-radius: 50% 100% 0 0;
    }

    /* Front dunes - dark brown */
    .d1 {
        left: -20%;
        width: 70%;
        height: 40%;
        background: #5d4037;
        border-radius: 100% 40% 0 0;
        box-shadow: 10px -5px 20px rgba(0, 0, 0, 0.2);
    }
    .d2 {
        right: -10%;
        width: 80%;
        height: 50%;
        background: #5d4037;
        border-radius: 40% 100% 0 0;
        box-shadow: -10px -5px 20px rgba(0, 0, 0, 0.2);
    }
</style>
