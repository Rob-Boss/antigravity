<script lang="ts">
    import BubbleScreen from "./BubbleScreen.svelte";
</script>

<div class="tv-junk">
    <div class="rusted-hulk">
        <div class="screen-cracked">
            <BubbleScreen variant="glass" color="#556600" />
            <div class="crack-overlay"></div>
        </div>
        <div class="exposed-wires">
            <div class="wire w1"></div>
            <div class="wire w2"></div>
        </div>
        <div class="tape-patch"></div>
    </div>
</div>

<style>
    .tv-junk {
        width: 340px;
        height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .rusted-hulk {
        width: 300px;
        height: 260px;
        background: linear-gradient(135deg, #5d4037, #3e2723);
        /* Rust Texture */
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E");
        border-radius: 10px;
        position: relative;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.6);
        padding: 20px;
        transform: rotate(-2deg);
    }

    .screen-cracked {
        width: 100%;
        height: 180px;
        background: #000;
        border-radius: 20px;
        position: relative;
        overflow: hidden;
        border: 4px solid #222;
    }

    .crack-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
                45deg,
                transparent 48%,
                rgba(255, 255, 255, 0.2) 49%,
                transparent 50%
            ),
            linear-gradient(
                -20deg,
                transparent 40%,
                rgba(255, 255, 255, 0.1) 41%,
                transparent 42%
            );
        pointer-events: none;
        z-index: 20;
    }

    .exposed-wires {
        position: absolute;
        bottom: -10px;
        right: 20px;
    }
    .wire {
        width: 4px;
        height: 40px;
        border-radius: 2px;
        position: absolute;
    }
    .w1 {
        background: #f00;
        transform: rotate(20deg);
        height: 30px;
        right: 10px;
    }
    .w2 {
        background: #ff0;
        transform: rotate(-10deg);
        height: 40px;
        right: 0;
    }

    .tape-patch {
        position: absolute;
        top: 10px;
        left: -10px;
        width: 60px;
        height: 20px;
        background: #ccc;
        transform: rotate(-15deg);
        opacity: 0.8;
        box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    }
</style>
