<script lang="ts">
    let blobs = [
        { x: 30, y: 40, r: 50, dx: 0.5, dy: 0.3 },
        { x: 70, y: 60, r: 60, dx: -0.4, dy: 0.2 },
        { x: 50, y: 50, r: 40, dx: 0.2, dy: -0.5 },
    ];

    import { onMount } from "svelte";

    onMount(() => {
        let frame: number;
        const loop = () => {
            blobs = blobs.map((b) => {
                let nx = b.x + b.dx;
                let ny = b.y + b.dy;
                if (nx < 10 || nx > 90) b.dx *= -1;
                if (ny < 10 || ny > 90) b.dy *= -1;
                return { ...b, x: nx, y: ny };
            });
            frame = requestAnimationFrame(loop);
        };
        loop();
        return () => cancelAnimationFrame(frame);
    });
</script>

<div class="hud-bio">
    <svg class="goo-filter">
        <defs>
            <filter id="goo">
                <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation="10"
                    result="blur"
                />
                <feColorMatrix
                    in="blur"
                    mode="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                    result="goo"
                />
                <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
        </defs>
    </svg>

    <div class="membrane-container">
        {#each blobs as b}
            <div
                class="blob"
                style="
					top: {b.y}%;
					left: {b.x}%;
					width: {b.r * 2}px;
					height: {b.r * 2}px;
				"
            ></div>
        {/each}

        <div class="central-organ">
            <div class="pulse-core"></div>
        </div>
    </div>

    <div class="veins">
        <svg width="100%" height="100%">
            <path
                d="M0,0 Q100,50 200,0"
                fill="none"
                stroke="#880000"
                stroke-width="2"
                opacity="0.5"
            />
            <path
                d="M0,100 Q50,150 0,200"
                fill="none"
                stroke="#880000"
                stroke-width="2"
                opacity="0.5"
            />
            <path
                d="M300,300 Q250,250 300,200"
                fill="none"
                stroke="#880000"
                stroke-width="2"
                opacity="0.5"
            />
        </svg>
    </div>
</div>

<style>
    .hud-bio {
        width: 100%;
        height: 100%;
        background: #2a0a0a;
        overflow: hidden;
        position: relative;
    }

    .goo-filter {
        position: absolute;
        width: 0;
        height: 0;
    }

    .membrane-container {
        width: 100%;
        height: 100%;
        filter: url(#goo);
        position: relative;
    }

    .blob {
        position: absolute;
        background: #ff4444;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        opacity: 0.8;
    }

    .central-organ {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 150px;
        height: 150px;
        background: #aa0000;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 30px #550000;
    }

    .pulse-core {
        width: 80px;
        height: 80px;
        background: #ff0000;
        border-radius: 50%;
        animation: heartbeat 1.2s infinite ease-in-out;
    }

    .veins {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: -1;
    }

    @keyframes heartbeat {
        0% {
            transform: scale(1);
            opacity: 0.8;
        }
        15% {
            transform: scale(1.1);
            opacity: 1;
        }
        30% {
            transform: scale(1);
            opacity: 0.8;
        }
        45% {
            transform: scale(1.15);
            opacity: 1;
        }
        60% {
            transform: scale(1);
            opacity: 0.8;
        }
        100% {
            transform: scale(1);
            opacity: 0.8;
        }
    }
</style>
