<script lang="ts">
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";

    export let theme = "original";

    let images = [
        "/car-viewer/cool cars/320323059e18d10e4e0a50610a18af75.jpg",
        "/car-viewer/cool cars/5ab0c2cac90a5bf1d5cbba23b273c325.jpg",
        "/car-viewer/cool cars/a3f30952dad606e2a022ebec37643cc6.jpg",
        "/car-viewer/cool cars/ade9dcd92eea3f026ec8dc354d4eeb1a.jpg",
        "/car-viewer/cool cars/cfc6b75f9df2530aae2ae356d5606fdd.jpg",
        "/car-viewer/cool cars/d416275c58e6598da16769b2556d64e7.jpg",
        "/car-viewer/cool cars/dfc337e5cbe1ee7ecdd55fbc5caeb013.jpg",
    ];

    let currentIndex = 0;
    let direction = 1; // 1 for right, -1 for left

    function nextImage() {
        direction = 1;
        currentIndex = (currentIndex + 1) % images.length;
    }

    function prevImage() {
        direction = -1;
        currentIndex = (currentIndex - 1 + images.length) % images.length;
    }

    function selectRandomImage() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * images.length);
        } while (newIndex === currentIndex && images.length > 1);

        // Random direction for fun
        direction = Math.random() > 0.5 ? 1 : -1;
        currentIndex = newIndex;
    }

    // Preload images
    onMount(() => {
        images.forEach((src) => {
            const img = new Image();
            img.src = src;
        });
    });
</script>

