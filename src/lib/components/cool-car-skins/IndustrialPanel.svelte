<script lang="ts">
    import { createViewerStore } from "$lib/stores/viewerStore";
    import { fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import { onMount } from "svelte";

    const {
        currentIndex,
        direction,
        images,
        nextImage,
        prevImage,
        selectRandomImage,
    } = createViewerStore();

    let needleRotation = 0;

    onMount(() => {
        needleRotation = Math.random() * 180 - 90;
    });
</script>

<div class="industrial-panel">
    <div class="metal-plate">
        <div class="screw tl"></div>
        <div class="screw tr"></div>
        <div class="screw bl"></div>
        <div class="screw br"></div>

        <div class="screen-housing">
            <div class="warning-stripe"></div>
            <div class="industrial-screen">
                {#key $currentIndex}
                    <img
                        src={images[$currentIndex]}
                        alt="Industrial Car"
                        class="car-image"
                        in:fly={{
                            x: 200 * $direction,
                            duration: 400,
                            easing: cubicOut,
                        }}
                        out:fly={{
                            x: -200 * $direction,
                            duration: 400,
                            easing: cubicOut,
                        }}
                    />
                {/key}
                <div class="mesh-overlay"></div>
            </div>
            <div class="warning-stripe bottom"></div>
        </div>

        <div class="control-deck">
            <div class="switch-group">
                <button class="toggle-switch" on:click={prevImage}>
                    <div class="lever"></div>
                </button>
                <span class="label">PREV</span>
            </div>

            <div class="gauge">
                <div
                    class="needle"
                    style="transform: rotate({needleRotation}deg)"
                ></div>
            </div>

            <div class="switch-group">
                <button class="toggle-switch" on:click={nextImage}>
                    <div class="lever"></div>
                </button>
                <span class="label">NEXT</span>
            </div>

            <button class="big-red-button" on:click={selectRandomImage}>
                RANDOM
            </button>
        </div>
    </div>
</div>

<style>
    .industrial-panel {
        display: flex;
        justify-content: center;
    }

    .metal-plate {
        background: linear-gradient(135deg, #cfd8dc, #b0bec5);
        padding: 30px;
        border: 1px solid #78909c;
        box-shadow:
            inset 0 0 50px rgba(0, 0, 0, 0.2),
            0 10px 20px rgba(0, 0, 0, 0.3);
        position: relative;
        width: 400px;
    }

    .screw {
        position: absolute;
        width: 15px;
        height: 15px;
        background: radial-gradient(circle, #eceff1, #b0bec5);
        border-radius: 50%;
        border: 1px solid #78909c;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
    .screw::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 80%;
        height: 2px;
        background: #546e7a;
        transform: translate(-50%, -50%) rotate(45deg);
    }
    .screw::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 80%;
        height: 2px;
        background: #546e7a;
        transform: translate(-50%, -50%) rotate(-45deg);
    }
    .tl {
        top: 10px;
        left: 10px;
    }
    .tr {
        top: 10px;
        right: 10px;
    }
    .bl {
        bottom: 10px;
        left: 10px;
    }
    .br {
        bottom: 10px;
        right: 10px;
    }

    .screen-housing {
        background: #263238;
        padding: 5px;
        border: 2px solid #37474f;
        margin-bottom: 25px;
    }

    .warning-stripe {
        height: 10px;
        background: repeating-linear-gradient(
            45deg,
            #fdd835,
            #fdd835 10px,
            #212121 10px,
            #212121 20px
        );
    }

    .industrial-screen {
        height: 240px;
        background: #000;
        position: relative;
        overflow: hidden;
        border-top: 2px solid #000;
        border-bottom: 2px solid #000;
    }

    .car-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        position: absolute;
        filter: sepia(0.2) contrast(1.1);
    }

    .mesh-overlay {
        position: absolute;
        inset: 0;
        background-image: radial-gradient(#000 1px, transparent 1px);
        background-size: 4px 4px;
        opacity: 0.3;
        pointer-events: none;
    }

    .control-deck {
        display: flex;
        justify-content: space-around;
        align-items: flex-end;
        padding: 10px;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 5px;
        border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .switch-group {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
    }

    .toggle-switch {
        width: 40px;
        height: 60px;
        background: #37474f;
        border: 2px solid #263238;
        position: relative;
        cursor: pointer;
        box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
    }

    .lever {
        width: 100%;
        height: 50%;
        background: #cfd8dc;
        border: 1px solid #b0bec5;
        position: absolute;
        top: 0;
        transition: top 0.1s;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    }

    .toggle-switch:active .lever {
        top: 50%;
    }

    .label {
        font-family: "Arial Black", sans-serif;
        font-size: 10px;
        color: #37474f;
        text-transform: uppercase;
    }

    .gauge {
        width: 60px;
        height: 60px;
        background: #fff;
        border-radius: 50%;
        border: 3px solid #37474f;
        position: relative;
        box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .gauge::after {
        content: "";
        position: absolute;
        bottom: 10px;
        left: 50%;
        width: 6px;
        height: 6px;
        background: #37474f;
        border-radius: 50%;
        transform: translateX(-50%);
    }

    .needle {
        position: absolute;
        bottom: 13px;
        left: 50%;
        width: 2px;
        height: 25px;
        background: #d32f2f;
        transform-origin: bottom center;
        transition: transform 0.5s cubic-bezier(0.4, 2, 0.6, 0.8);
    }

    .big-red-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, #ff5252, #d32f2f);
        border: 4px solid #b71c1c;
        color: white;
        font-weight: bold;
        font-size: 10px;
        cursor: pointer;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
        transition: transform 0.1s;
    }

    .big-red-button:active {
        transform: scale(0.95);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    }
</style>
