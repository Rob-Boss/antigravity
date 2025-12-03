<script lang="ts">
    import TVSputnik from "$lib/components/tv/variations/TVSputnik.svelte";
    import TVJetson from "$lib/components/tv/variations/TVJetson.svelte";
    import TVKubrick from "$lib/components/tv/variations/TVKubrick.svelte";
    import TVRaygun from "$lib/components/tv/variations/TVRaygun.svelte";
    import TVOrbital from "$lib/components/tv/variations/TVOrbital.svelte";
    import TVAstro from "$lib/components/tv/variations/TVAstro.svelte";
    import TVCommander from "$lib/components/tv/variations/TVCommander.svelte";
    import TVPopuluxe from "$lib/components/tv/variations/TVPopuluxe.svelte";
    import TVMonolith from "$lib/components/tv/variations/TVMonolith.svelte";
    import TVVoid from "$lib/components/tv/variations/TVVoid.svelte";

    let selected = 0;
    const variations = [
        { name: "The Blueprint", component: TVSputnik },
        { name: "The Neon Grid", component: TVJetson },
        { name: "The Brutalist", component: TVKubrick },
        { name: "The Braun", component: TVRaygun },
        { name: "The Cyber-Junk", component: TVOrbital },
        { name: "The Glassmorphism", component: TVAstro },
        { name: "The Vector Pop", component: TVCommander },
        { name: "The Steampunk", component: TVPopuluxe },
        { name: "The Glitch", component: TVMonolith },
        { name: "The Bio-Blob", component: TVVoid },
    ];
</script>

<div class="lab-container">
    <header>
        <h1>TV Design Lab</h1>
        <p>Select a Space Age archetype to inspect.</p>
    </header>

    <div class="showcase">
        <div class="spotlight">
            <svelte:component this={variations[selected].component} />
        </div>
        <div class="label">
            <h2>{variations[selected].name}</h2>
        </div>
    </div>

    <div class="grid">
        {#each variations as v, i}
            <button
                class="card"
                class:active={selected === i}
                on:click={() => (selected = i)}
            >
                <div class="mini-preview">
                    <svelte:component this={v.component} />
                </div>
                <span>{v.name}</span>
            </button>
        {/each}
    </div>
</div>

<style>
    .lab-container {
        min-height: 100vh;
        background: #1a1a1a;
        color: #fff;
        padding: 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 40px;
        font-family: "Inter", sans-serif;
    }

    header {
        text-align: center;
    }
    h1 {
        font-size: 3rem;
        margin-bottom: 10px;
        background: linear-gradient(to right, #fff, #888);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    p {
        color: #888;
    }

    .showcase {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        padding: 40px;
        background: radial-gradient(circle at center, #333 0%, #1a1a1a 70%);
        border-radius: 20px;
        border: 1px solid #444;
        width: 100%;
        max-width: 800px;
    }

    .spotlight {
        transform: scale(1.5);
        margin: 40px 0;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 20px;
        width: 100%;
        max-width: 1000px;
    }

    .card {
        background: #222;
        border: 1px solid #333;
        border-radius: 10px;
        padding: 10px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        transition: all 0.2s;
    }
    .card:hover {
        background: #333;
        transform: translateY(-2px);
    }
    .card.active {
        border-color: #fff;
        background: #333;
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
    }

    .mini-preview {
        transform: scale(0.3);
        width: 100px;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
    }

    span {
        font-size: 0.9rem;
        color: #aaa;
    }
    .card.active span {
        color: #fff;
    }
</style>
