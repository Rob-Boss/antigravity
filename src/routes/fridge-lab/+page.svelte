<script lang="ts">
    import { Canvas } from "@threlte/core";
    import FridgeLabScene from "$lib/components/fridge/FridgeLabScene.svelte";
    import { onMount } from "svelte";
    import { magnetStore } from "$lib/stores/magnetStore";
    import { FRIDGE_VARIATIONS } from "$lib/components/fridge/fridgeVariations";

    let currentVariationIndex = 0;
    $: currentConfig = FRIDGE_VARIATIONS[currentVariationIndex];

    onMount(() => {
        magnetStore.initialize();
    });

    function nextVariation() {
        currentVariationIndex =
            (currentVariationIndex + 1) % FRIDGE_VARIATIONS.length;
    }

    function prevVariation() {
        currentVariationIndex =
            (currentVariationIndex - 1 + FRIDGE_VARIATIONS.length) %
            FRIDGE_VARIATIONS.length;
    }
</script>

<div class="fridge-container">
    <Canvas>
        <FridgeLabScene config={currentConfig} />
    </Canvas>

    <div class="controls">
        <button on:click={prevVariation}>&larr;</button>
        <div class="info">
            <h2>{currentConfig.name}</h2>
            <p>{currentVariationIndex + 1} / {FRIDGE_VARIATIONS.length}</p>
        </div>
        <button on:click={nextVariation}>&rarr;</button>
    </div>
</div>

<style>
    .fridge-container {
        width: 100vw;
        height: 100vh;
        background: #111;
        position: relative;
    }

    .controls {
        position: absolute;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 20px;
        background: rgba(0, 0, 0, 0.6);
        padding: 15px 30px;
        border-radius: 30px;
        backdrop-filter: blur(10px);
        color: white;
        z-index: 100;
    }

    .info {
        text-align: center;
        min-width: 200px;
    }

    h2 {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 600;
    }

    p {
        margin: 5px 0 0;
        font-size: 0.8rem;
        opacity: 0.7;
    }

    button {
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        font-size: 1.5rem;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
    }

    button:hover {
        background: rgba(255, 255, 255, 0.3);
    }
</style>
