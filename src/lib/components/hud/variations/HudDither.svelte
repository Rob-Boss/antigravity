<script lang="ts">
    let hover = false;
</script>

<div
    class="hud-dither"
    on:mouseenter={() => (hover = true)}
    on:mouseleave={() => (hover = false)}
>
    <div class="bayer-overlay"></div>

    <div class="content">
        <div class="glitch-text" class:shake={hover}>
            SYSTEM<br />FAILURE
        </div>

        <div class="skull-icon">
            <div class="eyes"></div>
            <div class="teeth"></div>
        </div>

        <div class="loading-bar">
            <div class="fill" style="width: {hover ? '90%' : '30%'}"></div>
        </div>
    </div>
</div>

<style>
    .hud-dither {
        width: 100%;
        height: 100%;
        background: #000;
        color: #fff;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .bayer-overlay {
        position: absolute;
        inset: 0;
        /* 2x2 Bayer Matrix Simulation */
        background-image: linear-gradient(45deg, #000 25%, transparent 25%),
            linear-gradient(-45deg, #000 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #000 75%),
            linear-gradient(-45deg, transparent 75%, #000 75%);
        background-size: 4px 4px;
        background-color: #fff;
        opacity: 0.1;
        pointer-events: none;
        z-index: 10;
    }

    .content {
        z-index: 20;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        filter: contrast(200%) grayscale(100%);
    }

    .glitch-text {
        font-family: "Courier New", monospace;
        font-size: 60px;
        font-weight: bold;
        text-align: center;
        line-height: 0.9;
        text-shadow: 4px 4px 0 #555;
    }

    .shake {
        animation: shake 0.2s infinite;
    }

    .skull-icon {
        width: 100px;
        height: 120px;
        background: #fff;
        border-radius: 40px 40px 20px 20px;
        position: relative;
    }

    .eyes {
        position: absolute;
        top: 40px;
        left: 20px;
        width: 20px;
        height: 20px;
        background: #000;
        box-shadow: 40px 0 0 #000;
        border-radius: 50%;
    }

    .teeth {
        position: absolute;
        bottom: 10px;
        left: 25px;
        width: 10px;
        height: 20px;
        background: #000;
        box-shadow:
            15px 0 0 #000,
            30px 0 0 #000,
            45px 0 0 #000;
    }

    .loading-bar {
        width: 300px;
        height: 30px;
        border: 4px solid #fff;
        padding: 4px;
    }

    .fill {
        height: 100%;
        background: repeating-linear-gradient(
            90deg,
            #fff,
            #fff 10px,
            #000 10px,
            #000 20px
        );
        transition: width 0.5s cubic-bezier(0.1, 0.7, 1, 0.1);
    }

    @keyframes shake {
        0% {
            transform: translate(0, 0);
        }
        25% {
            transform: translate(-5px, 5px);
        }
        50% {
            transform: translate(5px, -5px);
        }
        75% {
            transform: translate(-5px, -5px);
        }
        100% {
            transform: translate(0, 0);
        }
    }
</style>
