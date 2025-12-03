<script lang="ts">
    import { onMount } from "svelte";

    let mouseX = 0;
    let mouseY = 0;

    function handleMouseMove(e: MouseEvent) {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        mouseX = (clientX / innerWidth - 0.5) * 2; // -1 to 1
        mouseY = (clientY / innerHeight - 0.5) * 2;
    }
</script>

<div class="hud-holo" on:mousemove={handleMouseMove}>
    <div
        class="scene"
        style="transform: rotateY({mouseX * 20}deg) rotateX({mouseY * -20}deg)"
    >
        <!-- Central Core -->
        <div class="ring core"></div>

        <!-- Rotating Rings -->
        <div class="ring r1"></div>
        <div class="ring r2"></div>
        <div class="ring r3"></div>

        <!-- Data Panels -->
        <div class="panel left">
            <div class="header">SYSTEM STATUS</div>
            <div class="bar-graph">
                <div class="bar" style="height: 80%"></div>
                <div class="bar" style="height: 40%"></div>
                <div class="bar" style="height: 90%"></div>
                <div class="bar" style="height: 60%"></div>
            </div>
        </div>

        <div class="panel right">
            <div class="header">TARGET LOCK</div>
            <div class="target-reticle"></div>
        </div>

        <!-- Floating Particles -->
        {#each Array(20) as _, i}
            <div
                class="particle"
                style="
					top: {Math.random() * 100}%;
					left: {Math.random() * 100}%;
					transform: translateZ({Math.random() * 200}px);
					animation-delay: {Math.random() * 2}s;
				"
            ></div>
        {/each}
    </div>
</div>

<style>
    .hud-holo {
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, #001122, #000);
        perspective: 1000px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "Orbitron", sans-serif; /* Assuming a tech font, fallback sans */
        color: #00ffff;
    }

    .scene {
        position: relative;
        width: 600px;
        height: 400px;
        transform-style: preserve-3d;
        transition: transform 0.1s ease-out;
    }

    .ring {
        position: absolute;
        top: 50%;
        left: 50%;
        border: 2px solid rgba(0, 255, 255, 0.5);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
    }

    .core {
        width: 100px;
        height: 100px;
        border: 4px solid #00ffff;
        box-shadow: 0 0 20px #00ffff;
    }

    .r1 {
        width: 200px;
        height: 200px;
        border-left-color: transparent;
        border-right-color: transparent;
        animation: spin 4s linear infinite;
    }

    .r2 {
        width: 300px;
        height: 300px;
        border-top-color: transparent;
        border-bottom-color: transparent;
        animation: spin 8s linear infinite reverse;
    }

    .r3 {
        width: 350px;
        height: 350px;
        border: 1px dashed rgba(0, 255, 255, 0.2);
        animation: spin 20s linear infinite;
    }

    .panel {
        position: absolute;
        width: 150px;
        height: 200px;
        background: rgba(0, 20, 40, 0.5);
        border: 1px solid rgba(0, 255, 255, 0.3);
        padding: 10px;
        backdrop-filter: blur(2px);
    }

    .left {
        left: -50px;
        top: 50%;
        transform: translateY(-50%) rotateY(30deg);
    }

    .right {
        right: -50px;
        top: 50%;
        transform: translateY(-50%) rotateY(-30deg);
    }

    .header {
        font-size: 12px;
        border-bottom: 1px solid #00ffff;
        margin-bottom: 10px;
        padding-bottom: 5px;
        text-shadow: 0 0 5px #00ffff;
    }

    .bar-graph {
        display: flex;
        gap: 5px;
        height: 100px;
        align-items: flex-end;
    }

    .bar {
        flex: 1;
        background: rgba(0, 255, 255, 0.5);
        box-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
    }

    .target-reticle {
        width: 80px;
        height: 80px;
        border: 1px solid #00ffff;
        border-radius: 50%;
        margin: 20px auto;
        position: relative;
    }
    .target-reticle::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 4px;
        height: 4px;
        background: #f00;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 5px #f00;
    }

    .particle {
        position: absolute;
        width: 2px;
        height: 2px;
        background: #fff;
        border-radius: 50%;
        opacity: 0.5;
    }

    @keyframes spin {
        from {
            transform: translate(-50%, -50%) rotate(0deg);
        }
        to {
            transform: translate(-50%, -50%) rotate(360deg);
        }
    }
</style>
