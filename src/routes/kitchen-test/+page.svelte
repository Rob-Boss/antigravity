<script lang="ts">
    import { Canvas } from "@threlte/core";
    import KitchenScene from "$lib/components/kitchen/KitchenScene.svelte";
    import { onMount } from "svelte";
    import { magnetStore } from "$lib/stores/magnetStore";

    onMount(() => {
        magnetStore.initialize();
    });
</script>

<div class="kitchen-container">
    <Canvas>
        <KitchenScene />
    </Canvas>
</div>

<style>
    .kitchen-container {
        width: 100vw;
        height: 100vh;
        background: #111;
    }
</style>
