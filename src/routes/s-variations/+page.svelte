<script lang="ts">
    import LetterS from "$lib/components/LetterS.svelte";

    // Base props for consistent look (Original Sage)
    const baseProps = {
        palette: ["#8ba59e", "#f0ffce", "#ffffff"],
        hairLength: 15,
        hairSpacing: 4,
        hairThickness: 1,
        hairVariance: 5,
    };

    const variants = [
        {
            name: "Standard",
            path: "M 150 50 Q 50 50 50 100 Q 50 150 150 150 Q 250 150 250 200 Q 250 250 150 250",
        },
        {
            name: "Wide & Heavy",
            // Wider curves, more robust
            path: "M 170 50 Q 30 50 30 110 Q 30 170 150 170 Q 270 170 270 230 Q 270 290 130 290",
        },
        {
            name: "Tall Script",
            // Narrower, more vertical, elegant
            path: "M 130 40 Q 80 40 80 90 Q 80 140 120 150 Q 160 160 160 210 Q 160 260 110 260",
        },
        {
            name: "Geometric / Boxy",
            // Sharper turns, almost like a 5 or block S
            path: "M 160 50 L 60 50 L 60 150 L 140 150 L 140 250 L 40 250",
        },
        {
            name: "Abstract Swirl",
            // A more loose, artistic curve
            path: "M 140 60 C 40 60, 40 140, 100 150 C 160 160, 160 240, 60 240",
        },
    ];
</script>

<main>
    <h1>Choose Your Favorite Shape</h1>
    <p>Same mossy texture, different underlying structures.</p>
    <div class="grid">
        {#each variants as variant}
            <div class="variant-card">
                <h2>{variant.name}</h2>
                <div class="letter-wrapper">
                    <LetterS {...baseProps} pathString={variant.path} />
                </div>
            </div>
        {/each}
    </div>
</main>

<style>
    main {
        min-height: 100vh;
        background-color: #1a0f0f; /* Match main bg */
        color: #f0ffce;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    h1 {
        font-family: "Outfit", sans-serif;
        font-size: 2rem;
        margin-bottom: 0.5rem;
        text-align: center;
    }

    p {
        font-family: "Outfit", sans-serif;
        color: #8ba59e;
        margin-bottom: 2rem;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        width: 100%;
        max-width: 1200px;
    }

    .variant-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid rgba(240, 255, 206, 0.1);
    }

    h2 {
        font-family: "Outfit", sans-serif;
        font-size: 1.2rem;
        margin-bottom: 1rem;
        color: #8ba59e;
    }

    .letter-wrapper {
        display: flex;
        justify-content: center;
        width: 100%;
    }
</style>
