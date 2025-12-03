<script lang="ts">
    import EL_Base from "$lib/components/el-lab/EL_Base.svelte";
    import EL_Burn from "$lib/components/el-lab/EL_Burn.svelte";
    import EL_Bloom from "$lib/components/el-lab/EL_Bloom.svelte";
    import EL_Halftone from "$lib/components/el-lab/EL_Halftone.svelte";
    import EL_Negative from "$lib/components/el-lab/EL_Negative.svelte";
    import EL_NegativePink from "$lib/components/el-lab/EL_NegativePink.svelte";
    import EL_CMYK from "$lib/components/el-lab/EL_CMYK.svelte";
    import EL_Fluoro from "$lib/components/el-lab/EL_Fluoro.svelte";
    import EL_Rough from "$lib/components/el-lab/EL_Rough.svelte";
    import EL_Bleed from "$lib/components/el-lab/EL_Bleed.svelte";
    import EL_Ghost from "$lib/components/el-lab/EL_Ghost.svelte";

    let selected = 0;
    const variations = [
        {
            name: "Base Riso",
            component: EL_Base,
            desc: "Pink & Black Multiply",
        },
        { name: "Deep Burn", component: EL_Burn, desc: "Cyan & Orange Burn" },
        {
            name: "Soft Bloom",
            component: EL_Bloom,
            desc: "Glowing Screen Blend",
        },
        {
            name: "Halftone",
            component: EL_Halftone,
            desc: "Dot Pattern Overlay",
        },
        { name: "Negative", component: EL_Negative, desc: "Difference Blend" },
        {
            name: "Negative Pink",
            component: EL_NegativePink,
            desc: "Pink Bloom Difference",
        },
        { name: "CMYK", component: EL_CMYK, desc: "4-Color Separation" },
        { name: "Fluoro", component: EL_Fluoro, desc: "Neon on Dark" },
        { name: "Rough Paper", component: EL_Rough, desc: "Heavy Texture" },
        { name: "Ink Bleed", component: EL_Bleed, desc: "Blur & Contrast" },
        { name: "Ghost", component: EL_Ghost, desc: "Faint Hard Light" },
    ];
</script>

<div class="lab-container">
    <div class="viewport">
        <svelte:component this={variations[selected].component} />
    </div>

    <div class="controls">
        <h1>EL Lab</h1>
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
        background: #111;
        color: #fff;
        font-family: "Inter", sans-serif;
    }

    .viewport {
        flex: 1;
        height: 100%;
        position: relative;
        overflow: hidden;
        background: #fff; /* Default to white for Riso */
    }

    .controls {
        width: 300px;
        background: #000;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        overflow-y: auto;
        border-left: 1px solid #333;
    }

    h1 {
        font-size: 1.5rem;
        margin-bottom: 10px;
        color: #ff00ff;
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
        color: #fff;
    }

    .card:hover {
        background: #333;
        border-color: #ff00ff;
    }

    .card.active {
        border-color: #ff00ff;
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
