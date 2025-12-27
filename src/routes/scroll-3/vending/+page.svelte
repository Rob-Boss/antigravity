<script>
    import VendingMachine from "$lib/components/merch-lab/VendingMachine2D.svelte";
</script>

<div class="page-wrapper">
    <VendingMachine />
</div>

<style>
    .page-wrapper {
        width: 100vw;
        height: 100vh;
        background: var(--vending-black);
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        perspective: 2000px; /* Global perspective */
    }
</style>
