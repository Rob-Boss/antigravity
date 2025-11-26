<script lang="ts">
    import LetterS from "$lib/components/LetterS.svelte";

    const variations = [
        { id: 0, name: "Silk", desc: "Soft white noise" },
        { id: 1, name: "Velvet", desc: "Warm pink noise" },
        { id: 2, name: "Wind Chimes", desc: "Pentatonic blips" },
        { id: 3, name: "Water", desc: "Liquid flow" },
        { id: 4, name: "Static", desc: "Electric clicks" },
        { id: 5, name: "Harp", desc: "Plucked strings" },
        { id: 6, name: "Breath", desc: "Filtered air" },
        { id: 7, name: "Crystal", desc: "Glassy resonance" },
        { id: 8, name: "Sand", desc: "Gritty grains" },
        { id: 9, name: "Purr", desc: "Low rumble" },
    ];
</script>

<div class="container">
    <h1>Letter S Audio Variations</h1>
    <p>Brush the letters to hear different textures.</p>

    <div class="grid">
        {#each variations as v}
            <div class="card">
                <h2>{v.name}</h2>
                <p>{v.desc}</p>
                <div class="letter-wrapper">
                    <LetterS audioVariant={v.id} />
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
    }
</style>
