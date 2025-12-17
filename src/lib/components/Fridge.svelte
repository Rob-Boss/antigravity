<script lang="ts">
    import { Canvas } from "@threlte/core";
    import Scene from "$lib/components/fridge/Scene.svelte";
    import { onMount } from "svelte";
    import { magnetStore } from "$lib/stores/magnetStore";

    onMount(() => {
        magnetStore.initialize();
    });

    export let isActive = true;

    const { draggingMagnet } = magnetStore;
</script>

<div
    class="fridge-container"
    style:cursor={$draggingMagnet ? "grabbing" : "grab"}
>
    <!-- Only render loop when active to save resources on other pages -->
    <Canvas renderMode={isActive ? "always" : "manual"}>
        <Scene />
    </Canvas>
</div>

<style>
    .fridge-container {
        width: 100%;
        height: 100%;
        background: transparent;
        position: relative;
    }
</style>
