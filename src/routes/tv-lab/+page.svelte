<script lang="ts">
    import CRTTelevision from "$lib/components/tv/CRTTelevision.svelte";
</script>

<div class="tv-lab">
    <h1>CRT TV Lab</h1>
    <p class="subtitle">Turn the dial to change channels • Channels 1-13</p>

    <CRTTelevision />
</div>

<style>
    .tv-lab {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        color: white;
        font-family: "Inter", sans-serif;
        padding: 2rem;
    }

    h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        font-weight: 700;
        text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
    }

    .subtitle {
        opacity: 0.7;
        margin-bottom: 3rem;
        font-size: 1rem;
    }
</style>
