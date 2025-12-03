<script lang="ts">
    import BubbleScreen from "./BubbleScreen.svelte";
</script>

<div class="tv-glitch">
    <div class="hazard-body">
        <div class="screen-distort">
            <BubbleScreen variant="wireframe" color="#0f0" />
        </div>
        <div class="warning-stripes"></div>
        <div class="glitch-text">ERROR</div>
    </div>
</div>

<style>
    .tv-glitch {
        width: 300px;
        height: 340px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .hazard-body {
        width: 280px;
        height: 240px;
        background: #111;
        border: 2px solid #ff0;
        position: relative;
        clip-path: polygon(0 0, 100% 0, 95% 50%, 100% 100%, 0 100%, 5% 50%);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .screen-distort {
        width: 200px;
        height: 160px;
        background: #000;
        border: 1px solid #0f0;
        box-shadow: 0 0 10px #0f0;
        transform: skewX(-5deg);
    }

    .warning-stripes {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 20px;
        background: repeating-linear-gradient(
            45deg,
            #000,
            #000 10px,
            #ff0 10px,
            #ff0 20px
        );
    }

    .glitch-text {
        position: absolute;
        top: -20px;
        left: 0;
        color: #f00;
        font-family: monospace;
        font-weight: bold;
        text-shadow: 2px 0 #00f;
    }
</style>
