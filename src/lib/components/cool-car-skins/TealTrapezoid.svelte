<script lang="ts">
    import { createViewerStore } from "$lib/stores/viewerStore";

    const { currentIndex, images, nextImage, prevImage, selectRandomImage } =
        createViewerStore();

    let direction = 1;
    let currentBgColor = "#004d40";

    const handleNext = () => {
        direction = 1;
        nextImage();
    };

    const handlePrev = () => {
        direction = -1;
        prevImage();
    };

    const handleRandom = () => {
        direction = 0;
        selectRandomImage();
    };

    const handleDominantColor = (e: CustomEvent<string>) => {
        currentBgColor = e.detail;
    };
</script>

<div class="teal-trapezoid">
    <div class="screen-unit">
        <div
            class="screen-glass"
            style="background-color: {currentBgColor}; transition: background-color 1s ease;"
        >
            <div class="transition-wrapper">
                {#key images[$currentIndex]}
                    <div class="hologram-container" data-direction={direction}>
                        <img
                            src={images[$currentIndex]}
                            alt="Teal Trap Car"
                            class="simple-car-image"
                        />
                        <div class="scan-line"></div>
                    </div>
                {/key}
            </div>
            <div class="scan-overlay"></div>
        </div>
    </div>

    <div class="control-deck">
        <!-- Shared SVG Defs -->
        <svg width="0" height="0" style="position: absolute;">
            <defs>
                <linearGradient
                    id="arrowGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                >
                    <stop offset="0%" stop-color="#009688" />
                    <stop offset="100%" stop-color="#00695c" />
                </linearGradient>
                <filter
                    id="arrowShadow"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                >
                    <feDropShadow
                        dx="0"
                        dy="2"
                        stdDeviation="2"
                        flood-color="rgba(0,0,0,0.3)"
                    />
                </filter>
            </defs>
        </svg>

        <div class="slider-track">
            <button
                class="slider-knob prev"
                on:click={handlePrev}
                aria-label="Previous Image"
            >
                <svg viewBox="0 0 24 28" class="arrow-icon">
                    <!-- Extrusion (Bottom Layer) -->
                    <path
                        d="M 10 5 L 3.5 11.5 Q 2 12 3.5 12.5 L 10 19 L 10 16 L 21 16 Q 22 16 22 15 L 22 9 Q 22 8 21 8 L 10 8 Z"
                        fill="#004d40"
                        stroke="#004d40"
                        stroke-width="2"
                        stroke-linejoin="round"
                        transform="translate(0, 2)"
                        filter="url(#arrowShadow)"
                    />
                    <!-- Face (Top Layer) -->
                    <path
                        class="arrow-face"
                        d="M 10 5 L 3.5 11.5 Q 2 12 3.5 12.5 L 10 19 L 10 16 L 21 16 Q 22 16 22 15 L 22 9 Q 22 8 21 8 L 10 8 Z"
                    />
                </svg>
            </button>
        </div>
        <button class="big-button" on:click={handleRandom}>rndm</button>
        <div class="slider-track">
            <button
                class="slider-knob next"
                on:click={handleNext}
                aria-label="Next Image"
            >
                <svg viewBox="0 0 24 28" class="arrow-icon">
                    <!-- Extrusion (Bottom Layer) -->
                    <path
                        d="M 14 5 L 20.5 11.5 Q 22 12 20.5 12.5 L 14 19 L 14 16 L 3 16 Q 2 16 2 15 L 2 9 Q 2 8 3 8 L 14 8 Z"
                        fill="#004d40"
                        stroke="#004d40"
                        stroke-width="2"
                        stroke-linejoin="round"
                        transform="translate(0, 2)"
                        filter="url(#arrowShadow)"
                    />
                    <!-- Face (Top Layer) -->
                    <path
                        class="arrow-face"
                        d="M 14 5 L 20.5 11.5 Q 22 12 20.5 12.5 L 14 19 L 14 16 L 3 16 Q 2 16 2 15 L 2 9 Q 2 8 3 8 L 14 8 Z"
                    />
                </svg>
            </button>
        </div>
    </div>
</div>

<style>
    .transition-wrapper {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
    }
    .simple-car-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    .hologram-container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        --scan-color: #1de9b6; /* Teal Accent */
    }

    .simple-car-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        /* Initial state: Hidden (clipped) and Teal/Holographic */
        /* Default to scanning right */
        clip-path: inset(0 100% 0 0);
        filter: sepia(100%) hue-rotate(130deg) saturate(300%) brightness(1.1);
        opacity: 0.8;
        animation: materialize-right 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    /* Scan Left Variant */
    .hologram-container[data-direction="-1"] .simple-car-image {
        clip-path: inset(0 0 0 100%);
        animation: materialize-left 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    .scan-line {
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: var(--scan-color);
        box-shadow:
            0 0 10px var(--scan-color),
            0 0 20px var(--scan-color);
        opacity: 0;
        animation: scan-right 0.6s linear forwards;
        z-index: 10;
    }

    .hologram-container[data-direction="-1"] .scan-line {
        left: auto;
        right: 0;
        animation: scan-left 0.6s linear forwards;
    }

    @keyframes materialize-right {
        0% {
            clip-path: inset(0 100% 0 0);
            filter: sepia(100%) hue-rotate(130deg) saturate(300%)
                brightness(1.1);
            opacity: 0.8;
        }
        50% {
            filter: sepia(50%) hue-rotate(130deg) saturate(200%) brightness(1);
            opacity: 0.9;
        }
        100% {
            clip-path: inset(0 0 0 0);
            filter: none;
            opacity: 1;
        }
    }

    @keyframes materialize-left {
        0% {
            clip-path: inset(0 0 0 100%);
            filter: sepia(100%) hue-rotate(130deg) saturate(300%)
                brightness(1.1);
            opacity: 0.8;
        }
        50% {
            filter: sepia(50%) hue-rotate(130deg) saturate(200%) brightness(1);
            opacity: 0.9;
        }
        100% {
            clip-path: inset(0 0 0 0);
            filter: none;
            opacity: 1;
        }
    }

    @keyframes scan-right {
        0% {
            left: 0%;
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            left: 100%;
            opacity: 0;
        }
    }

    @keyframes scan-left {
        0% {
            right: 0%;
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            right: 100%;
            opacity: 0;
        }
    }

    .teal-trapezoid {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        transform: scale(1.2); /* Slightly larger presentation */
    }

    .screen-unit {
        width: 360px;
        height: 260px;
        background: linear-gradient(135deg, #009688, #00796b);
        /* Rounded trapezoid path */
        clip-path: path(
            "M 40 0 L 320 0 Q 330 0 332 10 L 360 250 Q 362 260 350 260 L 10 260 Q -2 260 0 250 L 28 10 Q 30 0 40 0 Z"
        );
        padding: 20px 35px;
        box-sizing: border-box;
        /* Replaced box-shadow with drop-shadow to respect clip-path */
        filter: drop-shadow(0 20px 20px rgba(0, 0, 0, 0.3));
        box-shadow: inset 0 2px 5px rgba(255, 255, 255, 0.3);
        border-bottom: 6px solid #00695c; /* Added depth */
        position: relative;
    }

    /* Add a subtle texture/noise to the casing */
    .screen-unit::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
        pointer-events: none;
        mix-blend-mode: overlay;
        z-index: 1;
    }

    .screen-glass {
        width: 100%;
        height: 100%;
        background: #004d40;
        border-radius: 8px;
        overflow: hidden;
        position: relative;
        border: 3px solid #80cbc4;
        box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.8);
        z-index: 2;
    }

    .scan-overlay {
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0) 0px,
            rgba(0, 0, 0, 0) 2px,
            rgba(0, 0, 0, 0.1) 3px,
            rgba(0, 0, 0, 0.1) 4px
        );
        pointer-events: none;
        z-index: 3;
    }

    .control-deck {
        width: 400px;
        height: 110px;
        background: linear-gradient(to bottom, #e0f2f1, #b2dfdb);
        border-radius: 25px;
        display: flex;
        justify-content: center; /* Changed from space-around */
        gap: 15px; /* Tighter gap */
        align-items: center;
        padding: 0 30px;
        box-shadow:
            0 10px 25px rgba(0, 0, 0, 0.15),
            inset 0 2px 5px rgba(255, 255, 255, 0.8);
        border-bottom: 6px solid #00695c;
        position: relative;
        z-index: 1;
    }

    .slider-track {
        width: 100px; /* Increased size */
        height: 70px;
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .slider-knob {
        width: 100px; /* Increased size */
        height: 70px;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.1s;
    }

    .arrow-icon {
        width: 100%;
        height: 100%;
        overflow: visible;
    }

    .arrow-face {
        fill: url(#arrowGradient);
        stroke: white;
        stroke-width: 0.8px; /* Thinner border */
        stroke-linejoin: round; /* Rounded corners */
        transition: transform 0.1s;
    }

    .slider-knob:active {
        transform: scale(0.9);
    }

    .slider-knob:active .arrow-face {
        transform: translate(0, 1px); /* Subtle press effect */
    }

    .big-button {
        /* Removed fixed width, using padding for tight fit */
        padding: 0 14px;
        height: 34px;
        border-radius: 12px; /* Rounded rectangle */
        background: linear-gradient(145deg, #009688, #00796b);
        border: 2px solid #fff;
        color: #fff;
        font-family: "Outfit", sans-serif;
        font-weight: 800;
        font-size: 0.9rem;
        letter-spacing: 1px;
        cursor: pointer;
        box-shadow:
            0 4px 8px rgba(0, 150, 136, 0.3),
            inset 0 2px 5px rgba(255, 255, 255, 0.3);
        transition:
            transform 0.1s,
            box-shadow 0.1s;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        text-transform: lowercase;
    }

    .big-button:active {
        transform: scale(0.95);
        box-shadow:
            0 2px 4px rgba(0, 150, 136, 0.3),
            inset 0 2px 5px rgba(0, 0, 0, 0.2);
        background: #00695c;
    }
</style>
