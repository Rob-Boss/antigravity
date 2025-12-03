<script lang="ts">
    // Scanline effect
</script>

<div class="el-riso">
    <div class="paper-texture"></div>

    <!-- Layer 1: Neon Pink - Eric -->
    <div class="ink-layer pink">
        <div class="text-block">ERIC</div>
    </div>

    <!-- Layer 2: Black - Luttrell -->
    <div class="ink-layer black">
        <div class="text-block">LUTTRELL</div>
    </div>

    <!-- Scan Bar -->
    <div class="scan-bar"></div>
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
    }

    .scan-bar {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 20px;
        background: rgba(255, 255, 255, 0.8);
        box-shadow: 0 0 50px 20px rgba(255, 255, 255, 0.5);
        mix-blend-mode: overlay;
        animation: scan 4s linear infinite;
        z-index: 50;
    }

    @keyframes scan {
        0% {
            transform: translateY(-100px);
        }
        100% {
            transform: translateY(100vh);
        }
    }
</style>
