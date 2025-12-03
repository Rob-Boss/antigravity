<script lang="ts">
    import SwardyLogo from "$lib/components/SwardyLogo.svelte";
</script>

<div class="iframe-container">
    <SwardyLogo scale={0.8} />
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        background: transparent;
        overflow: hidden;
    }
    .iframe-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
