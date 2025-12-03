<script lang="ts">
    import DivoomPC from "$lib/components/cool-car-skins/DivoomPC.svelte";
    import Videosphere from "$lib/components/cool-car-skins/Videosphere.svelte";
    import PhilcoPredicta from "$lib/components/cool-car-skins/PhilcoPredicta.svelte";
    import OrangeSphere from "$lib/components/cool-car-skins/OrangeSphere.svelte";
    import YellowCube from "$lib/components/cool-car-skins/YellowCube.svelte";
    import TealTrapezoid from "$lib/components/cool-car-skins/TealTrapezoid.svelte";
    import PocketTV from "$lib/components/cool-car-skins/PocketTV.svelte";
    import SpaceHelmet from "$lib/components/cool-car-skins/SpaceHelmet.svelte";
    import Monolith from "$lib/components/cool-car-skins/Monolith.svelte";
    import ClearTech from "$lib/components/cool-car-skins/ClearTech.svelte";
</script>

<div class="labs-container">
    <h1>Cool Car Viewer: Retro Tech & Pixel Transition</h1>
    <p>
        Exploring retro-futuristic device aesthetics with pixelation
        transitions.
    </p>

    <div class="grid">
        <div class="item">
            <h2>1. Divoom Retro PC</h2>
            <DivoomPC />
        </div>
        <div class="item">
            <h2>2. Videosphere Blob</h2>
            <Videosphere />
        </div>
        <div class="item">
            <h2>3. Philco Angular</h2>
            <PhilcoPredicta />
        </div>
        <div class="item">
            <h2>4. Orange Sphere</h2>
            <OrangeSphere />
        </div>
        <div class="item">
            <h2>5. Yellow Cube</h2>
            <YellowCube />
        </div>
        <div class="item">
            <h2>6. Teal Trapezoid</h2>
            <TealTrapezoid />
        </div>
        <div class="item">
            <h2>7. Red Pocket TV</h2>
            <PocketTV />
        </div>
        <div class="item">
            <h2>8. White Space Helmet</h2>
            <SpaceHelmet />
        </div>
        <div class="item">
            <h2>9. Black Monolith</h2>
            <Monolith />
        </div>
        <div class="item">
            <h2>10. Clear Tech</h2>
            <ClearTech />
        </div>
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        background-color: #f0f4f8;
        font-family: "Outfit", sans-serif;
        overflow-y: auto !important;
    }

    .labs-container {
        padding: 40px;
        max-width: 1800px;
        margin: 0 auto;
        background: radial-gradient(circle at center, #eceff1 0%, #cfd8dc 100%);
        min-height: 100vh;
    }

    h1 {
        text-align: center;
        font-size: 3rem;
        color: #37474f;
        margin-bottom: 10px;
    }

    p {
        text-align: center;
        color: #546e7a;
        font-size: 1.2rem;
        margin-bottom: 60px;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 80px;
        justify-items: center;
        align-items: center;
    }

    .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        width: 100%;
    }

    h2 {
        color: #455a64;
        font-weight: 600;
        margin-bottom: 10px;
    }
</style>
