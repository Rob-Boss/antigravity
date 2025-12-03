<script lang="ts">
    let charge = 0;
    let active = false;

    function chargeRune() {
        active = true;
        charge += 10;
        if (charge > 100) charge = 100;
        setTimeout(() => (active = false), 500);
    }
</script>

<div class="hud-rune" on:click={chargeRune}>
    <div class="parchment-bg"></div>

    <div class="magic-circle-container">
        <!-- Outer Ring -->
        <div class="ring outer" style="transform: rotate({charge * 2}deg)">
            <svg viewBox="0 0 200 200">
                <path
                    id="curve"
                    d="M 20, 100 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
                    fill="none"
                />
                <text width="200">
                    <textPath href="#curve" class="rune-text">
                        ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛊ ᛏ ᛒ ᛖ ᛗ ᛚ ᛜ ᛞ ᛟ
                    </textPath>
                </text>
            </svg>
        </div>

        <!-- Inner Ring -->
        <div class="ring inner" style="transform: rotate({-charge * 5}deg)">
            <div class="triangle"></div>
            <div class="triangle inverted"></div>
        </div>

        <!-- Core -->
        <div class="core-gem" class:active></div>
    </div>

    <div class="mana-bar">
        <div class="mana-fill" style="width: {charge}%"></div>
    </div>
</div>

<style>
    .hud-rune {
        width: 100%;
        height: 100%;
        background: #1a1005;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        font-family: serif;
    }

    .parchment-bg {
        position: absolute;
        inset: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E");
        opacity: 0.5;
        mix-blend-mode: overlay;
    }

    .magic-circle-container {
        width: 400px;
        height: 400px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .ring {
        position: absolute;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .outer {
        width: 380px;
        height: 380px;
        border: 2px solid #ffd700;
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.2);
    }

    .rune-text {
        fill: #ffd700;
        font-size: 24px;
        letter-spacing: 10px;
        text-shadow: 0 0 5px #ffd700;
    }

    .inner {
        width: 250px;
        height: 250px;
        border: 1px solid rgba(255, 215, 0, 0.5);
    }

    .triangle {
        position: absolute;
        width: 0;
        height: 0;
        border-left: 100px solid transparent;
        border-right: 100px solid transparent;
        border-bottom: 173px solid rgba(255, 215, 0, 0.1);
        transform: translateY(-10px);
    }
    .inverted {
        transform: rotate(180deg) translateY(-10px);
    }

    .core-gem {
        width: 50px;
        height: 50px;
        background: #ff4400;
        border-radius: 50%;
        box-shadow: 0 0 20px #ff4400;
        z-index: 10;
        transition: all 0.3s;
    }
    .core-gem.active {
        background: #fff;
        box-shadow: 0 0 50px #ffaa00;
        transform: scale(1.2);
    }

    .mana-bar {
        position: absolute;
        bottom: 50px;
        width: 300px;
        height: 10px;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid #ffd700;
        border-radius: 5px;
        overflow: hidden;
    }

    .mana-fill {
        height: 100%;
        background: linear-gradient(90deg, #ff4400, #ffd700);
        transition: width 0.3s;
    }
</style>
