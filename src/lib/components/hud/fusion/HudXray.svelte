<script lang="ts">
    let x = 50;
    let y = 50;

    function handleMouseMove(e: MouseEvent) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        x = ((e.clientX - rect.left) / rect.width) * 100;
        y = ((e.clientY - rect.top) / rect.height) * 100;
    }
</script>

<div class="hud-xray" on:mousemove={handleMouseMove}>
    <!-- Normal View (Skin/Surface) -->
    <div class="surface-layer">
        <div class="body-shape"></div>
        <div class="label">SUBJECT: 001</div>
    </div>

    <!-- X-Ray View (Bones/Tech) -->
    <div
        class="xray-layer"
        style="
			mask-image: radial-gradient(circle at {x}% {y}%, black 15%, transparent 20%);
			-webkit-mask-image: radial-gradient(circle at {x}% {y}%, black 15%, transparent 20%);
		"
    >
        <div class="skeleton">
            <div class="skull">
                <div class="eye-socket left"></div>
                <div class="eye-socket right"></div>
                <div class="nose"></div>
            </div>
            <div class="spine"></div>
            <div class="ribs">
                {#each Array(6) as _}
                    <div class="rib"></div>
                {/each}
            </div>
        </div>

        <!-- Hidden Implant -->
        <div class="implant">CHIP DETECTED</div>
    </div>

    <!-- Scanner UI -->
    <div class="scanner-ring" style="left: {x}%; top: {y}%"></div>
</div>

<style>
    .hud-xray {
        width: 100%;
        height: 100%;
        background: #000;
        position: relative;
        overflow: hidden;
        cursor: none;
    }

    .surface-layer {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #111;
    }

    .body-shape {
        width: 200px;
        height: 400px;
        background: #333;
        border-radius: 100px 100px 0 0;
        opacity: 0.5;
    }

    .xray-layer {
        position: absolute;
        inset: 0;
        background: #fff; /* X-ray is inverted/bright */
        display: flex;
        align-items: center;
        justify-content: center;
        filter: invert(1) contrast(200%); /* Invert to make bones white on black */
    }

    .skeleton {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }

    .skull {
        width: 100px;
        height: 120px;
        background: #000; /* Will be white due to invert */
        border-radius: 40px 40px 30px 30px;
        position: relative;
    }

    .eye-socket {
        width: 25px;
        height: 25px;
        background: #fff; /* Will be black */
        border-radius: 50%;
        position: absolute;
        top: 40px;
    }
    .left {
        left: 20px;
    }
    .right {
        right: 20px;
    }

    .nose {
        width: 10px;
        height: 20px;
        background: #fff;
        position: absolute;
        top: 70px;
        left: 45px;
        clip-path: polygon(50% 0, 100% 100%, 0 100%);
    }

    .spine {
        width: 20px;
        height: 200px;
        background: #000;
        border-radius: 10px;
    }

    .ribs {
        position: absolute;
        top: 150px;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .rib {
        width: 140px;
        height: 10px;
        background: #000;
        border-radius: 10px;
    }

    .implant {
        position: absolute;
        top: 200px;
        left: 60%;
        background: #f00; /* Will invert to cyan */
        color: #fff;
        padding: 5px;
        font-size: 10px;
        font-weight: bold;
        border: 1px solid #fff;
    }

    .scanner-ring {
        position: absolute;
        width: 200px;
        height: 200px;
        border: 2px dashed #0f0;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        animation: spin 10s linear infinite;
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
