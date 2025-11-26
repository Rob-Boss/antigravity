<script lang="ts">
    import LetterS from "$lib/components/LetterS.svelte";
    import LetterW from "$lib/components/LetterW.svelte";
    import LetterA from "$lib/components/LetterA.svelte";
    import LetterR from "$lib/components/LetterR.svelte";
    import LetterD from "$lib/components/LetterD.svelte";
    import LetterY from "$lib/components/LetterY.svelte";

    let letters = [
        { id: "S", component: LetterS, x: 0, y: 0, scale: 1, zIndex: 1 },
        { id: "W", component: LetterW, x: 0, y: 0, scale: 1, zIndex: 1 },
        { id: "A", component: LetterA, x: 0, y: 0, scale: 1, zIndex: 1 },
        {
            id: "R",
            component: LetterR,
            x: 0,
            y: 0,
            scale: 1,
            zIndex: 1,
            props: {
                path: "M 50 250 L 80 50 L 180 50 L 150 150 L 80 150 M 150 150 L 200 250",
                numLayers: 20,
                layerSpread: 60,
                refractionSpeed: 0.02,
                damping: 0.05,
            },
        },
        {
            id: "D",
            component: LetterD,
            x: 0,
            y: 0,
            scale: 1,
            zIndex: 1,
            props: {
                path: "M 120 240 C 80 240, 60 210, 60 180 C 60 150, 80 120, 120 120 C 140 120, 150 130, 150 130 L 150 40 C 150 20, 170 10, 180 30 L 170 240 C 170 250, 160 260, 140 250 Z",
                holePath:
                    "M 120 210 C 140 210, 140 180, 140 160 C 140 140, 130 130, 120 130 C 100 130, 90 150, 90 180 C 90 200, 100 210, 120 210 Z",
                eyePosition: { x: 115, y: 170 },
                eyeScale: 0.7,
                squashFactor: 0.2,
                blurStrength: 0.7,
                blurColor: "#87ceeb",
            },
        },
        {
            id: "Y",
            component: LetterY,
            x: 0,
            y: 0,
            scale: 1,
            zIndex: 1,
            props: {
                shapeMode: "rounded",
                color: "#ffd700",
                secondaryColor: "#ffff00",
            },
        },
    ];

    function updateLetter(index: number, key: string, value: number) {
        letters[index][key] = value;
        letters = [...letters]; // Trigger reactivity
    }
</script>

<div class="arrange-container">
    <div class="canvas-area">
        <div class="center-marker"></div>
        {#each letters as letter, i}
            <div
                class="letter-wrapper"
                style="
                    transform: translate({letter.x}px, {letter.y}px) scale({letter.scale});
                    z-index: {letter.zIndex};
                "
            >
                <svelte:component
                    this={letter.component}
                    {...letter.props || {}}
                />
            </div>
        {/each}
    </div>

    <div class="controls">
        <h3>Arrangement Studio</h3>
        {#each letters as letter, i}
            <div class="control-group">
                <h4>{letter.id}</h4>
                <label>
                    X: {letter.x}
                    <input
                        type="range"
                        min="-500"
                        max="500"
                        bind:value={letter.x}
                    />
                </label>
                <label>
                    Y: {letter.y}
                    <input
                        type="range"
                        min="-500"
                        max="500"
                        bind:value={letter.y}
                    />
                </label>
                <label>
                    Scale: {letter.scale}
                    <input
                        type="range"
                        min="0.1"
                        max="3"
                        step="0.1"
                        bind:value={letter.scale}
                    />
                </label>
                <label>
                    Z: {letter.zIndex}
                    <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        bind:value={letter.zIndex}
                    />
                </label>
            </div>
        {/each}

        <div class="output">
            <h4>Config JSON</h4>
            <textarea readonly
                >{JSON.stringify(
                    letters.map((l) => ({
                        id: l.id,
                        x: l.x,
                        y: l.y,
                        scale: l.scale,
                        zIndex: l.zIndex,
                    })),
                    null,
                    2,
                )}</textarea
            >
        </div>
    </div>
</div>

<style>
    .arrange-container {
        display: flex;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
        background: #111;
        color: white;
        font-family: monospace;
    }

    .canvas-area {
        flex: 1;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        background-image: radial-gradient(#333 1px, transparent 1px);
        background-size: 20px 20px;
    }

    .center-marker {
        position: absolute;
        width: 20px;
        height: 20px;
        border: 1px solid red;
        border-radius: 50%;
        pointer-events: none;
        z-index: 100;
    }

    .letter-wrapper {
        position: absolute;
        /* Center the wrapper so transforms originate from center */
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .controls {
        width: 300px;
        background: #222;
        padding: 1rem;
        overflow-y: auto;
        border-left: 1px solid #444;
    }

    .control-group {
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #333;
    }

    h4 {
        margin: 0 0 0.5rem 0;
        color: #8ba59e;
    }

    label {
        display: flex;
        flex-direction: column;
        font-size: 0.8rem;
        margin-bottom: 0.5rem;
    }

    input {
        width: 100%;
    }

    .output textarea {
        width: 100%;
        height: 200px;
        background: #000;
        color: #0f0;
        border: 1px solid #333;
        font-family: monospace;
        font-size: 0.8rem;
    }
</style>
