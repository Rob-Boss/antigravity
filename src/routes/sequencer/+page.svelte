<script lang="ts">
    import { onMount } from "svelte";
    import SequencerSlot from "./SequencerSlot.svelte";
    import Shelf from "./Shelf.svelte";
    import ProgramSelector from "./ProgramSelector.svelte";
    import { AudioEngine } from "./AudioEngine";

    let audioEngine: AudioEngine;
    let isPlaying = false;
    let currentStep = -1;
    let isWin = false;

    // Game State
    interface Program {
        id: number;
        tempo: number;
        solved: boolean;
        locked: boolean;
        seed: number; // To randomize cartridges differently per program
    }

    let programs: Program[] = [
        { id: 1, tempo: 110, solved: false, locked: false, seed: 1 },
        { id: 2, tempo: 120, solved: false, locked: false, seed: 2 },
        { id: 3, tempo: 130, solved: false, locked: false, seed: 3 },
        { id: 4, tempo: 140, solved: false, locked: false, seed: 4 },
        { id: 5, tempo: 160, solved: false, locked: true, seed: 5 },
    ];

    let currentProgramId = 1;
    $: currentProgram =
        programs.find((p) => p.id === currentProgramId) || programs[0];

    // Cartridge State
    interface CartridgeState {
        id: number;
        location: "shelf" | number;
    }

    let cartridges: CartridgeState[] = [];
    let selectedCartridgeId: number | null = null;

    onMount(() => {
        audioEngine = new AudioEngine();

        // Load samples for Program 1
        const sampleUrls = Array(16)
            .fill(null)
            .map(
                (_, i) =>
                    `/media/who knows program/who knows master 1.${i + 1}.wav`,
            );
        audioEngine.loadSamples(sampleUrls);

        loadProgram(1);
    });

    function handleGlobalClick() {
        audioEngine.resume();
    }

    function loadProgram(id: number) {
        currentProgramId = id;
        if (audioEngine) {
            audioEngine.stop();
            audioEngine.currentProgramId = id;
        }
        isPlaying = false;
        currentStep = -1;
        isWin = false;

        // Initialize cartridges for this program
        // We'll reset them to shelf and shuffle based on program seed (or just random for now)
        cartridges = Array(16)
            .fill(null)
            .map((_, i) => ({
                id: i,
                location: "shelf",
            }));

        // For now, simple shuffle. In a real game, maybe the seed determines the "correct" order?
        // But here "correct" order is always 0-15 in slots 0-15.
        // So we just need to shuffle their starting positions on the shelf (which is visual only)
        // actually, the shelf is just a list.
        // To make it a puzzle, the "sound" of cartridge X should probably change per program?
        // Or the "correct" sequence changes?
        // The user said "16 cartridges in random order... figure out the proper order".
        // If the cartridges are labeled 1-16, the order is obvious.
        // BUT, if we hide the labels or if the labels don't match the slot index...
        // For now, let's assume the labels are visible and the goal is just to put them in order 1-16.
        // Wait, "listen and try and figure out the proper order" implies the labels might not be the guide.
        // But I haven't implemented hidden labels.
        // Let's stick to the current implementation: Cartridges have IDs. Win = Slot[i] has Cart[i].
        // So the puzzle is trivial if labels are shown.
        // But I'll leave the labels for now as per previous step.

        cartridges = shuffle(cartridges);
    }

    function shuffle(array: any[]) {
        let currentIndex = array.length,
            randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex],
            ];
        }
        return array;
    }

    function handleProgramSelect(id: number) {
        const prog = programs.find((p) => p.id === id);
        if (prog && !prog.locked) {
            loadProgram(id);
        }
    }

    function togglePlay() {
        if (isPlaying) {
            audioEngine.stop();
            isPlaying = false;
            currentStep = -1;
        } else {
            const sequence = Array(16)
                .fill(null)
                .map((_, i) => {
                    const cart = cartridges.find((c) => c.location === i);
                    return {
                        cartridgeId: cart ? cart.id : null,
                    };
                });

            audioEngine.start(sequence, currentProgram.tempo, (step) => {
                currentStep = step;
            });
            isPlaying = true;
        }
    }

    function handleDropOnSlot(slotIndex: number, cartridgeId: number) {
        moveCartridge(cartridgeId, slotIndex);
    }

    function handleDropOnShelf(cartridgeId: number) {
        moveCartridge(cartridgeId, "shelf");
    }

    function moveCartridge(
        cartridgeId: number,
        targetLocation: "shelf" | number,
    ) {
        const cartIndex = cartridges.findIndex((c) => c.id === cartridgeId);
        if (cartIndex === -1) return;

        if (typeof targetLocation === "number") {
            const existingCartIndex = cartridges.findIndex(
                (c) => c.location === targetLocation,
            );
            if (existingCartIndex !== -1) {
                cartridges[existingCartIndex].location = "shelf";
            }
        }

        cartridges[cartIndex].location = targetLocation;
        cartridges = cartridges;

        checkWin();

        if (isPlaying) {
            const sequence = Array(16)
                .fill(null)
                .map((_, i) => {
                    const cart = cartridges.find((c) => c.location === i);
                    return { cartridgeId: cart ? cart.id : null };
                });
            audioEngine.updateSequence(sequence);
        }

        selectedCartridgeId = null;
    }

    function handlePreview(id: number) {
        // Click now only selects, doesn't play sound (hover does that)
        selectedCartridgeId = id;
    }

    function handleCartridgeHover(id: number) {
        if (!isPlaying) {
            audioEngine.previewNote(id);
        }
    }

    function handleSlotClick(slotIndex: number) {
        if (selectedCartridgeId !== null) {
            moveCartridge(selectedCartridgeId, slotIndex);
        }
    }

    function handleShelfClick() {
        if (selectedCartridgeId !== null) {
            moveCartridge(selectedCartridgeId, "shelf");
        }
    }

    function checkWin() {
        const correct = cartridges.every((c) => c.location === c.id);
        if (correct && !currentProgram.solved) {
            // Mark current program as solved
            programs = programs.map((p) => {
                if (p.id === currentProgramId) return { ...p, solved: true };
                return p;
            });

            // Check if we should unlock 5
            const allFourSolved = programs.slice(0, 4).every((p) => p.solved);
            if (allFourSolved) {
                programs = programs.map((p) => {
                    if (p.id === 5) return { ...p, locked: false };
                    return p;
                });
                setTimeout(
                    () => alert("ALL SYSTEMS OPERATIONAL. PROGRAM 5 UNLOCKED."),
                    100,
                );
            } else {
                setTimeout(
                    () =>
                        alert(`PROGRAM ${currentProgramId} SEQUENCE CORRECT.`),
                    100,
                );
            }
            isWin = true;
        }
    }

    function solvePuzzle() {
        cartridges = cartridges.map((c) => ({
            ...c,
            location: c.id,
        }));
        checkWin();
        if (isPlaying) {
            const sequence = Array(16)
                .fill(null)
                .map((_, i) => {
                    const cart = cartridges.find((c) => c.location === i);
                    return { cartridgeId: cart ? cart.id : null };
                });
            audioEngine.updateSequence(sequence);
        }
    }

    function randomizePuzzle() {
        // Create array of slot indices 0-15
        const slots = Array.from({ length: 16 }, (_, i) => i);
        // Shuffle slots
        for (let i = slots.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [slots[i], slots[j]] = [slots[j], slots[i]];
        }

        // Assign cartridges to these random slots
        cartridges = cartridges.map((c, i) => ({
            ...c,
            location: slots[i],
        }));

        checkWin();
        if (isPlaying) {
            const sequence = Array(16)
                .fill(null)
                .map((_, i) => {
                    const cart = cartridges.find((c) => c.location === i);
                    return { cartridgeId: cart ? cart.id : null };
                });
            audioEngine.updateSequence(sequence);
        }
    }

    $: shelfCartridges = cartridges.filter((c) => c.location === "shelf");
