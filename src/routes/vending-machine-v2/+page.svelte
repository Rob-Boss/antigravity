<script lang="ts">
    import VendingMachineV2 from "$lib/components/merch-lab/VendingMachineV2.svelte";
    import StaticBackground from "$lib/components/visuals/StaticBackground.svelte";
</script>

<div class="page-container">
    <h1
        style="color: #fff; background: #f0f; position: fixed; top: 0; left: 0; z-index: 99999; padding: 20px; font-family: sans-serif; pointer-events: none;"
    >
        ROUTE: /vending-machine-v2 [V2]
    </h1>

    <div class="content-layer">
        <VendingMachineV2 />
    </div>
</div>

<style>
    .page-container {
        position: relative;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background: #000;
    }

    .background-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
    }

    .content-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
    }
</style>
