<script lang="ts">
    export let active = true;
    export let color = "#222";
    export let variant: "glass" | "flat" | "wireframe" | "matte" = "glass";
</script>

<div class="bubble-screen-container {variant}">
    <div class="bezel-depth">
        <div class="glass-surface">
            <div
                class="phosphor-layer"
                style="background-color: {active
                    ? variant === 'wireframe'
                        ? 'transparent'
                        : color
                    : '#111'}"
            >
                {#if active}
                    {#if variant !== "flat" && variant !== "wireframe"}
                        <div class="scanlines"></div>
                        <div class="static-noise"></div>
                        <div class="content-glow"></div>
                    {/if}
                    {#if variant === "wireframe"}
                        <div class="grid-lines"></div>
                    {/if}
                {/if}
            </div>
            {#if variant === "glass"}
                <div class="reflections">
                    <div class="glare-top"></div>
                    <div class="glare-bottom"></div>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .bubble-screen-container {
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 10;
    }

    .bezel-depth {
        width: 100%;
        height: 100%;
        border-radius: 50% / 40%; /* The signature bubble shape */
        overflow: hidden;
        position: relative;
    }

    /* --- Variant: Glass (Original) --- */
    .bubble-screen-container.glass .bezel-depth {
        background: #000;
        box-shadow:
            inset 0 0 20px rgba(0, 0, 0, 0.9),
            inset 5px 5px 15px rgba(0, 0, 0, 0.5),
            inset -5px -5px 15px rgba(255, 255, 255, 0.1);
    }
    .bubble-screen-container.glass .glass-surface {
        box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.8); /* Deep glass depth */
    }

    /* --- Variant: Flat --- */
    .bubble-screen-container.flat .bezel-depth {
        border-radius: 10px;
        background: #000;
        border: 4px solid #000;
        box-shadow: none;
    }
    .bubble-screen-container.flat .glass-surface {
        border-radius: 6px;
        box-shadow: none;
    }

    /* --- Variant: Wireframe --- */
    .bubble-screen-container.wireframe .bezel-depth {
        border-radius: 0;
        background: transparent;
        border: 2px solid currentColor;
        box-shadow: none;
    }
    .bubble-screen-container.wireframe .glass-surface {
        border-radius: 0;
        box-shadow: none;
    }
    .grid-lines {
        width: 100%;
        height: 100%;
        background-image: linear-gradient(
                rgba(255, 255, 255, 0.2) 1px,
                transparent 1px
            ),
            linear-gradient(
                90deg,
                rgba(255, 255, 255, 0.2) 1px,
                transparent 1px
            );
        background-size: 20px 20px;
    }

    /* --- Variant: Matte --- */
    .bubble-screen-container.matte .bezel-depth {
        background: #222;
        box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.3);
    }
    .bubble-screen-container.matte .glass-surface {
        box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.2);
    }

    .glass-surface {
        width: 100%;
        height: 100%;
        border-radius: 50% / 40%;
        position: relative;
        overflow: hidden;
    }

    .phosphor-layer {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        transition: background-color 0.3s ease;
    }

    .scanlines {
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 2px,
            rgba(0, 0, 0, 0.3) 3px,
            rgba(0, 0, 0, 0.3) 4px
        );
        pointer-events: none;
        z-index: 2;
        opacity: 0.6;
    }

    .static-noise {
        position: absolute;
        inset: 0;
        opacity: 0.05;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        z-index: 1;
    }

    .content-glow {
        position: absolute;
        inset: 0;
        background: radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 80%
        );
        z-index: 3;
        mix-blend-mode: overlay;
    }

    .reflections {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 20;
    }

    .glare-top {
        position: absolute;
        top: 5%;
        right: 15%;
        width: 40%;
        height: 30%;
        background: radial-gradient(
            ellipse at center,
            rgba(255, 255, 255, 0.7) 0%,
            rgba(255, 255, 255, 0) 60%
        );
        transform: rotate(-25deg) scaleY(0.6);
        opacity: 0.4;
        filter: blur(5px);
    }

    .glare-bottom {
        position: absolute;
        bottom: 10%;
        left: 20%;
        width: 30%;
        height: 15%;
        background: radial-gradient(
            ellipse at center,
            rgba(255, 255, 255, 0.3) 0%,
            rgba(255, 255, 255, 0) 70%
        );
        transform: rotate(15deg);
        opacity: 0.2;
        filter: blur(8px);
    }
</style>
