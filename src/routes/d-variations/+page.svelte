<script lang="ts">
    import LetterD from "$lib/components/LetterD.svelte";

    // SVG Paths for different D shapes
    // SVG Paths for different lowercase D shapes
    const paths = {
        // 4. Retro Script (Flowing) - The chosen shape
        script: "M 120 240 C 80 240, 60 210, 60 180 C 60 150, 80 120, 120 120 C 140 120, 150 130, 150 130 L 150 40 C 150 20, 170 10, 180 30 L 170 240 C 170 250, 160 260, 140 250",
        scriptHole:
            "M 120 210 C 140 210, 140 180, 140 160 C 140 140, 130 130, 120 130 C 100 130, 90 150, 90 180 C 90 200, 100 210, 120 210 Z",
    };

    const variants = [
        {
            name: "1. Neon Cyber (High Blur)",
            props: {
                path: paths.script,
                holePath: paths.scriptHole,
                eyePosition: { x: 115, y: 170 },
                eyeScale: 0.7,
                squashFactor: 0.2,
                color: "#ff00ff", // Magenta
                blurStrength: 1.5, // Very High Blur
                blurColor: "#00ffff", // Cyan Blur
            },
        },
        {
            name: "2. Sunset Vibes (Warm)",
            props: {
                path: paths.script,
                holePath: paths.scriptHole,
                eyePosition: { x: 115, y: 170 },
                eyeScale: 0.7,
                squashFactor: 0.2,
                color: "#ff9900", // Orange
                blurStrength: 0.8,
                blurColor: "#ff0000", // Red Blur
            },
        },
        {
            name: "3. Deep Ocean (Cool)",
            props: {
                path: paths.script,
                holePath: paths.scriptHole,
                eyePosition: { x: 115, y: 170 },
                eyeScale: 0.7,
                squashFactor: 0.2,
                color: "#00008b", // Dark Blue
                blurStrength: 0.6,
                blurColor: "#00bfff", // Deep Sky Blue Blur
            },
        },
        {
            name: "4. Toxic Slime (Green)",
            props: {
                path: paths.script,
                holePath: paths.scriptHole,
                eyePosition: { x: 115, y: 170 },
                eyeScale: 0.7,
                squashFactor: 0.2,
                color: "#32cd32", // Lime Green
                blurStrength: 1.2,
                blurColor: "#adff2f", // Green Yellow Blur
            },
        },
        {
            name: "5. Royal Velvet (Purple)",
            props: {
                path: paths.script,
                holePath: paths.scriptHole,
                eyePosition: { x: 115, y: 170 },
                eyeScale: 0.7,
                squashFactor: 0.2,
                color: "#800080", // Purple
                blurStrength: 0.9,
                blurColor: "#ff1493", // Deep Pink Blur
            },
        },
        {
            name: "6. Ghostly White (Subtle)",
            props: {
                path: paths.script,
                holePath: paths.scriptHole,
                eyePosition: { x: 115, y: 170 },
                eyeScale: 0.7,
                squashFactor: 0.2,
                color: "#f8f8ff", // Ghost White
                blurStrength: 0.4, // Low Blur
                blurColor: "#dcdcdc", // Gainsboro Blur
            },
        },
        {
            name: "7. Hot Lava (Intense)",
            props: {
                path: paths.script,
                holePath: paths.scriptHole,
                eyePosition: { x: 115, y: 170 },
                eyeScale: 0.7,
                squashFactor: 0.2,
                color: "#ff4500", // Orange Red
                blurStrength: 1.3,
                blurColor: "#ffff00", // Yellow Blur
            },
        },
        {
            name: "8. Midnight Shadow (Dark)",
            props: {
                path: paths.script,
                holePath: paths.scriptHole,
                eyePosition: { x: 115, y: 170 },
                eyeScale: 0.7,
                squashFactor: 0.2,
                color: "#2f4f4f", // Dark Slate Gray
                blurStrength: 1.0,
                blurColor: "#000000", // Black Blur
            },
        },
        {
            name: "9. Bubblegum Pop (Pastel)",
            props: {
                path: paths.script,
                holePath: paths.scriptHole,
                eyePosition: { x: 115, y: 170 },
                eyeScale: 0.7,
                squashFactor: 0.2,
                color: "#ff69b4", // Hot Pink
                blurStrength: 0.7,
                blurColor: "#87ceeb", // Sky Blue Blur
            },
        },
        {
            name: "10. Golden Glitch (Metallic)",
            props: {
                path: paths.script,
                holePath: paths.scriptHole,
                eyePosition: { x: 115, y: 170 },
                eyeScale: 0.7,
                squashFactor: 0.2,
                color: "#ffd700", // Gold
                blurStrength: 1.1,
                blurColor: "#daa520", // Goldenrod Blur
            },
        },
    ];
</script>

<main>
    <h1>Cute D Variations</h1>
    <p>Spin them! Eyes stick closed ('X') until slow. Lands upright.</p>
    <div class="grid">
        {#each variants as variant}
            <div class="variant-card">
                <h2>{variant.name}</h2>
                <div class="letter-wrapper">
                    <LetterD {...variant.props} />
                </div>
            </div>
        {/each}
    </div>
</main>

<style>
    main {
        min-height: 100vh;
        background-color: #1a0f0f;
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
