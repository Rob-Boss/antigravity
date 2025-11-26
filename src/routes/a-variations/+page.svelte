<script lang="ts">
    import LetterA from "$lib/components/LetterA.svelte";

    const variants = [
        {
            name: "1. Classic Uppercase",
            props: {
                character: "A",
                fontFamily: "'Outfit', sans-serif",
                particleSize: 2,
                particleDensity: 6,
                particleColor: "",
                interactionRadius: 80,
                restoreSpeed: 0.05,
                volatility: 0,
            },
        },
        {
            name: "2. Classic Lowercase",
            props: {
                character: "a",
                fontFamily: "'Outfit', sans-serif",
                particleSize: 2,
                particleDensity: 6,
                particleColor: "",
                interactionRadius: 80,
                restoreSpeed: 0.05,
                volatility: 0,
            },
        },
        {
            name: "3. Bold Uppercase",
            props: {
                character: "A",
                fontFamily: "'Impact', sans-serif",
                particleSize: 2.5,
                particleDensity: 4,
                particleColor: "#ffffff",
                interactionRadius: 100,
                restoreSpeed: 0.08,
                volatility: 0,
            },
        },
        {
            name: "4. Serif Lowercase",
            props: {
                character: "a",
                fontFamily: "'Times New Roman', serif",
                particleSize: 1.5,
                particleDensity: 5,
                particleColor: "#f0ffce",
                interactionRadius: 60,
                restoreSpeed: 0.04,
                volatility: 0,
            },
        },
        {
            name: "5. Stardust",
            props: {
                character: "A",
                fontFamily: "'Outfit', sans-serif",
                particleSize: 1,
                particleDensity: 3,
                particleColor: "#8ba59e",
                interactionRadius: 120,
                restoreSpeed: 0.02,
                volatility: 0.5,
            },
        },
        {
            name: "6. Asteroids",
            props: {
                character: "A",
                fontFamily: "'Courier New', monospace",
                particleSize: 5,
                particleDensity: 10,
                particleColor: "#ffb7b2",
                interactionRadius: 90,
                restoreSpeed: 0.03,
                volatility: 0,
            },
        },
        {
            name: "7. Matrix",
            props: {
                character: "A",
                fontFamily: "'Courier New', monospace",
                particleSize: 2,
                particleDensity: 5,
                particleColor: "#00ff00",
                interactionRadius: 50,
                restoreSpeed: 0.1,
                volatility: 0,
            },
        },
        {
            name: "8. Fire",
            props: {
                character: "A",
                fontFamily: "'Outfit', sans-serif",
                particleSize: 3,
                particleDensity: 5,
                particleColor: "#ff4500",
                interactionRadius: 100,
                restoreSpeed: 0.06,
                volatility: 2,
            },
        },
        {
            name: "9. Ghost",
            props: {
                character: "a",
                fontFamily: "'Outfit', sans-serif",
                particleSize: 1,
                particleDensity: 4,
                particleColor: "rgba(255, 255, 255, 0.3)",
                interactionRadius: 150,
                restoreSpeed: 0.01,
                volatility: 1,
            },
        },
        {
            name: "10. Explosion",
            props: {
                character: "A",
                fontFamily: "'Arial Black', sans-serif",
                particleSize: 2,
                particleDensity: 5,
                particleColor: "#ffff00",
                interactionRadius: 200,
                restoreSpeed: 0.02,
                volatility: 0,
            },
        },
    ];
</script>

<main>
    <h1>Choose Your Favorite A</h1>
    <p>Different characters, fonts, and particle physics.</p>
    <div class="grid">
        {#each variants as variant}
            <div class="variant-card">
                <h2>{variant.name}</h2>
                <div class="letter-wrapper">
                    <LetterA {...variant.props} />
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
