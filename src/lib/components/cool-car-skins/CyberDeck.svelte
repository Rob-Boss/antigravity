<script lang="ts">
    import { createViewerStore } from "$lib/stores/viewerStore";
    import { fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";

    const {
        currentIndex,
        direction,
        images,
        nextImage,
        prevImage,
        selectRandomImage,
    } = createViewerStore();
</script>

<div class="cyber-deck">
    <div class="frame">
        <div class="header-bar">
            <span class="status">CONNECTED</span>
            <span class="id">ID: 8X-99</span>
        </div>
        <div class="holo-screen">
            {#key $currentIndex}
                <img
                    src={images[$currentIndex]}
                    alt="Cyber Car"
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
            <div class="grid-overlay"></div>
            <div class="corner-brackets"></div>
        </div>
        <div class="controls-row">
            <button class="cyber-btn prev" on:click={prevImage}
                >&lt; PREV</button
            >
            <button class="cyber-btn random" on:click={selectRandomImage}
                >[ RND ]</button
            >
            <button class="cyber-btn next" on:click={nextImage}
                >NEXT &gt;</button
            >
        </div>
    </div>
</div>

<style>
    .cyber-deck {
        font-family: "Courier New", Courier, monospace;
        width: 420px;
        background: #000;
        padding: 10px;
        clip-path: polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%);
        border: 2px solid #0ff;
        box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
    }

    .frame {
        background: #050505;
        padding: 15px;
        border: 1px solid #004d40;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .header-bar {
        display: flex;
        justify-content: space-between;
        color: #0ff;
        font-size: 12px;
        border-bottom: 1px solid #0ff;
        padding-bottom: 5px;
        text-shadow: 0 0 5px #0ff;
    }

    .holo-screen {
        height: 220px;
        background: rgba(0, 20, 20, 0.8);
        border: 1px solid #0ff;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .car-image {
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        position: absolute;
        filter: drop-shadow(0 0 5px rgba(0, 255, 255, 0.5));
    }

    .grid-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
        background-size: 20px 20px;
        pointer-events: none;
        z-index: 10;
    }

    .corner-brackets {
        position: absolute;
        inset: 10px;
        border: 2px solid transparent;
        border-top-color: #0ff;
        border-bottom-color: #0ff;
        pointer-events: none;
        z-index: 11;
    }
    .corner-brackets::before,
    .corner-brackets::after {
        content: "";
        position: absolute;
        inset: -2px;
        border: 2px solid transparent;
        border-left-color: #0ff;
        border-right-color: #0ff;
    }

    .controls-row {
        display: flex;
        justify-content: space-between;
        gap: 10px;
    }

    .cyber-btn {
        flex: 1;
        background: transparent;
        border: 1px solid #0ff;
        color: #0ff;
        padding: 10px;
        font-family: inherit;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s;
        text-transform: uppercase;
        clip-path: polygon(10% 0, 100% 0, 100% 80%, 90% 100%, 0 100%, 0 20%);
    }

    .cyber-btn:hover {
        background: rgba(0, 255, 255, 0.1);
        box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
    }

    .cyber-btn:active {
        background: #0ff;
        color: #000;
    }

    .cyber-btn.random {
        border-color: #f0f;
        color: #f0f;
    }
    .cyber-btn.random:hover {
        background: rgba(255, 0, 255, 0.1);
        box-shadow: 0 0 10px rgba(255, 0, 255, 0.3);
    }
    .cyber-btn.random:active {
        background: #f0f;
        color: #000;
    }
</style>
