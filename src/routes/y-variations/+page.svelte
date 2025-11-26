<script lang="ts">
    import LetterY from "$lib/components/LetterY.svelte";

    const variants = [
        {
            name: "1. Classic Y",
            description: "Standard uppercase Y shape with straight lines.",
            props: {
                shapeMode: "classic",
                color: "#ffd700",
                secondaryColor: "#ffff00",
            },
        },
        {
            name: "2. Curvy Y",
            description: "Flowing curves with bezier-like paths.",
            props: {
                shapeMode: "curvy",
                color: "#ff69b4",
                secondaryColor: "#ff1493",
            },
        },
        {
            name: "3. Thick Y",
            description: "Bold, heavy weight Y with multiple particle rows.",
            props: {
                shapeMode: "thick",
                color: "#00ffff",
                secondaryColor: "#00bfff",
            },
        },
        {
            name: "4. Serif Y",
            description: "Classic serif font style with decorative ends.",
            props: {
                shapeMode: "serif",
                color: "#9370db",
                secondaryColor: "#ba55d3",
            },
        },
        {
            name: "5. Script Y",
            description: "Elegant flowing script with calligraphic curves.",
            props: {
                shapeMode: "script",
                color: "#ff4500",
                secondaryColor: "#ff6347",
            },
        },
        {
            name: "6. Lowercase y",
            description: "Lowercase y with descender tail.",
            props: {
                shapeMode: "lowercase",
                color: "#32cd32",
                secondaryColor: "#90ee90",
            },
        },
        {
            name: "7. Wide Y",
            description: "Extra wide Y with extended arms.",
            props: {
                shapeMode: "wide",
                color: "#ff00ff",
                secondaryColor: "#ff69b4",
            },
        },
        {
            name: "8. Narrow Y",
            description: "Condensed Y with tight proportions.",
            props: {
                shapeMode: "narrow",
                color: "#87ceeb",
                secondaryColor: "#4169e1",
            },
        },
        {
            name: "9. Rounded Y",
            description: "Soft rounded joints and circular connections.",
            props: {
                shapeMode: "rounded",
                color: "#ffa500",
                secondaryColor: "#ff8c00",
            },
        },
        {
            name: "10. Angular Y",
            description: "Sharp, geometric Y with zigzag edges.",
            props: {
                shapeMode: "angular",
                color: "#00ff00",
                secondaryColor: "#32cd32",
            },
        },
    ];
</script>

<main>
    <h1>Star Particle Y Shapes</h1>
    <p class="subtitle">
        10 Y shapes • Star particles • Smooth amplitude ramping • Color waves
    </p>
    <p class="instructions">
        Watch the <strong>subtle wave</strong> at rest (3px).<br />
        Move your mouse over to see it <strong>smoothly ramp up</strong> to
        dramatic motion (15-45px).<br />
        When you leave, it <strong>gradually ramps back down</strong> instead of
        snapping!
    </p>
    <div class="grid">
        {#each variants as variant}
            <div class="variant-card">
                <h2>{variant.name}</h2>
                <p class="description">{variant.description}</p>
                <div class="letter-wrapper">
                    <!-- @ts-ignore -->
                    <LetterY {...variant.props} />
                </div>
            </div>
        {/each}
    </div>
</main>

<style>
    main {
        min-height: 100vh;
        background: #000000;
        color: #f0f0f0;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    h1 {
        font-family: "Outfit", sans-serif;
        font-size: 3rem;
        margin-bottom: 0.5rem;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 4px;
        background: linear-gradient(90deg, #ffd700, #ffff00, #ffa500);
        background-size: 200% 100%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: star-gradient 3s ease infinite;
    }

    @keyframes star-gradient {
        0%,
        100% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
    }

    .subtitle {
        font-family: "Outfit", sans-serif;
        color: #888;
        margin-bottom: 1rem;
        text-align: center;
        font-size: 1rem;
        letter-spacing: 2px;
    }

    .instructions {
        font-family: "Outfit", sans-serif;
        color: #aaa;
        margin-bottom: 3rem;
        text-align: center;
        font-size: 0.95rem;
        line-height: 1.6;
        max-width: 650px;
    }

    .instructions strong {
        color: #ffd700;
        font-weight: 600;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 2rem;
        width: 100%;
        max-width: 1600px;
    }

    .variant-card {
        background: rgba(255, 255, 255, 0.02);
        border-radius: 16px;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }

    .variant-card::before {
        content: "";
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(
            circle,
            rgba(255, 215, 0, 0.1),
            transparent 50%
        );
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
    }

    .variant-card:hover::before {
        opacity: 1;
    }

    .variant-card:hover {
        transform: translateY(-5px);
        background: rgba(255, 255, 255, 0.04);
        border-color: rgba(255, 215, 0, 0.3);
        box-shadow:
            0 10px 30px rgba(255, 215, 0, 0.2),
            0 0 50px rgba(255, 165, 0, 0.1);
    }

    h2 {
        font-family: "Outfit", sans-serif;
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
        color: #fff;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        font-weight: 600;
    }

    .description {
        font-size: 0.85rem;
        color: #999;
        margin-bottom: 1rem;
        text-align: center;
        line-height: 1.4;
        min-height: 2.8em;
    }

    .letter-wrapper {
        display: flex;
        justify-content: center;
        width: 100%;
    }

    @media (max-width: 768px) {
        .grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }

        h1 {
            font-size: 2rem;
        }
    }
</style>
