<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import SequencerSlot from "../../routes/sequencer/SequencerSlot.svelte";
    import Shelf from "../../routes/sequencer/Shelf.svelte";
    import ProgramSelector from "../../routes/sequencer/ProgramSelector.svelte";
    import { AudioEngine } from "../../routes/sequencer/AudioEngine";

    let audioEngine: AudioEngine;
    let isPlaying = false;
    let currentStep = -1;
    let currentDuration = 0;
    let isWin = false;
    let statusMessage = "";
    let isSolving = false;

    export let isActive = true;

    $: if (!isActive && isPlaying) {
        togglePlay(); // Stop if active becomes false
    }

    const ICONS = [
        "█▀",
        "▓▒",
        "░█",
        "▄▀",
        "■□",
        "▪▫",
        "╔╗",
        "╚╝",
        "▐▌",
        "◢◣",
        "◤◥",
        "▞▚",
        "▖▗",
        "▘▝",
        "═║",
        "╬╪",
    ];

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
        icon: string;
    }

    let cartridges: CartridgeState[] = [];
    let selectedCartridgeId: number | null = null;

    let scale = 1;
    let contentHeight = 0;
    let contentWidth = 0;
    let container: HTMLElement;

    function updateScale() {
        if (
            typeof window !== "undefined" &&
            contentHeight &&
            contentWidth &&
            container
        ) {
            // Scale based on container size instead of window
            const containerRect = container.getBoundingClientRect();
            const hScale = containerRect.height / (contentHeight + 40);
            const wScale = containerRect.width / (contentWidth + 40);
            scale = Math.min(hScale, wScale, 1);
        }
    }

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

        // Use ResizeObserver for container resizing
        const resizeObserver = new ResizeObserver(() => {
            updateScale();
        });

        if (container) {
            resizeObserver.observe(container);
        }

        window.addEventListener("resize", updateScale);

        // Initial scale update
        updateScale();

        return () => {
            window.removeEventListener("resize", updateScale);
            resizeObserver.disconnect();
            if (audioEngine) {
                audioEngine.stop();
            }
        };
    });

    $: if (contentHeight || contentWidth) {
        updateScale();
    }

    function handleGlobalClick() {
        if (audioEngine) audioEngine.resume();
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
        statusMessage = "";

        // Shuffle icons for this program
        // We use a simple shuffle here, but ideally we'd use the seed
        const shuffledIcons = shuffle([...ICONS]);

        // Initialize cartridges for this program
        cartridges = Array(16)
            .fill(null)
            .map((_, i) => ({
                id: i,
                location: "shelf",
                icon: shuffledIcons[i],
            }));

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

            audioEngine.start(
                sequence,
                currentProgram.tempo,
                (step, duration) => {
                    currentStep = step;
                    currentDuration = duration;
                },
            );
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
        if (!isPlaying && !isSolving) {
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
                statusMessage = "ALL SYSTEMS OPERATIONAL. PROGRAM 5 UNLOCKED.";
            } else {
                statusMessage = `PROGRAM ${currentProgramId} SEQUENCE CORRECT.`;
            }
            isWin = true;

            setTimeout(() => {
                statusMessage = "";
            }, 3000);
        }
    }

    function solvePuzzle() {
        isSolving = true;
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
        setTimeout(() => {
            isSolving = false;
        }, 500);
    }

    function randomizePuzzle() {
        isSolving = true;
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
            icon: c.icon, // Keep icon
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
        setTimeout(() => {
            isSolving = false;
        }, 500);
    }

    $: shelfCartridges = cartridges.filter((c) => c.location === "shelf");
</script>

<svelte:window on:click={handleGlobalClick} />

