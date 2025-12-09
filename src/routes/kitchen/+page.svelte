<script lang="ts">
    import { Canvas } from "@threlte/core";
    import KitchenScene from "$lib/components/kitchen/KitchenScene.svelte";
    import { onMount } from "svelte";
    import { magnetStore } from "$lib/stores/magnetStore";

    onMount(() => {
        magnetStore.initialize();
    });
</script>

<div class="scene-container">
    <Canvas>
        <KitchenScene />
    </Canvas>
</div>

<style>
    .scene-container {
        width: 100vw;
        height: 100vh;
        background-color: #111;
    }
</style>
