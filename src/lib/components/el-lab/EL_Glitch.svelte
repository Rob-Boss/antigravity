<script lang="ts">
    // Glitch effect
</script>

<div class="el-riso">
    <div class="paper-texture"></div>

    <!-- Layer 1: Neon Pink - Eric -->
    <div class="ink-layer pink glitch-1">
        <div class="text-block" data-text="ERIC">ERIC</div>
    </div>

    <!-- Layer 2: Black - Luttrell -->
    <div class="ink-layer black glitch-2">
        <div class="text-block" data-text="LUTTRELL">LUTTRELL</div>
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
        position: relative;
    }

    .glitch-1 {
        animation: glitch-anim 2.5s infinite linear alternate-reverse;
    }
    .glitch-2 {
        animation: glitch-anim 3s infinite linear alternate-reverse;
    }

    @keyframes glitch-anim {
        0% {
            clip-path: inset(20% 0 80% 0);
            transform: translate(-2px, 1px);
        }
        20% {
            clip-path: inset(60% 0 10% 0);
            transform: translate(2px, -1px);
        }
        40% {
            clip-path: inset(40% 0 50% 0);
            transform: translate(-2px, 2px);
        }
        60% {
            clip-path: inset(80% 0 5% 0);
            transform: translate(2px, -2px);
        }
        80% {
            clip-path: inset(10% 0 70% 0);
            transform: translate(-1px, 1px);
        }
        100% {
            clip-path: inset(30% 0 20% 0);
            transform: translate(1px, -1px);
        }
    }
</style>
