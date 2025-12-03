<script lang="ts">
    // Animated noise
</script>

<div class="el-riso">
    <div class="paper-texture"></div>
    <div class="noise-overlay"></div>

    <!-- Layer 1: Neon Pink - Eric -->
    <div class="ink-layer pink">
        <div class="text-block">ERIC</div>
    </div>

    <!-- Layer 2: Black - Luttrell -->
    <div class="ink-layer black">
        <div class="text-block">LUTTRELL</div>
    </div>
</div>

<style>
    .el-riso {
        width: 100%;
        height: 100%;
        background: #ffffff;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "Inter", sans-serif;
    }

    .paper-texture {
        position: absolute;
        inset: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E");
        pointer-events: none;
        z-index: 100;
        mix-blend-mode: multiply;
    }

    .noise-overlay {
        position: absolute;
        inset: -50%;
        width: 200%;
        height: 200%;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E");
        pointer-events: none;
        z-index: 101;
        mix-blend-mode: overlay;
        animation: noise 0.5s steps(5) infinite;
    }

    .ink-layer {
        position: absolute;
        inset: 0;
        mix-blend-mode: multiply;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .pink {
        color: #ff00ff;
    }

    .black {
        color: #000000;
    }

    .text-block {
        font-size: 15vw;
        font-weight: 900;
        line-height: 0.8;
        letter-spacing: -0.05em;
        text-transform: uppercase;
        opacity: 0.9;
        filter: blur(0.5px);
    }

    @keyframes noise {
        0% {
            transform: translate(0, 0);
        }
        20% {
            transform: translate(-5%, -5%);
        }
        40% {
            transform: translate(-5%, 5%);
        }
        60% {
            transform: translate(5%, -5%);
        }
        80% {
            transform: translate(5%, 5%);
        }
        100% {
            transform: translate(0, 0);
        }
    }
</style>
