<script lang="ts">
    let glitchActive = false;

    function triggerGlitch() {
        glitchActive = true;
        setTimeout(() => (glitchActive = false), 300);
    }
</script>

<div class="hud-glitch" on:click={triggerGlitch}>
    <div class="noise-overlay"></div>

    <div class="cyber-container" class:glitching={glitchActive}>
        <div class="header-bar">
            <div class="title">
                NEURAL_LINK // <span class="kanji">神経接続</span>
            </div>
            <div class="status">CONNECTED</div>
        </div>

        <div class="main-content">
            <div class="hex-grid">
                {#each Array(6) as _}
                    <div class="hex"></div>
                {/each}
            </div>

            <div class="data-stream">
                {#each Array(5) as _}
                    <div class="line">
                        0x4F92A... <span class="highlight">ERR</span>
                    </div>
                {/each}
            </div>
        </div>

        <div class="warning-box">WARNING: SYSTEM UNSTABLE</div>
    </div>
</div>

<style>
    .hud-glitch {
        width: 100%;
        height: 100%;
        background: #0a000a;
        color: #ff00ff;
        font-family: "Courier New", monospace;
        overflow: hidden;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .noise-overlay {
        position: absolute;
        inset: 0;
        opacity: 0.1;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        pointer-events: none;
        z-index: 0;
    }

    .cyber-container {
        width: 600px;
        height: 400px;
        border: 2px solid #ff00ff;
        padding: 20px;
        position: relative;
        background: rgba(20, 0, 20, 0.8);
        box-shadow: 0 0 20px rgba(255, 0, 255, 0.2);
    }

    .glitching {
        animation: glitch-anim 0.3s infinite;
    }

    .header-bar {
        display: flex;
        justify-content: space-between;
        border-bottom: 2px solid #00ffff;
        padding-bottom: 10px;
        margin-bottom: 20px;
        text-shadow: 2px 2px 0px #00ffff;
    }

    .kanji {
        color: #00ffff;
    }

    .status {
        background: #ff00ff;
        color: #000;
        padding: 0 5px;
        font-weight: bold;
    }

    .main-content {
        display: flex;
        gap: 20px;
    }

    .hex-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        width: 150px;
    }

    .hex {
        width: 40px;
        height: 40px;
        background: rgba(255, 0, 255, 0.1);
        border: 1px solid #ff00ff;
        clip-path: polygon(
            50% 0%,
            100% 25%,
            100% 75%,
            50% 100%,
            0% 75%,
            0% 25%
        );
        transition: background 0.2s;
    }
    .hex:hover {
        background: #ff00ff;
    }

    .data-stream {
        flex: 1;
        font-size: 14px;
        line-height: 1.5;
        color: #00ffff;
    }

    .highlight {
        color: #ff0000;
        background: #000;
    }

    .warning-box {
        position: absolute;
        bottom: 20px;
        right: 20px;
        border: 2px solid #ff0000;
        color: #ff0000;
        padding: 10px;
        font-weight: bold;
        animation: blink 0.5s infinite;
    }

    @keyframes blink {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
    }

    @keyframes glitch-anim {
        0% {
            clip-path: inset(10% 0 80% 0);
            transform: translate(-2px, 2px);
        }
        20% {
            clip-path: inset(80% 0 10% 0);
            transform: translate(2px, -2px);
        }
        40% {
            clip-path: inset(40% 0 40% 0);
            transform: translate(-2px, 2px);
        }
        60% {
            clip-path: inset(10% 0 60% 0);
            transform: translate(2px, -2px);
        }
        80% {
            clip-path: inset(30% 0 20% 0);
            transform: translate(-2px, 2px);
        }
        100% {
            clip-path: inset(50% 0 30% 0);
            transform: translate(2px, -2px);
        }
    }
</style>
