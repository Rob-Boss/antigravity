<script lang="ts">
    import SignalStatic from "$lib/components/visuals/SignalStatic.svelte";
    import VendingMachineV3 from "$lib/components/merch-lab/VendingMachineV3.svelte";

    export const ssr = false;
</script>

<div class="page-container">
    <div class="background-layer">
        <SignalStatic
            resolution={1.0}
            blackPoint={0.3}
            whitePoint={0.49}
            speed={20.0}
        />
    </div>

    <div class="content-layer">
        <VendingMachineV3 />
    </div>
</div>

<style>
    .page-container {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background-color: #000;
        position: relative;
    }

    .background-layer {
        position: absolute;
        inset: 0;
        z-index: 0;
    }

    .content-layer {
        position: absolute;
        inset: 0;
        z-index: 10;
    }
</style>
