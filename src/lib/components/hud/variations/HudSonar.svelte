<script lang="ts">
    let pingActive = false;

    function ping() {
        pingActive = true;
        setTimeout(() => (pingActive = false), 2000);
    }
</script>

<div class="hud-sonar" on:click={ping}>
    <div class="radar-sweep"></div>

    <div class="depth-grid">
        {#each Array(5) as _, i}
            <div
                class="circle"
                style="width: {(i + 1) * 20}%; height: {(i + 1) * 20}%"
            ></div>
        {/each}
        <div class="crosshair h"></div>
        <div class="crosshair v"></div>
    </div>

    {#if pingActive}
        <div class="echo-blip" style="top: 30%; left: 70%"></div>
        <div
            class="echo-blip"
            style="top: 60%; left: 40%; animation-delay: 0.5s"
        ></div>
    {/if}

    <div class="depth-readout">
        DEPTH: 4,200m<br />
        PRESSURE: CRITICAL
    </div>
</div>

<style>
    .hud-sonar {
        width: 100%;
        height: 100%;
        background: #000510;
        color: #0044ff;
        font-family: monospace;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .depth-grid {
        position: absolute;
        width: 80vmin;
        height: 80vmin;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .circle {
        position: absolute;
        border: 1px solid #002266;
        border-radius: 50%;
    }

    .crosshair {
        position: absolute;
        background: #002266;
    }
    .h {
        width: 100%;
        height: 1px;
    }
    .v {
        width: 1px;
        height: 100%;
    }

    .radar-sweep {
        position: absolute;
        width: 80vmin;
        height: 80vmin;
        border-radius: 50%;
        background: conic-gradient(
            from 0deg,
            transparent 0deg,
            transparent 300deg,
            rgba(0, 100, 255, 0.2) 360deg
        );
        animation: sweep 4s linear infinite;
        z-index: 10;
    }

    .echo-blip {
        position: absolute;
        width: 10px;
        height: 10px;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 0 10px #00ffff;
        animation: fade 2s ease-out forwards;
    }

    .depth-readout {
        position: absolute;
        bottom: 20px;
        left: 20px;
        font-size: 16px;
        line-height: 1.5;
        color: #0088ff;
        text-shadow: 0 0 5px #0044ff;
    }

    @keyframes sweep {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @keyframes fade {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(3);
        }
    }
</style>
