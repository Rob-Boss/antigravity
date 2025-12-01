<script lang="ts">
    import { Canvas } from "@threlte/core";
    import Scene from "$lib/components/fridge/Scene.svelte";
    import { onMount } from "svelte";
    import { magnetStore } from "$lib/stores/magnetStore";

    onMount(() => {
        magnetStore.initialize();
    });
</script>

<div class="fridge-container">
    <Canvas>
        <Scene />
    </Canvas>
</div>

<style>
    .fridge-container {
        width: 100vw;
        height: 100vh;
        background: #111;
    }
</style>
