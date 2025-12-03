<script lang="ts">
    let x = 50;
    let y = 50;

    function handleMouseMove(e: MouseEvent) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        x = ((e.clientX - rect.left) / rect.width) * 100;
        y = ((e.clientY - rect.top) / rect.height) * 100;
    }
</script>

<div class="hud-darkroom" on:mousemove={handleMouseMove}>
    <div class="bayer-overlay"></div>

    <!-- The Dark Room (Base) -->
    <div class="room-base">
        <div class="tray"></div>
        <div class="tray"></div>
        <div class="string"></div>
    </div>

    <!-- The Red Light Reveal -->
    <div
        class="light-cone"
        style="
			mask-image: radial-gradient(circle at {x}% {y}%, black 10%, transparent 40%);
			-webkit-mask-image: radial-gradient(circle at {x}% {y}%, black 10%, transparent 40%);
		"
    >
        <div class="photo p1">
            <div class="face"></div>
        </div>
        <div class="photo p2">
            <div class="landscape"></div>
        </div>
        <div class="photo p3 hanging">
            <div class="abstract"></div>
        </div>
    </div>

    <div class="cursor-light" style="left: {x}%; top: {y}%"></div>
</div>

<style>
    .hud-darkroom {
        width: 100%;
        height: 100%;
        background: #100;
        position: relative;
        overflow: hidden;
        cursor: none;
    }

    .bayer-overlay {
        position: absolute;
        inset: 0;
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzjIHFBmAApgMakCDg6OCAC9Sw0R+g065AAAAABJRU5ErkJggg==");
        opacity: 0.3;
        pointer-events: none;
        z-index: 100;
    }

    .room-base {
        position: absolute;
        inset: 0;
        background: #200;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
    }

    .tray {
        width: 150px;
        height: 200px;
        border: 4px solid #400;
        background: #1a0000;
        transform: perspective(500px) rotateX(20deg);
    }

    .string {
        position: absolute;
        top: 20%;
        left: 0;
        width: 100%;
        height: 2px;
        background: #400;
    }

    .light-cone {
        position: absolute;
        inset: 0;
        background: #f00; /* The red light illuminates things fully */
        mix-blend-mode: screen;
        pointer-events: none;
    }

    .photo {
        position: absolute;
        background: #fff;
        border: 4px solid #fff;
        box-shadow: 0 0 10px #f00;
        overflow: hidden;
    }

    .p1 {
        top: 50%;
        left: 35%;
        width: 120px;
        height: 160px;
        transform: translate(-50%, -50%) rotate(-5deg);
    }

    .p2 {
        top: 50%;
        left: 65%;
        width: 120px;
        height: 160px;
        transform: translate(-50%, -50%) rotate(5deg);
    }

    .p3 {
        top: 20%;
        left: 50%;
        width: 100px;
        height: 120px;
        transform: translate(-50%, 0) rotate(2deg);
        transform-origin: top center;
        animation: sway 3s ease-in-out infinite;
    }

    .face {
        width: 100%;
        height: 100%;
        background: radial-gradient(
                circle at 50% 40%,
                #000 20%,
                transparent 21%
            ),
            radial-gradient(circle at 30% 30%, #000 5%, transparent 6%),
            radial-gradient(circle at 70% 30%, #000 5%, transparent 6%);
        background-color: #ccc;
    }

    .landscape {
        width: 100%;
        height: 100%;
        background: linear-gradient(#ccc 50%, #000 50%);
    }

    .cursor-light {
        position: absolute;
        width: 200px;
        height: 200px;
        background: radial-gradient(
            circle,
            rgba(255, 0, 0, 0.5) 0%,
            transparent 70%
        );
        transform: translate(-50%, -50%);
        pointer-events: none;
        mix-blend-mode: screen;
    }

    @keyframes sway {
        0%,
        100% {
            transform: translate(-50%, 0) rotate(2deg);
        }
        50% {
            transform: translate(-50%, 0) rotate(-2deg);
        }
    }
</style>
