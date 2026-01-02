<script>
    import VendingMachine from "$lib/components/merch-lab/VendingMachine2D.svelte";
    import StaticBackground from "$lib/components/visuals/StaticBackground.svelte";
</script>

<div class="page-wrapper">
    <div class="static-bg">
        <StaticBackground
            resolution={1.0}
            floor={20}
            ceiling={230}
            speed={0.5}
        />
    </div>
    <VendingMachine />
</div>

<style>
    .page-wrapper {
        width: 100vw;
        height: 100vh;
        background: var(--module-grey);
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        perspective: 2000px; /* Global perspective */
        position: relative;
    }

    .static-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        opacity: 0.5;
        pointer-events: none;
    }
</style>
