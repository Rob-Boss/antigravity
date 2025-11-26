<script lang="ts">
    import LetterW from "$lib/components/LetterW.svelte";

    // Helper for segments
    const standardW = [
        { start: { x: 40, y: 50 }, end: { x: 70, y: 250 } },
        { start: { x: 70, y: 250 }, end: { x: 100, y: 100 } },
        { start: { x: 100, y: 100 }, end: { x: 130, y: 250 } },
        { start: { x: 130, y: 250 }, end: { x: 160, y: 50 } },
    ];

    const wideW = [
        { start: { x: 20, y: 50 }, end: { x: 60, y: 250 } },
        { start: { x: 60, y: 250 }, end: { x: 100, y: 120 } },
        { start: { x: 100, y: 120 }, end: { x: 140, y: 250 } },
        { start: { x: 140, y: 250 }, end: { x: 180, y: 50 } },
    ];

    const tallW = [
        { start: { x: 60, y: 20 }, end: { x: 80, y: 280 } },
        { start: { x: 80, y: 280 }, end: { x: 100, y: 150 } },
        { start: { x: 100, y: 150 }, end: { x: 120, y: 280 } },
        { start: { x: 120, y: 280 }, end: { x: 140, y: 20 } },
    ];

    const doubleW = [
        ...standardW,
        { start: { x: 50, y: 60 }, end: { x: 80, y: 260 } },
        { start: { x: 80, y: 260 }, end: { x: 110, y: 110 } },
        { start: { x: 110, y: 110 }, end: { x: 140, y: 260 } },
        { start: { x: 140, y: 260 }, end: { x: 170, y: 60 } },
    ];

    const zigZagW = [
        { start: { x: 40, y: 50 }, end: { x: 55, y: 150 } },
        { start: { x: 55, y: 150 }, end: { x: 70, y: 250 } },
        { start: { x: 70, y: 250 }, end: { x: 85, y: 175 } },
        { start: { x: 85, y: 175 }, end: { x: 100, y: 100 } },
        { start: { x: 100, y: 100 }, end: { x: 115, y: 175 } },
        { start: { x: 115, y: 175 }, end: { x: 130, y: 250 } },
        { start: { x: 130, y: 250 }, end: { x: 145, y: 150 } },
        { start: { x: 145, y: 150 }, end: { x: 160, y: 50 } },
    ];

    const variants = [
        {
            name: "1. Classic",
            props: {
                segments: standardW,
                tension: 0.1,
                damping: 0.9,
                strokeWidth: 6,
                color: "var(--text-secondary)",
                glowColor: "var(--accent-glow)",
                showGlow: true,
            },
        },
        {
            name: "2. Wide & Loose",
            props: {
                segments: wideW,
                tension: 0.05,
                damping: 0.95,
                strokeWidth: 8,
                color: "#f0ffce",
                glowColor: "#8ba59e",
                showGlow: false,
            },
        },
        {
            name: "3. Tall & Tight",
            props: {
                segments: tallW,
                tension: 0.3,
                damping: 0.85,
                strokeWidth: 3,
                color: "#ff00ff",
                glowColor: "#00ffff",
                showGlow: true,
            },
        },
        {
            name: "4. Double Vision",
            props: {
                segments: doubleW,
                tension: 0.1,
                damping: 0.9,
                strokeWidth: 2,
                color: "#ffd700",
                glowColor: "#ffffff",
                showGlow: true,
            },
        },
        {
            name: "5. ZigZag",
            props: {
                segments: zigZagW,
                tension: 0.15,
                damping: 0.92,
                strokeWidth: 4,
                color: "#ff6b6b",
                glowColor: "#ff0000",
                showGlow: true,
            },
        },
        {
            name: "6. Heavy Metal",
            props: {
                segments: standardW,
                tension: 0.02,
                damping: 0.98,
                strokeWidth: 12,
                color: "#555",
                glowColor: "#000",
                showGlow: false,
            },
        },
        {
            name: "7. Ghostly",
            props: {
                segments: wideW,
                tension: 0.08,
                damping: 0.9,
                strokeWidth: 1,
                color: "rgba(255,255,255,0.2)",
                glowColor: "#fff",
                showGlow: true,
            },
        },
        {
            name: "8. Neon Cyber",
            props: {
                segments: standardW,
                tension: 0.2,
                damping: 0.8,
                strokeWidth: 4,
                color: "#00ff00",
                glowColor: "#00ff00",
                showGlow: true,
            },
        },
        {
            name: "9. Minimalist",
            props: {
                segments: tallW,
                tension: 0.1,
                damping: 0.9,
                strokeWidth: 2,
                color: "#fff",
                glowColor: "transparent",
                showGlow: false,
            },
        },
        {
            name: "10. Chaos",
            props: {
                segments: [
                    { start: { x: 30, y: 30 }, end: { x: 170, y: 270 } },
                    { start: { x: 170, y: 30 }, end: { x: 30, y: 270 } },
                    { start: { x: 100, y: 20 }, end: { x: 100, y: 280 } },
                ],
                tension: 0.05,
                damping: 0.99,
                strokeWidth: 5,
                color: "#ff00ff",
                glowColor: "#ffff00",
                showGlow: true,
            },
        },
    ];
</script>

<main>
    <h1>Choose Your Favorite W</h1>
    <p>Mix and match shapes, tension, and styles.</p>
    <div class="grid">
        {#each variants as variant}
            <div class="variant-card">
                <h2>{variant.name}</h2>
                <div class="letter-wrapper">
                    <LetterW {...variant.props} />
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
