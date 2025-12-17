<script lang="ts">
    import VendingMachine2D from "$lib/components/merch-lab/VendingMachine2D.svelte";
</script>

<div class="page-wrapper">
    <VendingMachine2D />
</div>

<style>
    .page-wrapper {
        width: 100vw;
        height: 100vh;
        background: #111;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        perspective: 2000px; /* Global perspective */
    }

    :global(body) {
        margin: 0;
        background: #000;
        font-family: "Inter", sans-serif;
    }
</style>