<div class="toy-machine {theme}">
    <!-- Antenna -->
    <div class="antenna">
        <div class="ball"></div>
        <div class="stick"></div>
    </div>

    <!-- Main Screen Area -->
    <div class="screen-bezel">
        <div class="screen-glass">
            {#key currentIndex}
                <img
                    src={images[currentIndex]}
                    alt="Cool Car {currentIndex + 1}"
                    class="car-image"
                    in:fly={{
                        x: 200 * direction,
                        duration: 400,
                        easing: cubicOut,
                    }}
                    out:fly={{
                        x: -200 * direction,
                        duration: 400,
                        easing: cubicOut,
                    }}
                />
            {/key}
            <div class="scanlines"></div>
            <div class="glare"></div>
        </div>
    </div>

    <!-- Controls Area -->
    <div class="decoration-lights">
        {#each images as _, i}
            <div class="light {i === currentIndex ? 'active' : ''}"></div>
        {/each}
    </div>

    <div class="controls">
        <button
            class="nav-btn left"
            on:click={prevImage}
            aria-label="Previous Image"
        >
            <div class="arrow-icon"></div>
        </button>

        <button
            class="nav-btn random"
            on:click={selectRandomImage}
            aria-label="Random Image"
        >
            <div class="random-icon">?</div>
        </button>

        <button
            class="nav-btn right"
            on:click={nextImage}
            aria-label="Next Image"
        >
            <div class="arrow-icon"></div>
        </button>
    </div>

    <!-- Feet -->
    <div class="feet">
        <div class="foot left"></div>
        <div class="foot right"></div>
    </div>
</div>

<style>
    .toy-machine {
        position: relative;
        width: 100%;
        max-width: 600px;
        background: #ff7043; /* Vibrant Orange */
        border-radius: 40px;
        padding: 30px;
        box-shadow:
            0 20px 0 #d84315,
            /* 3D depth */ 0 30px 20px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        align-items: center;
        transform-style: preserve-3d;
        transition: transform 0.1s;
        box-sizing: border-box;
    }

    /* Antenna */
    .antenna {
        position: absolute;
        top: -60px;
        right: 60px;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: -1;
    }
    .antenna .ball {
        width: 20px;
        height: 20px;
        background: #ffeb3b;
        border-radius: 50%;
        border: 3px solid #fbc02d;
        box-shadow: inset -2px -2px 5px rgba(0, 0, 0, 0.2);
    }
    .antenna .stick {
        width: 6px;
        height: 50px;
        background: #bdbdbd;
        border-left: 2px solid #eeeeee;
        border-right: 2px solid #9e9e9e;
    }

    .screen-bezel {
        width: 100%;
        height: 400px;
        background: #4dd0e1; /* Cyan */
        border-radius: 20px;
        padding: 20px;
        box-sizing: border-box;
        box-shadow:
            inset 0 5px 10px rgba(0, 0, 0, 0.2),
            0 5px 0 rgba(255, 255, 255, 0.3);
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 30px;
    }

    .screen-glass {
        width: 100%;
        height: 100%;
        background: #263238; /* Dark screen bg */
        border-radius: 10px;
        overflow: hidden;
        position: relative;
        box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .car-image {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        position: absolute; /* For transitions */
    }

    .scanlines {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.05) 50%,
            transparent 50%
        );
        background-size: 100% 4px;
        pointer-events: none;
        z-index: 10;
    }

    .glare {
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 60%
        );
        pointer-events: none;
        z-index: 11;
    }

    .controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }

    .nav-btn {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: none;
        background: #ffeb3b; /* Yellow */
        box-shadow:
            0 8px 0 #fbc02d,
            0 15px 10px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.1s;
        position: relative;
    }

    .nav-btn:active {
        transform: translateY(8px);
        box-shadow:
            0 0 0 #fbc02d,
            inset 0 5px 10px rgba(0, 0, 0, 0.1);
    }

    .arrow-icon {
        width: 0;
        height: 0;
        border-top: 15px solid transparent;
        border-bottom: 15px solid transparent;
    }

    .nav-btn.left .arrow-icon {
        border-right: 25px solid #f57f17;
        margin-right: 5px;
    }

    .nav-btn.right .arrow-icon {
        border-left: 25px solid #f57f17;
        margin-left: 5px;
    }

    .nav-btn.random {
        background: #e040fb; /* Purple */
        box-shadow:
            0 8px 0 #aa00ff,
            0 15px 10px rgba(0, 0, 0, 0.2);
    }

    .nav-btn.random:active {
        box-shadow:
            0 0 0 #aa00ff,
            inset 0 5px 10px rgba(0, 0, 0, 0.1);
    }

    .random-icon {
        color: white;
        font-size: 40px;
        font-weight: bold;
        text-shadow: 0 2px 0 rgba(0, 0, 0, 0.2);
    }

    .decoration-lights {
        display: flex;
        gap: 15px;
        background: #3e2723;
        padding: 10px 20px;
        border-radius: 20px;
        box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.5);
        margin-bottom: 20px; /* Add spacing */
    }

    .light {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: #5d4037;
        transition: all 0.3s;
    }

    .light.active {
        background: #76ff03;
        box-shadow: 0 0 10px #76ff03;
    }

    .feet {
        position: absolute;
        bottom: -20px;
        width: 80%;
        display: flex;
        justify-content: space-between;
        z-index: -1;
    }

    .foot {
        width: 60px;
        height: 40px;
        background: #d84315;
        border-radius: 0 0 20px 20px;
    }

    /* --- THEMES --- */

    /* 2. Ceramic */
    .toy-machine.ceramic {
        background: #ffffff;
        box-shadow:
            0 20px 0 #e0e0e0,
            0 30px 20px rgba(0, 0, 0, 0.05);
    }
    .toy-machine.ceramic .screen-bezel {
        background: #f5f5f5;
        box-shadow: inset 0 5px 10px rgba(0, 0, 0, 0.05);
    }
    .toy-machine.ceramic .nav-btn {
        background: #e1f5fe;
        box-shadow:
            0 8px 0 #b3e5fc,
            0 10px 10px rgba(0, 0, 0, 0.05);
    }
    .toy-machine.ceramic .nav-btn:active {
        box-shadow:
            0 0 0 #b3e5fc,
            inset 0 5px 10px rgba(0, 0, 0, 0.05);
    }
    .toy-machine.ceramic .nav-btn .arrow-icon {
        border-right-color: #0288d1;
        border-left-color: #0288d1;
    }
    .toy-machine.ceramic .nav-btn.random {
        background: #fff9c4;
        box-shadow:
            0 8px 0 #fff59d,
            0 10px 10px rgba(0, 0, 0, 0.05);
    }
    .toy-machine.ceramic .nav-btn.random:active {
        box-shadow: 0 0 0 #fff59d;
    }
    .toy-machine.ceramic .random-icon {
        color: #fbc02d;
    }
    .toy-machine.ceramic .decoration-lights {
        background: #eeeeee;
        box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.05);
    }
    .toy-machine.ceramic .light {
        background: #bdbdbd;
    }
    .toy-machine.ceramic .light.active {
        background: #29b6f6;
        box-shadow: 0 0 10px #29b6f6;
    }
    .toy-machine.ceramic .foot {
        background: #e0e0e0;
    }
    .toy-machine.ceramic .antenna .ball {
        background: #ffffff;
        border-color: #e0e0e0;
    }

    /* 3. Matte Black */
    .toy-machine.matte-black {
        background: #212121;
        box-shadow:
            0 20px 0 #000000,
            0 30px 20px rgba(0, 0, 0, 0.5);
    }
    .toy-machine.matte-black .screen-bezel {
        background: #424242;
        box-shadow: inset 0 5px 10px rgba(0, 0, 0, 0.5);
    }
    .toy-machine.matte-black .nav-btn {
        background: #333333;
        box-shadow: 0 8px 0 #000000;
    }
    .toy-machine.matte-black .nav-btn:active {
        box-shadow: 0 0 0 #000000;
    }
    .toy-machine.matte-black .nav-btn .arrow-icon {
        border-right-color: #00e676;
        border-left-color: #00e676;
    }
    .toy-machine.matte-black .nav-btn.random {
        background: #333333;
        box-shadow: 0 8px 0 #000000;
    }
    .toy-machine.matte-black .nav-btn.random:active {
        box-shadow: 0 0 0 #000000;
    }
    .toy-machine.matte-black .random-icon {
        color: #d500f9;
    }
    .toy-machine.matte-black .decoration-lights {
        background: #000000;
    }
    .toy-machine.matte-black .light {
        background: #424242;
    }
    .toy-machine.matte-black .light.active {
        background: #00e676;
        box-shadow: 0 0 15px #00e676;
    }
    .toy-machine.matte-black .foot {
        background: #000000;
    }
    .toy-machine.matte-black .antenna .ball {
        background: #212121;
        border-color: #424242;
    }

    /* 4. Retro Future */
    .toy-machine.retro-future {
        background: #d7ccc8;
        box-shadow:
            0 20px 0 #8d6e63,
            0 30px 20px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
    }
    .toy-machine.retro-future .screen-bezel {
        background: #3e2723;
        border-radius: 5px;
    }
    .toy-machine.retro-future .nav-btn {
        background: #ff5722;
        box-shadow: 0 8px 0 #bf360c;
        border-radius: 5px;
    }
    .toy-machine.retro-future .nav-btn:active {
        box-shadow: 0 0 0 #bf360c;
    }
    .toy-machine.retro-future .nav-btn .arrow-icon {
        border-right-color: #fff;
        border-left-color: #fff;
    }
    .toy-machine.retro-future .nav-btn.random {
        background: #009688;
        box-shadow: 0 8px 0 #004d40;
    }
    .toy-machine.retro-future .nav-btn.random:active {
        box-shadow: 0 0 0 #004d40;
    }
    .toy-machine.retro-future .decoration-lights {
        background: #5d4037;
        border-radius: 5px;
    }
    .toy-machine.retro-future .foot {
        background: #8d6e63;
        border-radius: 0;
    }

    /* 5. Glassmorphism */
    .toy-machine.glassmorphism {
        background: rgba(255, 255, 255, 0.25);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.18);
    }
    .toy-machine.glassmorphism .screen-bezel {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .toy-machine.glassmorphism .nav-btn {
        background: rgba(255, 255, 255, 0.3);
        box-shadow: 0 8px 0 rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.4);
    }
    .toy-machine.glassmorphism .nav-btn:active {
        box-shadow: 0 0 0 rgba(255, 255, 255, 0.1);
    }
    .toy-machine.glassmorphism .nav-btn .arrow-icon {
        border-right-color: rgba(255, 255, 255, 0.8);
        border-left-color: rgba(255, 255, 255, 0.8);
    }
    .toy-machine.glassmorphism .nav-btn.random {
        background: rgba(224, 64, 251, 0.3);
    }
    .toy-machine.glassmorphism .random-icon {
        color: rgba(255, 255, 255, 0.9);
    }
    .toy-machine.glassmorphism .decoration-lights {
        background: rgba(0, 0, 0, 0.2);
    }
    .toy-machine.glassmorphism .foot {
        background: rgba(255, 255, 255, 0.1);
    }

    /* 6. Pastel Pop */
    .toy-machine.pastel-pop {
        background: #f8bbd0; /* Pink */
        box-shadow:
            0 20px 0 #f48fb1,
            0 30px 20px rgba(0, 0, 0, 0.1);
    }
    .toy-machine.pastel-pop .screen-bezel {
        background: #b3e5fc; /* Blue */
    }
    .toy-machine.pastel-pop .nav-btn {
        background: #fff9c4; /* Yellow */
        box-shadow: 0 8px 0 #fff59d;
    }
    .toy-machine.pastel-pop .nav-btn:active {
        box-shadow: 0 0 0 #fff59d;
    }
    .toy-machine.pastel-pop .nav-btn .arrow-icon {
        border-right-color: #ff80ab;
        border-left-color: #ff80ab;
    }
    .toy-machine.pastel-pop .nav-btn.random {
        background: #e1bee7; /* Purple */
        box-shadow: 0 8px 0 #ce93d8;
    }
    .toy-machine.pastel-pop .nav-btn.random:active {
        box-shadow: 0 0 0 #ce93d8;
    }
    .toy-machine.pastel-pop .random-icon {
        color: #fff;
    }
    .toy-machine.pastel-pop .decoration-lights {
        background: #fff;
    }
    .toy-machine.pastel-pop .light {
        background: #f48fb1;
    }
    .toy-machine.pastel-pop .light.active {
        background: #00e5ff;
        box-shadow: 0 0 10px #00e5ff;
    }
    .toy-machine.pastel-pop .foot {
        background: #f48fb1;
    }

    /* 7. Metallic */
    .toy-machine.metallic {
        background: linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%);
        box-shadow:
            0 20px 0 #9e9e9e,
            0 30px 20px rgba(0, 0, 0, 0.3);
    }
    .toy-machine.metallic .screen-bezel {
        background: linear-gradient(to bottom, #424242, #212121);
        box-shadow:
            inset 0 2px 5px rgba(0, 0, 0, 0.5),
            0 1px 0 rgba(255, 255, 255, 0.2);
    }
    .toy-machine.metallic .nav-btn {
        background: linear-gradient(to bottom, #cfd8dc, #b0bec5);
        box-shadow: 0 8px 0 #90a4ae;
    }
    .toy-machine.metallic .nav-btn:active {
        box-shadow: 0 0 0 #90a4ae;
    }
    .toy-machine.metallic .nav-btn .arrow-icon {
        border-right-color: #546e7a;
        border-left-color: #546e7a;
    }
    .toy-machine.metallic .nav-btn.random {
        background: linear-gradient(to bottom, #ffcc80, #ffb74d);
        box-shadow: 0 8px 0 #ffa726;
    }
    .toy-machine.metallic .nav-btn.random:active {
        box-shadow: 0 0 0 #ffa726;
    }
    .toy-machine.metallic .random-icon {
        color: #e65100;
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4);
    }
    .toy-machine.metallic .decoration-lights {
        background: #263238;
    }
    .toy-machine.metallic .foot {
        background: #9e9e9e;
    }

    /* 8. Cyber */
    .toy-machine.cyber {
        background: #0d47a1;
        box-shadow:
            0 20px 0 #002171,
            0 0 20px rgba(13, 71, 161, 0.6);
        border: 2px solid #00e5ff;
    }
    .toy-machine.cyber .screen-bezel {
        background: #000;
        border: 1px solid #00e5ff;
        box-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
    }
    .toy-machine.cyber .nav-btn {
        background: #000;
        border: 2px solid #00e5ff;
        box-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
    }
    .toy-machine.cyber .nav-btn:active {
        transform: scale(0.95);
        box-shadow: 0 0 5px rgba(0, 229, 255, 0.8);
    }
    .toy-machine.cyber .nav-btn .arrow-icon {
        border-right-color: #00e5ff;
        border-left-color: #00e5ff;
    }
    .toy-machine.cyber .nav-btn.random {
        border-color: #d500f9;
        box-shadow: 0 0 10px rgba(213, 0, 249, 0.5);
    }
    .toy-machine.cyber .random-icon {
        color: #d500f9;
        text-shadow: 0 0 5px #d500f9;
    }
    .toy-machine.cyber .decoration-lights {
        background: #000;
        border: 1px solid #00e5ff;
    }
    .toy-machine.cyber .light.active {
        background: #00e5ff;
        box-shadow:
            0 0 10px #00e5ff,
            0 0 20px #00e5ff;
    }
    .toy-machine.cyber .foot {
        background: #002171;
    }

    /* 9. Organic */
    .toy-machine.organic {
        background: #a5d6a7; /* Green */
        box-shadow:
            0 20px 0 #66bb6a,
            0 30px 20px rgba(0, 0, 0, 0.1);
        border-radius: 60px 60px 40px 40px;
    }
    .toy-machine.organic .screen-bezel {
        background: #5d4037; /* Brown */
        border-radius: 30px;
    }
    .toy-machine.organic .nav-btn {
        background: #81c784;
        box-shadow: 0 8px 0 #4caf50;
    }
    .toy-machine.organic .nav-btn:active {
        box-shadow: 0 0 0 #4caf50;
    }
    .toy-machine.organic .nav-btn .arrow-icon {
        border-right-color: #1b5e20;
        border-left-color: #1b5e20;
    }
    .toy-machine.organic .nav-btn.random {
        background: #ffcc80;
        box-shadow: 0 8px 0 #ffb74d;
    }
    .toy-machine.organic .nav-btn.random:active {
        box-shadow: 0 0 0 #ffb74d;
    }
    .toy-machine.organic .random-icon {
        color: #e65100;
    }
    .toy-machine.organic .decoration-lights {
        background: #3e2723;
    }
    .toy-machine.organic .light.active {
        background: #76ff03;
    }
    .toy-machine.organic .foot {
        background: #66bb6a;
        border-radius: 0 0 30px 30px;
    }

    /* 10. Minimalist */
    .toy-machine.minimalist {
        background: #eceff1;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        border: 1px solid #cfd8dc;
        border-radius: 20px;
    }
    .toy-machine.minimalist .screen-bezel {
        background: #fff;
        border: 1px solid #eceff1;
        box-shadow: none;
    }
    .toy-machine.minimalist .nav-btn {
        background: #fff;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        border: 1px solid #cfd8dc;
    }
    .toy-machine.minimalist .nav-btn:active {
        transform: scale(0.98);
        box-shadow: none;
    }
    .toy-machine.minimalist .nav-btn .arrow-icon {
        border-right-color: #455a64;
        border-left-color: #455a64;
    }
    .toy-machine.minimalist .nav-btn.random {
        background: #455a64;
    }
    .toy-machine.minimalist .random-icon {
        color: #fff;
        text-shadow: none;
        font-weight: 300;
    }
    .toy-machine.minimalist .decoration-lights {
        background: #fff;
        box-shadow: none;
        border: 1px solid #eceff1;
    }
    .toy-machine.minimalist .light {
        background: #eceff1;
    }
    .toy-machine.minimalist .light.active {
        background: #455a64;
        box-shadow: none;
    }
    .toy-machine.minimalist .foot {
        display: none;
    }
    .toy-machine.minimalist .antenna {
        display: none;
    }
</style>
