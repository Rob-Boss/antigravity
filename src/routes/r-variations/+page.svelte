<script lang="ts">
    import LetterR from "$lib/components/LetterR.svelte";

    // 1. The Classic (Times-ish) - Refined Base
    const classicR =
        "M 50 250 L 70 250 M 60 250 L 60 50 M 50 50 L 80 50 L 110 50 Q 160 50 160 100 Q 160 150 110 150 L 60 150 M 100 150 Q 120 150 140 200 Q 160 250 180 250";

    // 2. The Bold (Blocky Sans)
    const boldR =
        "M 50 250 L 90 250 L 90 160 L 110 160 L 150 250 L 200 250 L 150 150 Q 190 150 190 90 Q 190 30 130 30 L 50 30 Z M 90 70 L 130 70 Q 150 70 150 90 Q 150 110 130 110 L 90 110 Z";

    // 3. The Playful (Rounded/Bubble)
    const playfulR =
        "M 60 240 L 60 60 Q 60 30 90 30 L 120 30 Q 170 30 170 90 Q 170 140 120 140 L 100 140 L 140 240 L 110 240 L 80 150 L 80 240 Z M 80 120 L 120 120 Q 150 120 150 90 Q 150 60 120 60 L 80 60 Z";

    // 4. The Italic (Slanted/Sharp)
    const italicR =
        "M 80 250 L 120 50 L 160 50 Q 200 50 190 100 Q 180 140 140 140 L 130 140 L 140 250 L 110 250 L 105 160 L 115 140 L 120 250 Z M 130 120 L 150 120 Q 170 120 175 100 Q 180 80 160 80 L 135 80 Z";

    // 5. The Script (Flowing)
    const scriptR =
        "M 40 220 Q 60 250 80 220 L 100 100 Q 100 50 140 50 Q 180 50 160 100 Q 140 150 100 150 L 120 250 Q 140 280 180 250 M 100 150 L 100 150";

    // 6. The Slab (Geometric Serif)
    const slabR =
        "M 40 250 L 100 250 L 100 50 L 40 50 M 70 50 L 70 250 M 70 50 L 140 50 Q 180 50 180 100 Q 180 150 140 150 L 70 150 M 110 150 L 160 250 M 130 250 L 190 250";

    // 7. The Sharp (Aggressive Angles)
    const sharpR =
        "M 50 250 L 80 50 L 180 50 L 150 150 L 80 150 M 150 150 L 200 250";

    // 8. The Minimal (Single Stroke)
    const minimalR =
        "M 70 250 L 70 50 L 130 50 C 180 50 180 150 130 150 L 70 150 L 150 250";

    // 9. The Weird (Floating/Disconnected)
    const weirdR =
        "M 60 250 L 60 180 M 60 150 L 60 50 L 120 50 Q 160 50 160 100 Q 160 150 120 150 L 60 150 M 120 180 L 160 250";

    // 10. The Pixel (Stepped) - approximated with lines
    const pixelR =
        "M 50 250 L 80 250 L 80 50 L 140 50 L 140 80 L 170 80 L 170 110 L 140 110 L 140 140 L 80 140 M 110 140 L 110 170 L 140 170 L 140 200 L 170 200 L 170 250";

    const variants = [
        {
            name: "1. The Classic (Slow Bounce)",
            props: {
                path: classicR,
                numLayers: 10,
                layerSpread: 30,
                refractionSpeed: 0.02, // Very loose spring
                damping: 0.08, // Low damping for long oscillation
                rainbowSpeed: 0,
            },
        },
        {
            name: "2. The Bold (Heavy)",
            props: {
                path: boldR,
                numLayers: 10,
                layerSpread: 25,
                refractionSpeed: 0.03,
                damping: 0.1,
                rainbowSpeed: 0,
            },
        },
        {
            name: "3. The Playful (Bouncy)",
            props: {
                path: playfulR,
                numLayers: 10,
                layerSpread: 40,
                refractionSpeed: 0.05, // Slightly faster
                damping: 0.05, // Very bouncy
                rainbowSpeed: 0.02,
            },
        },
        {
            name: "4. The Italic (Fast)",
            props: {
                path: italicR,
                numLayers: 12,
                layerSpread: 35,
                refractionSpeed: 0.04,
                damping: 0.12,
                rainbowSpeed: 0,
            },
        },
        {
            name: "5. The Script (Flowing)",
            props: {
                path: scriptR,
                numLayers: 15,
                layerSpread: 50,
                refractionSpeed: 0.015, // Extremely slow/fluid
                damping: 0.15,
                rainbowSpeed: 0.01,
            },
        },
        {
            name: "6. The Slab (Sturdy)",
            props: {
                path: slabR,
                numLayers: 8,
                layerSpread: 20,
                refractionSpeed: 0.08, // Stiffer
                damping: 0.2,
                rainbowSpeed: 0,
            },
        },
        {
            name: "7. The Sharp (Edgy)",
            props: {
                path: sharpR,
                numLayers: 20,
                layerSpread: 60, // Wide spread
                refractionSpeed: 0.02,
                damping: 0.05,
                rainbowSpeed: 0,
            },
        },
        {
            name: "8. The Minimal (Clean)",
            props: {
                path: minimalR,
                numLayers: 6,
                layerSpread: 30,
                refractionSpeed: 0.03,
                damping: 0.1,
                rainbowSpeed: 0,
            },
        },
        {
            name: "9. The Weird (Glitchy)",
            props: {
                path: weirdR,
                numLayers: 12,
                layerSpread: 45,
                refractionSpeed: 0.1, // Jittery
                damping: 0.02, // Chaos
                rainbowSpeed: 0.05,
            },
        },
        {
            name: "10. The Pixel (Digital)",
            props: {
                path: pixelR,
                numLayers: 8,
                layerSpread: 25,
                refractionSpeed: 0.05,
                damping: 0.1,
                rainbowSpeed: 0,
            },
        },
    ];
</script>

<main>
    <h1>Choose Your Favorite R</h1>
    <p>Ambient motion, distinct shapes, and unique textures.</p>
    <div class="grid">
        {#each variants as variant}
            <div class="variant-card">
                <h2>{variant.name}</h2>
                <div class="letter-wrapper">
                    <LetterR {...variant.props} />
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
