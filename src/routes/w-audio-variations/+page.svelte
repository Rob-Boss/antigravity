<script lang="ts">
    import LetterW from "$lib/components/LetterW.svelte";

    const variations = [
        {
            id: 0,
            name: "Orchestral Pizz",
            description: "Deep, woody, classical string section",
        },
        { id: 1, name: "Banjo", description: "Bright, metallic twang" },
        {
            id: 2,
            name: "Harpsichord",
            description: "Sharp attack, rich, baroque pluck",
        },
        { id: 3, name: "Sitar", description: "Buzzing, bending, exotic" },
        {
            id: 4,
            name: "Muted Guitar",
            description: "Clean, chunky, percussive",
        },
        { id: 5, name: "Double Bass", description: "Low, jazzy thump" },
        {
            id: 6,
            name: "Kora",
            description: "African harp-lute, calabash resonance",
        },
        { id: 7, name: "Jaw Harp", description: "Boingy, vocal-like spring" },
        { id: 8, name: "Clavinet", description: "Funky, electric, sharp" },
        { id: 9, name: "Zither", description: "Bright, folk string" },
    ];
</script>

<div class="container">
    <h1>Letter W Audio Variations</h1>
    <p>Strum the strings to hear different instruments.</p>

    <div class="grid">
        {#each variations as v}
            <div class="card">
                <h2>{v.name}</h2>
                <p>{v.desc}</p>
                <div class="letter-wrapper">
                    <LetterW audioVariant={v.id} />
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
