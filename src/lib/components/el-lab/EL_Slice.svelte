<script lang="ts">
    // Sliced text
</script>

<div class="el-riso">
    <div class="paper-texture"></div>

    <!-- Top Half -->
    <div class="ink-layer pink slice-top">
        <div class="text-block">ERIC</div>
    </div>
    <div class="ink-layer black slice-top-b">
        <div class="text-block">LUTTRELL</div>
    </div>

    <!-- Bottom Half -->
    <div class="ink-layer pink slice-bottom">
        <div class="text-block">ERIC</div>
    </div>
    <div class="ink-layer black slice-bottom-b">
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

    .slice-top {
        clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
        animation: slide-left 4s ease-in-out infinite alternate;
    }
    .slice-top-b {
        clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
        animation: slide-right 4s ease-in-out infinite alternate;
    }

    .slice-bottom {
        clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%);
        animation: slide-right 4s ease-in-out infinite alternate;
    }
    .slice-bottom-b {
        clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%);
        animation: slide-left 4s ease-in-out infinite alternate;
    }

    @keyframes slide-left {
        from {
            transform: translateX(-20px);
        }
        to {
            transform: translateX(20px);
        }
    }

    @keyframes slide-right {
        from {
            transform: translateX(20px);
        }
        to {
            transform: translateX(-20px);
        }
    }
</style>
