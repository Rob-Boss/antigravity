<script lang="ts">
    import HudBridgeStone from "$lib/components/hud/myst-bridge/HudBridgeStone.svelte";
    import HudBridgeWood from "$lib/components/hud/myst-bridge/HudBridgeWood.svelte";
    import HudBridgeIron from "$lib/components/hud/myst-bridge/HudBridgeIron.svelte";
    import HudBridgeMarble from "$lib/components/hud/myst-bridge/HudBridgeMarble.svelte";
    import HudBridgeRope from "$lib/components/hud/myst-bridge/HudBridgeRope.svelte";
    import HudBridgeRuin from "$lib/components/hud/myst-bridge/HudBridgeRuin.svelte";
    import HudBridgeCrystal from "$lib/components/hud/myst-bridge/HudBridgeCrystal.svelte";
    import HudBridgeObservatory from "$lib/components/hud/myst-bridge/HudBridgeObservatory.svelte";
    import HudBridgeGarden from "$lib/components/hud/myst-bridge/HudBridgeGarden.svelte";
    import HudBridgeFog from "$lib/components/hud/myst-bridge/HudBridgeFog.svelte";

    // The Original
    import HudMyst from "$lib/components/hud/variations/HudMyst.svelte";
    import HudMystDunes from "$lib/components/hud/variations/HudMystDunes.svelte";

    let selected = 0;
    const variations = [
        {
            name: "The Original Myst",
            component: HudMyst,
            desc: "Pre-rendered 3D (Original)",
        },
        {
            name: "The Myst Dunes",
            component: HudMystDunes,
            desc: "Full Screen Curvy Dunes",
        },
        {
            name: "The Stone Arch",
            component: HudBridgeStone,
            desc: "Classic Stone Bridge",
        },
        {
            name: "The Wooden Span",
            component: HudBridgeWood,
            desc: "Rickety Truss Bridge",
        },
        {
            name: "The Iron Crossing",
            component: HudBridgeIron,
            desc: "Industrial Rusted Bridge",
        },
        {
            name: "The Marble Causeway",
            component: HudBridgeMarble,
            desc: "Pristine Temple Bridge",
        },
        {
            name: "The Rope Bridge",
            component: HudBridgeRope,
            desc: "Swaying Adventure Bridge",
        },
        {
            name: "The Ruined Span",
            component: HudBridgeRuin,
            desc: "Decaying Stone Bridge",
        },
        {
            name: "The Crystal Path",
            component: HudBridgeCrystal,
            desc: "Ethereal Glass Bridge",
        },
        {
            name: "The Observatory Walk",
            component: HudBridgeObservatory,
            desc: "Scientific Metal Bridge",
        },
        {
            name: "The Garden Crossing",
            component: HudBridgeGarden,
            desc: "Overgrown Nature Bridge",
        },
        {
            name: "The Fog Bridge",
            component: HudBridgeFog,
            desc: "Mysterious Misty Bridge",
        },
    ];
</script>

<div class="lab-container">
    <div class="viewport">
        <svelte:component this={variations[selected].component} />
    </div>

    <div class="controls">
        <h1>HUD Design Lab</h1>
        <div class="grid">
            {#each variations as v, i}
                <button
                    class="card"
                    class:active={selected === i}
                    on:click={() => (selected = i)}
                >
                    <h3>{v.name}</h3>
                    <p>{v.desc}</p>
                </button>
            {/each}
        </div>
    </div>
</div>

<style>
    .lab-container {
        width: 100vw;
        height: 100vh;
        display: flex;
        background: #000;
        color: #fff;
        font-family: "Inter", sans-serif;
    }

    .viewport {
        flex: 1;
        height: 100%;
        position: relative;
        overflow: hidden;
        border-right: 1px solid #333;
    }

    .controls {
        width: 300px;
        background: #111;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        overflow-y: auto;
    }

    h1 {
        font-size: 1.5rem;
        margin-bottom: 10px;
        color: #888;
    }

    .grid {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .card {
        background: #222;
        border: 1px solid #333;
        padding: 15px;
        border-radius: 8px;
        text-align: left;
        cursor: pointer;
        transition: all 0.2s;
    }

    .card:hover {
        background: #333;
    }

    .card.active {
        border-color: #fff;
        background: #333;
    }

    h3 {
        font-size: 1rem;
        margin-bottom: 5px;
    }

    p {
        font-size: 0.8rem;
        color: #888;
    }
</style>
