<script lang="ts">
    import Sequencer from "$lib/components/Sequencer.svelte";
    import SwardyLogo from "$lib/components/SwardyLogo.svelte";
    import Fridge from "$lib/components/Fridge.svelte";
    import CoolCarViewer from "$lib/components/CoolCarViewer.svelte";
</script>

<div class="landing-container">
    <div class="grid-item fridge-section" style="grid-column: 2; grid-row: 1;">
        <Fridge />
    </div>

    <div class="grid-item swardy-section" style="grid-column: 1; grid-row: 1;">
        <iframe
            src="/components/swardy-logo"
            title="Swardy Logo"
            frameborder="0"
            scrolling="no"
        ></iframe>
    </div>

    <div class="grid-item sequencer-section">
        <Sequencer />
    </div>

    <div class="grid-item car-section">
        <CoolCarViewer theme="retro-future" />
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        background: #111;
        color: white;
        font-family: sans-serif;
    }

    .landing-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
    }

    .grid-item {
        position: relative;
        overflow: hidden;
        border: 1px solid #333;
    }

    .swardy-section {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #000;
    }

    .fridge-section {
        /* Fridge takes up its container */
    }

    .sequencer-section {
        /* Sequencer takes up its container */
        font-size: 0.8em; /* Scale down slightly if needed */
    }

    .car-section {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #222;
    }
</style>
