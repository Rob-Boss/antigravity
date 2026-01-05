<script lang="ts">
    import VendingClassic from "$lib/components/merch-lab/VendingClassic.svelte";
    import VendingMachineV2 from "$lib/components/merch-lab/VendingMachineV2.svelte";
    import VendingGacha from "$lib/components/merch-lab/VendingGacha.svelte";
    // ...
    // ...
    // Defines the list of experiments
    const experiments = [
        {
            name: "The Classic (Advanced)",
            component: VendingMachineV2,
            description: "V2 Upgrade: Interactive Elevator",
        },
        /*
        {
            id: "classic",
            name: "The Classic",
            component: VendingClassic,
            description: "Coils & Glass"
        },
        */
        /*
        { id: "gacha", name: "The Gacha Globe", component: VendingGacha },
        { id: "locker", name: "The Cube Locker", component: VendingCubeLocker },
        { id: "carousel", name: "The Carousel", component: VendingCarousel },
        { id: "robo", name: "The Robo-Arm", component: VendingRoboArm },
        { id: "knob", name: "The Pull-Knob", component: VendingPullKnob },
        { id: "drop", name: "The Can Drop", component: VendingCanDrop },
        {
            id: "frozen",
            name: "The Frozen Vault",
            component: VendingFrozenVault,
        },
        { id: "vacuum", name: "The Vacuum Tube", component: VendingVacuum },
        {
            id: "monolith",
            name: "The Mystery Monolith",
            component: VendingMonolith,
        },
        { id: "glass", name: "Tech: Glass Demo", component: GlassDemo },
        */
    ];

    let activeExperimentIndex = 0;

    $: ActiveComponent = experiments[activeExperimentIndex].component;
</script>

<div class="lab-container">
    <aside class="sidebar">
        <div class="header">
            <h1>MERCH LABS</h1>
            <p>Experimental Commerce</p>
            <button
                class="reset-btn"
                on:click={() => {
                    const current = activeExperimentIndex;
                    activeExperimentIndex = -1;
                    setTimeout(() => (activeExperimentIndex = current), 100);
                }}>FORCE RESET</button
            >
        </div>
        <nav>
            {#each experiments as exp, i}
                <button
                    class:active={activeExperimentIndex === i}
                    on:click={() => (activeExperimentIndex = i)}
                >
                    <span class="idx">{i + 1}.</span>
                    <span class="name">{exp.name}</span>
                    {#if !exp.component}
                        <span class="wip">(WIP)</span>
                    {/if}
                </button>
            {/each}
        </nav>
    </aside>

    <main class="stage">
        {#if ActiveComponent}
            <div class="experiment-wrapper">
                <svelte:component this={ActiveComponent} isActive={true} />
            </div>
        {:else}
            <div class="placeholder">
                <h2>Work In Progress</h2>
                <p>This unit is currently under construction.</p>
            </div>
        {/if}
    </main>
</div>

<style>
    :global(body) {
        margin: 0;
        background: #111;
        color: #eee;
        font-family: "Inter", sans-serif;
    }

    .lab-container {
        display: flex;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }

    .sidebar {
        width: 300px;
        background: #1a1a1a;
        border-right: 1px solid #333;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
    }

    .header {
        padding: 20px;
        border-bottom: 1px solid #333;
        background: #000;
    }

    .header h1 {
        margin: 0;
        font-size: 1.5rem;
        color: #fff;
        letter-spacing: 2px;
    }

    .header p {
        margin: 5px 0 0;
        font-size: 0.8rem;
        color: #666;
        text-transform: uppercase;
    }

    nav {
        flex: 1;
        overflow-y: auto;
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    nav button {
        background: transparent;
        border: 1px solid transparent;
        color: #888;
        padding: 12px 15px;
        text-align: left;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        border-radius: 4px;
        transition: all 0.2s;
        font-family: monospace;
        font-size: 0.9rem;
    }

    nav button:hover {
        background: #222;
        color: #ccc;
    }

    nav button.active {
        background: #333;
        color: #fff;
        border-color: #444;
    }

    .idx {
        color: #444;
        font-weight: bold;
    }

    button.active .idx {
        color: #f60;
    }

    .wip {
        margin-left: auto;
        font-size: 0.7rem;
        color: #444;
    }

    .stage {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #0f0f0f;
        background-image: radial-gradient(#222 1px, transparent 1px);
        background-size: 20px 20px;
        padding: 40px;
    }

    .experiment-wrapper {
        width: 100%;
        max-width: 800px;
        height: 100%;
        max-height: 800px;
        /* box-shadow: 0 0 50px rgba(0,0,0,0.5); */
    }

    .placeholder {
        text-align: center;
        border: 2px dashed #333;
        padding: 40px;
        border-radius: 10px;
        color: #444;
    }
</style>
