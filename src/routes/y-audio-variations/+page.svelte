<script lang="ts">
    import LetterY from "$lib/components/LetterY.svelte";

    const variations = [
        { id: 0, name: "Sparkles", desc: "Magic dust" },
        { id: 1, name: "Charge", desc: "Powering up" },
        { id: 2, name: "Geiger", desc: "Radiation" },
        { id: 3, name: "Forcefield", desc: "Hum" },
        { id: 4, name: "Swarm", desc: "Bees" },
        { id: 5, name: "Sonar", desc: "Pings" },
        { id: 6, name: "Zap", desc: "Electricity" },
        { id: 7, name: "Theremin", desc: "Sci-fi" },
        { id: 8, name: "Scanner", desc: "Droid" },
        { id: 9, name: "Void", desc: "Deep space" },
    ];
</script>

<div class="container">
    <h1>Letter Y Audio Variations</h1>
    <p>Hold click/touch to activate the magnet and hear the field.</p>

    <div class="grid">
        {#each variations as v}
            <div class="card">
                <h2>{v.name}</h2>
                <p>{v.desc}</p>
                <div class="letter-wrapper">
                    <LetterY audioVariant={v.id} />
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    :global(body) {
        background-color: #1a1a1a;
        color: #fff;
        font-family: sans-serif;
        margin: 0;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        text-align: center;
    }

    h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
    }

    p {
        color: #888;
        margin-bottom: 3rem;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
    }

    .card {
        background: #2a2a2a;
        border-radius: 1rem;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: transform 0.2s;
    }

    .card:hover {
        transform: translateY(-5px);
        background: #333;
    }

    h2 {
        margin: 0;
        font-size: 1.2rem;
        color: #fff;
    }

    .card p {
        margin: 0.5rem 0 1.5rem;
        font-size: 0.9rem;
    }

    .letter-wrapper {
        background: #000;
        border-radius: 0.5rem;
        overflow: hidden;
        padding: 1rem;
    }
</style>
