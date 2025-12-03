<script lang="ts">
    import BubbleScreen from "./BubbleScreen.svelte";
</script>

<div class="tv-steampunk">
    <div class="brass-casing">
        <div class="wood-inlay">
            <div class="screen-porthole">
                <BubbleScreen variant="glass" color="#ffaa00" />
            </div>
        </div>
        <div class="gear g1"></div>
        <div class="gear g2"></div>
        <div class="pipe"></div>
    </div>
</div>

<style>
    .tv-steampunk {
        width: 320px;
        height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .brass-casing {
        width: 280px;
        height: 260px;
        background: linear-gradient(to bottom, #d4af37, #b8860b);
        border-radius: 20px;
        padding: 10px;
        box-shadow:
            inset 2px 2px 5px rgba(255, 255, 255, 0.5),
            inset -2px -2px 5px rgba(0, 0, 0, 0.5),
            0 10px 20px rgba(0, 0, 0, 0.4);
        position: relative;
        border: 2px solid #8b4513;
    }

    .wood-inlay {
        width: 100%;
        height: 100%;
        background: #5d4037;
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
    }

    .screen-porthole {
        width: 180px;
        height: 180px;
        border-radius: 50%;
        border: 8px solid #d4af37;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        overflow: hidden;
        background: #000;
    }

    .gear {
        position: absolute;
        border-radius: 50%;
        border: 4px dashed #cd7f32; /* Bronze */
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    }
    .g1 {
        width: 60px;
        height: 60px;
        top: -20px;
        left: -20px;
        transform: rotate(15deg);
        background: #8b4513;
    }
    .g2 {
        width: 40px;
        height: 40px;
        top: 10px;
        left: 30px;
        transform: rotate(-10deg);
        background: #a0522d;
    }

    .pipe {
        position: absolute;
        bottom: -10px;
        right: 20px;
        width: 20px;
        height: 60px;
        background: linear-gradient(to right, #b8860b, #fff, #b8860b);
        border-radius: 5px;
        transform: rotate(90deg);
    }
</style>