<div class="terminal-container" bind:this={container}>
    <div class="scaled-wrapper" style="transform: scale({scale})">
        <div
            class="content"
            bind:clientHeight={contentHeight}
            bind:clientWidth={contentWidth}
        >
            <div class="screen-area">
                <div class="scanlines"></div>
                <div class="vignette"></div>
                <header>
                    <div class="header-top">
                        <h1>RETRO_SEQ_v1.0</h1>
                        <div class="status">
                            {#if statusMessage}
                                <span class="flash">{statusMessage}</span>
                            {:else}
                                STATUS: {isPlaying ? "RUNNING" : "READY"}
                            {/if}
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
                            duration={currentStep === i ? currentDuration : 0}
                            {selectedCartridgeId}
                            onDrop={(id) => handleDropOnSlot(i, id)}
                            onPreview={handlePreview}
                            onHover={handleCartridgeHover}
                            onClick={() => handleSlotClick(i)}
                        />
                    {/each}
                </div>
            </div>

            <Shelf
                {cartridges}
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
                    <button
                        class="retro-btn debug-btn"
                        on:click={randomizePuzzle}
                    >
                        [ RANDOM ]
                    </button>
                </div>

                <div class="tempo-display">
                    TEMPO: {currentProgram.tempo} BPM
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .terminal-container {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: #0a0500;
        color: #ffb000;
        font-family: "Courier New", Courier, monospace;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .scaled-wrapper {
        transform-origin: center center;
        transition: transform 0.1s;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    /* CRT Effects */
    .content {
        position: relative;
        z-index: 5;
        width: 90%;
        max-width: 800px;
        background: #1a1a1a;
        border-radius: 8px;
        padding: 1.25rem;
        box-shadow:
            0 20px 50px rgba(0, 0, 0, 0.8),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        border: 1px solid #000;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    /* The "Screen" area */
    .screen-area {
        background: #0a0500;
        border-radius: 3px;
        border: 2px solid #000;
        box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
        padding: 1rem;
        position: relative;
        overflow: hidden;
    }

    /* Move CRT effects into the screen area */
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
        opacity: 0.5;
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

    header {
        border-bottom: 1px solid #332200;
        padding-bottom: 0.75rem;
        margin-bottom: 0.75rem;
    }

    .header-top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.75rem;
        text-shadow: 0 0 5px #ffb000;
    }

    h1 {
        margin: 0;
        font-size: 1.1rem;
        letter-spacing: 1.5px;
        color: #ffb000;
    }

    .sequencer-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.65rem;
        margin-bottom: 1.25rem;
        padding: 0.75rem;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 3px;
        border: 1px solid #332200;
    }

    .controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 0.75rem;
        background: #222;
        padding: 0.75rem;
        border-radius: 3px;
        border-top: 1px solid #333;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }

    .left-controls {
        display: flex;
        gap: 0.65rem;
    }

    .retro-btn {
        background: linear-gradient(to bottom, #333, #222);
        border: 1px solid #000;
        color: #aaa;
        font-family: inherit;
        font-size: 0.85rem;
        padding: 0.45rem 0.9rem;
        cursor: pointer;
        border-radius: 3px;
        box-shadow:
            0 3px 0 #000,
            0 4px 4px rgba(0, 0, 0, 0.5);
        transition: all 0.1s;
        text-transform: uppercase;
        font-weight: bold;
        letter-spacing: 0.75px;
        white-space: nowrap;
    }

    .retro-btn:hover {
        background: linear-gradient(to bottom, #444, #333);
        color: #fff;
    }

    .retro-btn:active {
        transform: translateY(3px);
        box-shadow:
            0 0 0 #000,
            inset 0 2px 4px rgba(0, 0, 0, 0.5);
    }

    .debug-btn {
        background: linear-gradient(to bottom, #2a2a2a, #1a1a1a);
        font-size: 0.7rem;
        padding: 0.45rem 0.75rem;
    }

    .tempo-display {
        font-size: 1rem;
        color: #ffb000;
        text-shadow: 0 0 5px #ffb000;
        font-family: "Courier New", Courier, monospace;
        background: #000;
        padding: 0.4rem 0.75rem;
        border-radius: 3px;
        border: 1px solid #333;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5);
    }

    .flash {
        animation: flash 0.5s infinite alternate;
        color: #fff;
        text-shadow: 0 0 10px #fff;
    }

    @keyframes flash {
        from {
            opacity: 1;
        }
        to {
            opacity: 0.5;
        }
    }
</style>
