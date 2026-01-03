<script lang="ts">
    import SwardyLogoLab from "./SwardyLogoLab.svelte";
</script>

<svelte:head>
    <title>Swardy Letters Lab</title>
</svelte:head>

<main class="lab-main">
    <div class="lab-header">
        <h1>Letters Lab</h1>
        <p>Tuning & Physics Playground</p>
    </div>

    <div class="logo-viewport">
        <SwardyLogoLab scale={1.2} />
    </div>

    <div class="lab-controls">
        <p>Hover and move fast to test responsiveness.</p>
    </div>
</main>

<style>
    :global(body) {
        background-color: #1a1a1a;
        color: #8ba59e;
        margin: 0;
        overflow: hidden;
    }

    .lab-main {
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: "Courier New", monospace;
    }

    .lab-header {
        position: absolute;
        top: 2rem;
        text-align: center;
    }

    .lab-header h1 {
        margin: 0;
        font-size: 1.5rem;
        letter-spacing: 0.2rem;
        text-transform: uppercase;
    }

    .lab-header p {
        margin: 0.5rem 0 0;
        font-size: 0.8rem;
        opacity: 0.6;
    }

    .logo-viewport {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        /* Ensure we don't block mouse events on the background */
    }

    .lab-controls {
        position: absolute;
        bottom: 2rem;
        text-align: center;
        font-size: 0.8rem;
        opacity: 0.4;
    }
</style>
