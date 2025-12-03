<script lang="ts">
    // Color shift / misregistration
</script>

<div class="el-riso">
    <div class="paper-texture"></div>

    <!-- Layer 1: Neon Pink - Eric -->
    <div class="ink-layer pink shift-1">
        <div class="text-block">ERIC</div>
    </div>

    <!-- Layer 2: Black - Luttrell -->
    <div class="ink-layer black shift-2">
        <div class="text-block">LUTTRELL</div>
    </div>

    <!-- Ghost Layers -->
    <div class="ink-layer pink shift-3" style="opacity: 0.3">
        <div class="text-block">ERIC</div>
    </div>
    <div class="ink-layer black shift-4" style="opacity: 0.3">
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

    .shift-1 {
        animation: shift1 4s ease-in-out infinite alternate;
    }
    .shift-2 {
        animation: shift2 5s ease-in-out infinite alternate;
    }
    .shift-3 {
        animation: shift3 4s ease-in-out infinite alternate;
    }
    .shift-4 {
        animation: shift4 5s ease-in-out infinite alternate;
    }

    @keyframes shift1 {
        from {
            transform: translate(-2px, -2px);
        }
        to {
            transform: translate(2px, 2px);
        }
    }
    @keyframes shift2 {
        from {
            transform: translate(2px, 2px);
        }
        to {
            transform: translate(-2px, -2px);
        }
    }
    @keyframes shift3 {
        from {
            transform: translate(-10px, -5px);
        }
        to {
            transform: translate(5px, 10px);
        }
    }
    @keyframes shift4 {
        from {
            transform: translate(5px, 10px);
        }
        to {
            transform: translate(-10px, -5px);
        }
    }
</style>
