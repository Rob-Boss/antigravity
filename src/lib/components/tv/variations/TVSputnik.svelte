<script lang="ts">
    import BubbleScreen from "./BubbleScreen.svelte";
</script>

<div class="tv-blueprint">
    <div class="grid-bg"></div>
    <div class="schematic-lines">
        <!-- Measurement Lines -->
        <div class="measure m-top"><span>300mm</span></div>
        <div class="measure m-side"><span>240mm</span></div>

        <div class="wireframe-body">
            <div class="screen-box">
                <BubbleScreen variant="wireframe" color="transparent" />
            </div>
            <div class="control-box">
                <div class="dial-circle"></div>
                <div class="switch-rect"></div>
            </div>
            <div class="label-text">FIG 1.0 - CRT UNIT</div>
        </div>
    </div>
</div>

<style>
    .tv-blueprint {
        width: 340px;
        height: 300px;
        background: #0044cc; /* Blueprint Blue */
        color: #fff;
        font-family: "Courier New", monospace;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 4px solid #fff;
    }

    .grid-bg {
        position: absolute;
        inset: 0;
        background-image: linear-gradient(
                rgba(255, 255, 255, 0.1) 1px,
                transparent 1px
            ),
            linear-gradient(
                90deg,
                rgba(255, 255, 255, 0.1) 1px,
                transparent 1px
            );
        background-size: 20px 20px;
        pointer-events: none;
    }

    .wireframe-body {
        width: 260px;
        height: 200px;
        border: 2px solid #fff;
        position: relative;
        display: flex;
        padding: 10px;
        gap: 10px;
    }

    .screen-box {
        flex: 2;
        border: 1px dashed #fff;
        position: relative;
    }

    .control-box {
        flex: 1;
        border: 1px dashed #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
    }

    .dial-circle {
        width: 40px;
        height: 40px;
        border: 1px solid #fff;
        border-radius: 50%;
        position: relative;
    }
    .dial-circle::after {
        content: "+";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .switch-rect {
        width: 20px;
        height: 40px;
        border: 1px solid #fff;
    }

    .label-text {
        position: absolute;
        bottom: -30px;
        right: 0;
        font-size: 12px;
        opacity: 0.8;
    }

    .measure {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: #fff;
    }
    .measure::before,
    .measure::after {
        content: "";
        position: absolute;
        background: #fff;
    }

    .m-top {
        top: -20px;
        left: 0;
        width: 100%;
        height: 1px;
        background: #fff;
    }
    .m-top::before {
        left: 0;
        height: 5px;
        width: 1px;
        top: -2px;
    }
    .m-top::after {
        right: 0;
        height: 5px;
        width: 1px;
        top: -2px;
    }
    .m-top span {
        background: #0044cc;
        padding: 0 5px;
    }

    .m-side {
        right: -20px;
        top: 0;
        height: 100%;
        width: 1px;
        background: #fff;
        writing-mode: vertical-rl;
    }
    .m-side::before {
        top: 0;
        width: 5px;
        height: 1px;
        left: -2px;
    }
    .m-side::after {
        bottom: 0;
        width: 5px;
        height: 1px;
        left: -2px;
    }
    .m-side span {
        background: #0044cc;
        padding: 5px 0;
    }
</style>
