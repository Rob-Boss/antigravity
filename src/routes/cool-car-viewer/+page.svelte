<script lang="ts">
    import TealTrapezoid from "$lib/components/cool-car-skins/TealTrapezoid.svelte";
</script>

<div class="main-container">
    <TealTrapezoid />
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        background-color: #e0f2f1; /* Matching background */
        font-family: "Outfit", sans-serif;
        overflow: hidden;
    }

    .main-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: radial-gradient(circle at center, #e0f7fa 0%, #80deea 100%);
    }
</style>
