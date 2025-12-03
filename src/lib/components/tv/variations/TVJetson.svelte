<script lang="ts">
    import BubbleScreen from "./BubbleScreen.svelte";
</script>

<div class="tv-neon">
    <div class="perspective-grid"></div>
    <div class="neon-frame">
        <div class="screen-glow">
            <BubbleScreen variant="flat" color="#ff00ff" />
        </div>
        <div class="neon-controls">
            <div class="btn"></div>
            <div class="btn"></div>
        </div>
    </div>
</div>

<style>
    .tv-neon {
        width: 320px;
        height: 300px;
        background: #050510;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        perspective: 800px;
    }

    .perspective-grid {
        position: absolute;
        bottom: -50%;
        left: -50%;
        width: 200%;
        height: 100%;
        background-image: linear-gradient(
                0deg,
                transparent 24%,
                rgba(255, 0, 255, 0.3) 25%,
                rgba(255, 0, 255, 0.3) 26%,
                transparent 27%,
                transparent 74%,
                rgba(255, 0, 255, 0.3) 75%,
                rgba(255, 0, 255, 0.3) 76%,
                transparent 77%,
                transparent
            ),
            linear-gradient(
                90deg,
                transparent 24%,
                rgba(0, 255, 255, 0.3) 25%,
                rgba(0, 255, 255, 0.3) 26%,
                transparent 27%,
                transparent 74%,
                rgba(0, 255, 255, 0.3) 75%,
                rgba(0, 255, 255, 0.3) 76%,
                transparent 77%,
                transparent
            );
        background-size: 50px 50px;
        transform: rotateX(60deg);
        z-index: 0;
    }

    .neon-frame {
        width: 280px;
        height: 220px;
        border: 4px solid #0ff;
        box-shadow:
            0 0 10px #0ff,
            0 0 20px #0ff,
            inset 0 0 20px rgba(0, 255, 255, 0.5);
        background: rgba(0, 0, 0, 0.8);
        z-index: 10;
        display: flex;
        flex-direction: column;
        padding: 10px;
        gap: 10px;
        transform: rotateX(10deg);
    }

    .screen-glow {
        flex: 1;
        border: 2px solid #f0f;
        box-shadow: 0 0 10px #f0f;
        background: rgba(255, 0, 255, 0.1);
    }

    .neon-controls {
        height: 40px;
        display: flex;
        justify-content: center;
        gap: 20px;
    }

    .btn {
        width: 40px;
        height: 10px;
        background: #ff0;
        box-shadow: 0 0 10px #ff0;
    }
</style>