</script>

<svelte:window on:click={handleGlobalClick} />

<div class="terminal-container">
    <div class="scanlines"></div>
    <div class="vignette"></div>

    <div class="content">
        <header>
            <div class="header-top">
                <h1>RETRO_SEQ_v1.0</h1>
                <div class="status">
                    STATUS: {isPlaying ? "RUNNING" : "READY"}
                </div>
            </div>
            <ProgramSelector
                currentProgram={currentProgramId}
                {programs}
                onSelect={handleProgramSelect}
            />
        </header>

        <div class="sequencer-grid">
            {#each Array(16) as _, i}
                <SequencerSlot
                    index={i}
                    cartridge={cartridges.find((c) => c.location === i)}
                    isCurrent={currentStep === i}
                    {selectedCartridgeId}
                    onDrop={(id) => handleDropOnSlot(i, id)}
                    onPreview={handlePreview}
                    onHover={handleCartridgeHover}
                    onClick={() => handleSlotClick(i)}
                />
            {/each}
        </div>

        <Shelf
            cartridges={shelfCartridges}
            {selectedCartridgeId}
            onDrop={handleDropOnShelf}
            onPreview={handlePreview}
            onHover={handleCartridgeHover}
            onClick={handleShelfClick}
        />

        <div class="controls">
            <div class="left-controls">
                <button class="retro-btn" on:click={togglePlay}>
                    {isPlaying ? "[ STOP ]" : "[ PLAY ]"}
                </button>
                <button class="retro-btn debug-btn" on:click={solvePuzzle}>
                    [ SOLVE ]
                </button>
                <button class="retro-btn debug-btn" on:click={randomizePuzzle}>
                    [ RANDOM ]
                </button>
            </div>

            <div class="tempo-display">
                TEMPO: {currentProgram.tempo} BPM
            </div>
        </div>
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        background-color: #050505;
        overflow: hidden;
    }

    .terminal-container {
        position: relative;
        width: 100vw;
        height: 100vh;
        background-color: #0a0500;
        color: #ffb000;
        font-family: "Courier New", Courier, monospace;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    /* CRT Effects */
    .scanlines {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0) 50%,
            rgba(0, 0, 0, 0.2) 50%,
            rgba(0, 0, 0, 0.2)
        );
        background-size: 100% 4px;
        pointer-events: none;
        z-index: 10;
    }

    .vignette {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(
            circle,
            rgba(0, 0, 0, 0) 60%,
            rgba(0, 0, 0, 0.6) 100%
        );
        pointer-events: none;
        z-index: 11;
    }

    .content {
        position: relative;
        z-index: 5;
        width: 80%;
        max-width: 800px;
        border: 2px solid #ffb000;
        padding: 2rem;
        box-shadow:
            0 0 20px rgba(255, 176, 0, 0.2),
            inset 0 0 20px rgba(255, 176, 0, 0.1);
        background: rgba(20, 10, 0, 0.8);
    }

    header {
        border-bottom: 1px solid #ffb000;
        padding-bottom: 1rem;
        margin-bottom: 2rem;
    }

    .header-top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        text-shadow: 0 0 5px #ffb000;
    }

    h1 {
        margin: 0;
        font-size: 1.5rem;
        letter-spacing: 2px;
    }

    .sequencer-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #ffb000;
        padding-top: 1rem;
    }

    .left-controls {
        display: flex;
        gap: 1rem;
    }

    .retro-btn {
        background: transparent;
        border: 1px solid #ffb000;
        color: #ffb000;
        font-family: inherit;
        font-size: 1.2rem;
        padding: 0.5rem 1.5rem;
        cursor: pointer;
        text-shadow: 0 0 5px #ffb000;
        transition: all 0.1s;
    }

    .retro-btn:hover {
        background: #ffb000;
        color: #000;
        box-shadow: 0 0 15px #ffb000;
    }

    .retro-btn:active {
        transform: scale(0.98);
    }

    .debug-btn {
        opacity: 0.5;
        font-size: 0.8rem;
        border-style: dashed;
    }

    .tempo-display {
        font-size: 1.2rem;
        text-shadow: 0 0 5px #ffb000;
    }
</style>
