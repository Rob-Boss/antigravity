<script lang="ts">
    let pitch = 0;
    let roll = 0;

    function handleMouseMove(e: MouseEvent) {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        // Normalize to -1 to 1
        const nx = (clientX / innerWidth - 0.5) * 2;
        const ny = (clientY / innerHeight - 0.5) * 2;

        roll = nx * 45; // +/- 45 degrees
        pitch = ny * 100; // +/- 100 pixels
    }
</script>

<div class="hud-vector" on:mousemove={handleMouseMove}>
    <div class="crt-overlay"></div>

    <div class="flight-display">
        <!-- Horizon Line -->
        <div
            class="horizon-container"
            style="transform: rotate({-roll}deg) translateY({pitch}px)"
        >
            <div class="sky"></div>
            <div class="ground">
                <div class="grid-floor"></div>
            </div>
            <div class="horizon-line"></div>
        </div>

        <!-- Static UI Elements -->
        <div class="ladder left">
            {#each Array(10) as _, i}
                <div class="rung">{(10 - i) * 1000}</div>
            {/each}
            <div class="indicator" style="top: {50 + pitch / 5}%">►</div>
        </div>

        <div class="ladder right">
            {#each Array(10) as _, i}
                <div class="rung">{(10 - i) * 10}</div>
            {/each}
            <div class="indicator" style="top: {50 + pitch / 5}%">◄</div>
        </div>

        <div class="center-reticle">
            <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="2" fill="#0f0" />
                <path
                    d="M20,50 L40,50 M60,50 L80,50 M50,20 L50,40 M50,60 L50,80"
                    stroke="#0f0"
                    stroke-width="1"
                />
            </svg>
        </div>

        <div class="top-compass">
            <div
                class="compass-strip"
                style="transform: translateX({-roll * 5}px)"
            >
                N . . 15 . . 30 . . NE . . 60 . . 75 . . E . . 105 . . 120 . .
                SE . . 150 . . 165 . . S
            </div>
            <div class="marker">▼</div>
        </div>
    </div>
</div>

<style>
    .hud-vector {
        width: 100%;
        height: 100%;
        background: #001100;
        color: #00ff00;
        font-family: "Courier New", monospace;
        overflow: hidden;
        position: relative;
    }

    .crt-overlay {
        position: absolute;
        inset: 0;
        background: radial-gradient(
            circle,
            transparent 50%,
            rgba(0, 20, 0, 0.8)
        );
        pointer-events: none;
        z-index: 10;
        box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.5);
    }
    .crt-overlay::before {
        content: "";
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 1px,
            rgba(0, 255, 0, 0.1) 2px
        );
    }

    .flight-display {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .horizon-container {
        position: absolute;
        width: 200%;
        height: 200%;
        top: -50%;
        left: -50%;
        display: flex;
        flex-direction: column;
        transition: transform 0.1s linear;
    }

    .sky {
        flex: 1;
        border-bottom: 2px solid #00ff00;
    }

    .ground {
        flex: 1;
        position: relative;
        overflow: hidden;
    }

    .grid-floor {
        position: absolute;
        inset: 0;
        background-image: linear-gradient(
                0deg,
                transparent 24%,
                rgba(0, 255, 0, 0.3) 25%,
                rgba(0, 255, 0, 0.3) 26%,
                transparent 27%,
                transparent 74%,
                rgba(0, 255, 0, 0.3) 75%,
                rgba(0, 255, 0, 0.3) 76%,
                transparent 77%,
                transparent
            ),
            linear-gradient(
                90deg,
                transparent 24%,
                rgba(0, 255, 0, 0.3) 25%,
                rgba(0, 255, 0, 0.3) 26%,
                transparent 27%,
                transparent 74%,
                rgba(0, 255, 0, 0.3) 75%,
                rgba(0, 255, 0, 0.3) 76%,
                transparent 77%,
                transparent
            );
        background-size: 100px 100px;
        transform: perspective(500px) rotateX(60deg);
        transform-origin: top center;
    }

    .horizon-line {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: 2px;
        background: #00ff00;
        box-shadow: 0 0 10px #00ff00;
    }

    .ladder {
        position: absolute;
        height: 300px;
        width: 60px;
        border: 1px solid rgba(0, 255, 0, 0.3);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 5px;
        background: rgba(0, 20, 0, 0.5);
        backdrop-filter: blur(2px);
    }
    .left {
        left: 20%;
        text-align: right;
    }
    .right {
        right: 20%;
        text-align: left;
    }

    .rung {
        font-size: 12px;
        opacity: 0.7;
    }

    .indicator {
        position: absolute;
        right: -10px;
        color: #00ff00;
        font-size: 20px;
        transition: top 0.1s linear;
    }
    .right .indicator {
        left: -10px;
        right: auto;
    }

    .center-reticle {
        position: absolute;
        z-index: 5;
    }

    .top-compass {
        position: absolute;
        top: 20px;
        width: 300px;
        height: 40px;
        border: 1px solid #00ff00;
        overflow: hidden;
        background: rgba(0, 20, 0, 0.8);
    }

    .compass-strip {
        display: flex;
        align-items: center;
        white-space: nowrap;
        padding: 10px;
        gap: 20px;
        transition: transform 0.1s linear;
    }

    .marker {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        color: #00ff00;
    }
</style>
