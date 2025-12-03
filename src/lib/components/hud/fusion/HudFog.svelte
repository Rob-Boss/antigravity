<script lang="ts">
    let x = 50;
    let y = 50;

    function handleMouseMove(e: MouseEvent) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        x = ((e.clientX - rect.left) / rect.width) * 100;
        y = ((e.clientY - rect.top) / rect.height) * 100;
    }
</script>

<div class="hud-fog" on:mousemove={handleMouseMove}>
    <!-- The Fog Layer (Top) -->
    <div class="fog-layer"></div>

    <!-- The World (Revealed) -->
    <div
        class="world-reveal"
        style="
			mask-image: radial-gradient(circle at {x}% {y}%, black 10%, transparent 50%);
			-webkit-mask-image: radial-gradient(circle at {x}% {y}%, black 10%, transparent 50%);
		"
    >
        <div class="tree t1"></div>
        <div class="tree t2"></div>
        <div class="tree t3"></div>

        <div class="silhouette"></div>
    </div>
</div>

<style>
    .hud-fog {
        width: 100%;
        height: 100%;
        background: #ccc; /* Fog color */
        position: relative;
        overflow: hidden;
        cursor: none;
    }

    .fog-layer {
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
            45deg,
            #ccc,
            #ccc 10px,
            #bbb 10px,
            #bbb 20px
        );
        opacity: 0.5;
        z-index: 10;
        pointer-events: none;
    }

    .world-reveal {
        position: absolute;
        inset: 0;
        background: #444; /* Darker world underneath */
        /* Dither texture */
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.2'/%3E%3C/svg%3E");
    }

    .tree {
        position: absolute;
        bottom: 0;
        width: 40px;
        height: 200px;
        background: #000;
        clip-path: polygon(
            40% 100%,
            60% 100%,
            60% 30%,
            100% 30%,
            50% 0,
            0 30%,
            40% 30%
        );
    }
    .t1 {
        left: 20%;
        height: 250px;
    }
    .t2 {
        left: 70%;
        height: 180px;
    }
    .t3 {
        left: 45%;
        height: 100px;
        bottom: 50px;
        opacity: 0.5;
    }

    .silhouette {
        position: absolute;
        bottom: 50px;
        left: 50%;
        width: 30px;
        height: 80px;
        background: #000;
        border-radius: 15px 15px 0 0;
        box-shadow: 0 0 20px #000;
    }
</style>
