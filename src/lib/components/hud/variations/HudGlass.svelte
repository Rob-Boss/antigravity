<script lang="ts">
    let x = 0;
    let y = 0;

    function handleMouseMove(e: MouseEvent) {
        // Parallax effect
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        x = (clientX - innerWidth / 2) / 20;
        y = (clientY - innerHeight / 2) / 20;
    }
</script>

<div class="hud-glass" on:mousemove={handleMouseMove}>
    <div class="bg-blur"></div>

    <div class="glass-panel" style="transform: translate({x}px, {y}px)">
        <div class="glass-header">
            <div class="dot red"></div>
            <div class="dot yellow"></div>
            <div class="dot green"></div>
        </div>

        <div class="glass-content">
            <div class="weather-widget">
                <div class="temp">72°</div>
                <div class="condition">Clear Sky</div>
            </div>

            <div class="music-widget">
                <div class="album-art"></div>
                <div class="track-info">
                    <div class="title">Dreaming</div>
                    <div class="artist">Glass Animals</div>
                </div>
            </div>
        </div>
    </div>

    <div
        class="floating-orb"
        style="transform: translate({-x * 2}px, {-y * 2}px)"
    ></div>
</div>

<style>
    .hud-glass {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
    }

    .floating-orb {
        position: absolute;
        width: 300px;
        height: 300px;
        background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.8),
            rgba(255, 255, 255, 0)
        );
        border-radius: 50%;
        top: 20%;
        left: 20%;
        filter: blur(40px);
        z-index: 0;
    }

    .glass-panel {
        width: 400px;
        height: 250px;
        background: rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-radius: 24px;
        border: 1px solid rgba(255, 255, 255, 0.5);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
        padding: 20px;
        z-index: 10;
        display: flex;
        flex-direction: column;
        gap: 20px;
        transition: transform 0.1s ease-out;
    }

    .glass-header {
        display: flex;
        gap: 8px;
    }

    .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
    }
    .red {
        background: #ff5f56;
    }
    .yellow {
        background: #ffbd2e;
    }
    .green {
        background: #27c93f;
    }

    .glass-content {
        display: flex;
        gap: 20px;
    }

    .weather-widget {
        flex: 1;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 16px;
        padding: 15px;
        color: #fff;
    }

    .temp {
        font-size: 32px;
        font-weight: bold;
    }

    .music-widget {
        flex: 1.5;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 16px;
        padding: 15px;
        display: flex;
        gap: 10px;
        align-items: center;
    }

    .album-art {
        width: 40px;
        height: 40px;
        background: linear-gradient(45deg, #ff9a9e, #fad0c4);
        border-radius: 8px;
    }

    .track-info {
        color: #fff;
        font-size: 14px;
    }
    .title {
        font-weight: bold;
    }
    .artist {
        opacity: 0.8;
        font-size: 12px;
    }
</style>
