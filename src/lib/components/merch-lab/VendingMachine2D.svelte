<script lang="ts">
    import { onMount, tick } from "svelte";
    import { playButtonBeep } from "$lib/audio/vendingSounds";

    // --- DATA ---
    const rows = ["A", "B", "C"];
    const cols = [1, 2, 3];

    type Item = {
        id: string;
        row: number;
        col: number;
        color: string; // Keep as fallback/glow
        image: string;
        shape: "square" | "circle" | "rect";
        status: "idle" | "elevator" | "dispensed" | "restocking";
    };

    // Image Path Helper
    const imgBase = "/media/Landing page sample merch pics";

    // Explicit Configuration
    const productMap: Record<
        string,
        { img: string; shape: "square" | "circle" | "rect"; color: string }
    > = {
        // ROW A (Accessories)
        A1: { img: "pins_square.jpg", shape: "circle", color: "#FFD700" },
        A2: { img: "multistick.jpg", shape: "rect", color: "#FF6b6b" },
        A3: {
            img: "close_shirt_square.jpg",
            shape: "square",
            color: "#4ecdc4",
        },

        // ROW B (Apparel)
        B1: { img: "ECU_Hoodie_web.jpg", shape: "rect", color: "#333" },
        B2: { img: "ECU_crew_web.jpg", shape: "rect", color: "#555" },
        B3: { img: "wall_hoodie_web.jpg", shape: "rect", color: "#777" },

        // ROW C (Music/Media)
        C1: { img: "sat_3.1.2 (1).jpg", shape: "circle", color: "#a8e6cf" },
        C2: { img: "osc_3.2.1 (1).jpg", shape: "circle", color: "#dcedc1" },
        C3: { img: "macro_square.jpg", shape: "square", color: "#fdcb6e" },
    };

    let items: Item[] = [];

    // Init Grid
    rows.forEach((r, ri) => {
        cols.forEach((c, ci) => {
            const id = `${r}${c}`;
            const conf = productMap[id] || {
                img: "",
                shape: "square",
                color: "#444",
            };

            items.push({
                id,
                row: ri,
                col: ci,
                color: conf.color,
                image: `${imgBase}/${conf.img}`,
                shape: conf.shape,
                status: "idle",
            });
        });
    });

    // --- STATE ---
    let inputBuffer = "";
    let displayMessage = "HELLO";
    let isDispensing = false;
    let isItemInBin = false;
    let isBinOpen = false;

    // Animation State (Idea #3: CSS Transition State)
    let elevatorY = 0;
    let itemDropY = 0;
    let isAnimating = false; // Toggles CSS class for smooth movement

    let elevatorEl: HTMLElement;

    // --- ACTIONS ---
    const handleKeypad = (val: string) => {
        if (isDispensing || isItemInBin) return; // Block input if busy or waiting for pickup
        playButtonBeep();

        if (inputBuffer.length >= 2) inputBuffer = "";

        const isLetter = "ABC".includes(val);
        const isNumber = "123".includes(val);

        if (inputBuffer.length === 0 && isLetter) {
            inputBuffer = val;
            displayMessage = val + "_";
        } else if (inputBuffer.length === 1) {
            if (isNumber) {
                inputBuffer += val;
                const code = inputBuffer;
                displayMessage = "VENDING";
                dispense(code);
            } else if (isLetter) {
                inputBuffer = val; // Correction
                displayMessage = val + "_";
            }
        }
    };

    const waitForTransition = async (
        element: HTMLElement,
        triggerFn: () => void,
    ) => {
        return new Promise<void>((resolve) => {
            const handler = (e: TransitionEvent) => {
                if (e.target === element && e.propertyName === "transform") {
                    element.removeEventListener("transitionend", handler);
                    resolve();
                }
            };
            element.addEventListener("transitionend", handler);
            triggerFn(); // Apply changes

            // Safety timeout
            setTimeout(() => {
                element.removeEventListener("transitionend", handler);
                resolve();
            }, 2000);
        });
    };

    const dispense = async (code: string) => {
        try {
            isDispensing = true;
            const index = items.findIndex((i) => i.id === code);

            if (index === -1) {
                displayMessage = "ERR";
                setTimeout(reset, 2000);
                return;
            }

            const item = items[index];
            const rowHeight = 85;
            const baseHeight = 95;
            const targetY = (2 - item.row) * rowHeight + baseHeight;

            // 1. Elevator Up
            isAnimating = true;
            await tick(); // Allow class to apply
            await waitForTransition(elevatorEl, () => {
                elevatorY = targetY;
                itemDropY = 0;
            });

            // 2. Item On
            items[index].status = "elevator";
            items = [...items];

            await new Promise((r) => setTimeout(r, 500)); // Mechanism clunk

            // 3. Elevator Down
            await waitForTransition(elevatorEl, () => {
                elevatorY = 0;
                itemDropY = targetY; // Item moves down with elevator
            });

            // 4. Drop to Bin
            items[index].status = "dispensed";
            items = [...items];

            // 5. Wait for Drop css animation
            await new Promise((r) => setTimeout(r, 600));

            isAnimating = false;
            isItemInBin = true;
            displayMessage = "PUSH";
        } catch (e) {
            console.error("Vending dispensing error:", e);
            displayMessage = "ERR";
            setTimeout(reset, 2000);
        }
    };

    const reset = async () => {
        inputBuffer = "";
        displayMessage = "HELLO";
        isDispensing = false;
        isItemInBin = false;

        // Removed unwanted sound playButtonBeep();

        isAnimating = false; // Instant reset of elevator vars
        elevatorY = 0;
        itemDropY = 0;

        // FADE IN EFFECT (Selective)
        // Only target items that are NOT idle (dispensed or stuck on elevator)
        const needsRestock = items.some((i) => i.status !== "idle");

        if (needsRestock) {
            // 1. Set moving items to 'restocking' (invisible), others stay 'idle'
            items = items.map((i) => ({
                ...i,
                status: i.status !== "idle" ? "restocking" : "idle",
            }));

            await tick();
            // 2. Wait a tick to ensure DOM updated to hidden state
            await new Promise((r) => setTimeout(r, 50));
        }

        // 3. Reset ALL to 'idle' (triggers fade in for restocking ones)
        items = items.map((i) => ({ ...i, status: "idle" }));

        isBinOpen = false;
    };

    const handleBinClick = () => {
        if (isItemInBin) {
            isBinOpen = true; // Flap opens
            playButtonBeep();
            setTimeout(() => {
                reset(); // Reset machine after taking item
            }, 1000);
        }
    };
</script>

<div class="scene">
    <!-- VENDING MACHINE CHASSIS -->
    <div class="machine">
        <!-- MAIN CABINET -->
        <div class="cabinet face-front">
            <!-- INNER VOID (BLACK) -->
            <div class="interior">
                <!-- SHELVES GRID -->
                <div class="grid">
                    {#each items as item}
                        <div
                            class="item-slot"
                            style="--r: {item.row}; --c: {item.col}"
                        >
                            <div class="coil"></div>
                            <!-- 
                                ITEM CUBE
                            -->
                            <div
                                class="item-cube {item.status}"
                                style="
                                    --color: {item.color}; 
                                    --img: url('{item.image}');
                                    --drop-y: {itemDropY}px;
                                "
                                class:on-elevator={item.status === "elevator"}
                                class:dispensed={item.status === "dispensed"}
                                class:restocking={item.status === "restocking"}
                                class:animating={isAnimating}
                            >
                                <div class="face front">
                                    <span class="label">{item.id}</span>
                                </div>
                                <div class="face back"></div>
                                <div class="face left"></div>
                                <div class="face right"></div>
                                <div class="face top"></div>
                                <div class="face bottom"></div>
                            </div>
                        </div>
                    {/each}
                </div>

                <!-- ELEVATOR MECHANISM -->
                <div class="elevator-track">
                    <!-- Moving Assembly -->
                    <div
                        class="elevator-assembly"
                        style="transform: translateY(-{elevatorY}px) translateZ(30px);"
                        class:animating={isAnimating}
                        bind:this={elevatorEl}
                    >
                        <div class="platform-surface"></div>
                    </div>
                </div>

                <!-- BIN -->
                <div class="bin-area">
                    <button
                        class="bin-flap"
                        class:active={isItemInBin}
                        class:open={isBinOpen}
                        on:click={handleBinClick}
                    >
                        <div class="push-plate">
                            <span class="push-text">PUSH</span>
                        </div>
                    </button>
                </div>
            </div>

            <!-- GLASS DOOR -->
            <div class="glass-door"></div>
        </div>

        <div class="cabinet face-right"></div>
        <div class="cabinet face-left"></div>
        <div class="cabinet face-top"></div>
        <div class="cabinet face-bottom"></div>
        <div class="cabinet face-back"></div>

        <!-- SIDE CONTROL PANEL (Attaches to right side) -->
        <div class="control-panel">
            <div class="screen">
                <span class="screen-text">{displayMessage}</span>
            </div>

            <div class="keypad">
                <div class="keypad-col">
                    {#each rows as r}
                        <button
                            on:click={() => handleKeypad(r)}
                            class:active={inputBuffer.includes(r)}>{r}</button
                        >
                    {/each}
                </div>
                <div class="keypad-col">
                    {#each cols as c}
                        <button
                            on:click={() => handleKeypad(String(c))}
                            class:active={inputBuffer.includes(String(c))}
                            >{c}</button
                        >
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    /* CSS 3D SCENE CONFIG */
    .scene {
        position: relative;
        transform-style: preserve-3d;
        transform: rotateY(-15deg); /* Slight angle to show depth */
    }

    .machine {
        position: relative;
        width: 300px;
        height: 500px;
        transform-style: preserve-3d;
    }

    /* CABINET FACES */
    .cabinet {
        position: absolute;
        background: #222;
        /* border removed */
    }

    .face-front {
        width: 300px;
        height: 500px;
        transform: translateZ(100px);
        background: linear-gradient(
            135deg,
            #1c3b2b 0%,
            var(--chassis-green) 40%,
            #8fbc8f 50%,
            /* Pale highlight */ var(--chassis-green) 60%,
            #1c3b2b 100%
        );
        display: flex;
        flex-direction: column;
        padding: 20px;
        box-sizing: border-box;
    }

    .face-back {
        width: 300px;
        height: 500px;
        transform: translateZ(-100px) rotateY(180deg);
        background: #4b4b4b;
    }

    .face-right {
        width: 200px;
        height: 500px;
        left: 50px;
        transform: rotateY(90deg) translateZ(150px);
        background: linear-gradient(
            135deg,
            #112211,
            #1c3b2b
        ); /* Deep shadow side */
    }

    .face-left {
        width: 200px;
        height: 500px;
        left: 50px;
        transform: rotateY(-90deg) translateZ(150px);
        background: linear-gradient(
            135deg,
            var(--chassis-green),
            #8fbc8f 30%,
            var(--chassis-green)
        ); /* Highlighted side */
    }

    .face-top {
        width: 300px;
        height: 200px;
        transform: rotateX(90deg) translateZ(100px);
        background: linear-gradient(
            to bottom,
            #8fbc8f,
            var(--chassis-green)
        ); /* Top shine */
    }

    .face-bottom {
        width: 300px;
        height: 200px;
        transform: rotateX(-90deg) translateZ(400px);
        background: #050505;
        box-shadow: 0 0 50px rgba(0, 0, 0, 0.8);
    }

    /* INTERIOR */
    .interior {
        flex: 1;
        background: #000; /* Back to Black */
        border-radius: 5px;
        box-shadow: inset 0 0 20px #000;
        position: relative;
        overflow: hidden;
        border: 2px solid #1a3326;
    }

    /* GLASS */
    .glass-door {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0) 40%,
            rgba(255, 255, 255, 0.05) 100%
        );
        border: 5px solid #1a3326;
        pointer-events: none;
        z-index: 10;
        box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.1);
    }

    /* GRID & ITEMS */
    .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr); /* 3 Cols */
        grid-template-rows: repeat(3, 1fr); /* 3 Rows */
        gap: 15px; /* More gap */
        padding: 20px;
        padding-right: 50px; /* Shift items left to make room for elevator */
        height: 70%;
    }

    .item-slot {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .coil {
        position: absolute;
        width: 40px;
        height: 40px;
        border: 2px solid #555;
        border-radius: 50%;
        transform: translateZ(-20px) rotateX(90deg);
        border-top-color: transparent;
    }

    .item-cube {
        width: 60px; /* Slightly larger */
        height: 60px;
        border-radius: 4px; /* Default square w/ rounded corners */
        display: flex;
        justify-content: center;
        align-items: center;

        /* Image Handling */
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        border: 2px solid rgba(255, 255, 255, 0.1);

        position: relative;
        z-index: 2;
        opacity: 1;
        transform: scale(1);

        /* Default Pop */
        transition:
            transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
            opacity 0.5s ease;
        transform-style: preserve-3d;
    }

    /* IDEA #3: CSS Transition Helper */
    .item-cube.animating {
        transition: transform 1.6s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Smooth slow move */
        will-change: transform;
    }

    .item-cube.restocking {
        opacity: 0;
        transform: scale(0.9);
        transition: none; /* Instant snap to start pos */
    }

    /* ITEM ANIMATIONS */
    .item-cube.on-elevator {
        z-index: 20;
        transform: translateZ(50px) translateY(var(--drop-y)); /* Follow elevator */
    }

    .item-cube.dispensed {
        opacity: 1; /* Stay visible */
        transform: translateY(350px) scale(0.8) rotateZ(10deg); /* Fall into bin */
        transition: transform 0.6s cubic-bezier(0.6, 0.04, 0.98, 0.335);
        z-index: 1; /* Behind bin flap */
    }

    .face {
        position: absolute;
        width: 60px;
        height: 60px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        backface-visibility: hidden;
    }

    .front {
        transform: translateZ(30px);
        background: #222;
        background-size: cover;
        background-image: var(--img);
    }
    .back {
        transform: rotateY(180deg) translateZ(30px);
        background: var(--color);
    }
    .left {
        transform: rotateY(-90deg) translateZ(30px);
        background: #333;
    }
    .right {
        transform: rotateY(90deg) translateZ(30px);
        background: #333;
    }
    .top {
        transform: rotateX(90deg) translateZ(30px);
        background: #444;
    }
    .bottom {
        transform: rotateX(-90deg) translateZ(30px);
        background: #444;
    }

    .label {
        background: rgba(0, 0, 0, 0.7);
        padding: 2px 4px;
        border-radius: 2px;
        font-size: 10px;
        color: #fff;
        margin-top: auto;
        margin-bottom: 2px;
    }

    /* ELEVATOR */
    .elevator-track {
        position: absolute;
        top: 20px;
        right: 15px; /* Rail on the right side of the void */
        bottom: 70px; /* Above bin */
        width: 30px;
        z-index: 5;
        pointer-events: none;
        transform-style: preserve-3d;
    }

    .elevator-assembly {
        position: absolute;
        bottom: 0; /* Starts at bottom */
        right: 0;
        width: 100%;
        height: 10px; /* Origin point */
        transform-style: preserve-3d;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        transition: none;
    }

    .elevator-assembly.animating {
        transition: transform 1.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        will-change: transform;
    }

    .arm-joint {
        background: #d00; /* Red joint */
        border: 1px solid #fff;
        width: 14px;
        height: 14px;
        box-shadow: 2px 2px 10px #000;
        margin-right: -4px;
    }

    .platform-surface {
        background: #ccc; /* Visible Silver Bar */
        width: 230px;
        height: 8px;
        flex-shrink: 0;
        border: 1px solid #fff;
        border-radius: 2px;
        /* Remove rotateX so it faces the camera directly as a bar */
        transform: translateZ(60px);
        transform-origin: bottom center;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.8);
    }

    /* BIN */
    .bin-area {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 50px;
        background: #050505;
        border-top: 1px solid #222;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden; /* Clip items that fall too far? */
        z-index: 20; /* In front of items */
    }

    .bin-flap {
        width: 80%;
        height: 35px;
        background: #111;
        border: 1px solid #1a3326;
        color: #333;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: inherit;
        font-weight: bold;
        font-size: 14px;
        transform-origin: top center; /* Hinge at top */
        transform: rotateX(0deg);
        box-shadow: inset 0 -5px 10px rgba(0, 0, 0, 0.8);
        transition: all 0.3s ease;
        cursor: default;
    }

    .bin-flap.active {
        color: #33ff33;
        border-color: #33ff33;
        box-shadow:
            0 0 10px rgba(51, 255, 51, 0.3),
            inset 0 0 5px rgba(51, 255, 51, 0.2);
        cursor: pointer;
        animation: pulseBin 1s infinite alternate;
    }

    .bin-flap.open {
        transform: rotateX(-60deg);
        background: #1a1a1a;
        box-shadow: inset 0 10px 20px rgba(0, 0, 0, 0.9);
    }

    .push-plate {
        width: 80%;
        height: 60%;
        background: #222;
        border: 1px inset #444;
        border-radius: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .push-text {
        color: #444;
        font-family: inherit;
        font-weight: 800;
        font-size: 14px;
        letter-spacing: 2px;
    }

    .bin-flap.active .push-text {
        color: #33ff33;
        text-shadow: 0 0 5px #33ff33;
    }

    @keyframes pulseBin {
        from {
            text-shadow:
                0 0 5px #33ff33,
                0 0 10px #33ff33;
            border-color: #33ff33;
        }
        to {
            text-shadow:
                0 0 10px #33ff33,
                0 0 20px #33ff33;
            border-color: #66ff66;
        }
    }

    /* CONTROL PANEL */
    .control-panel {
        position: absolute;
        right: -100px; /* Slightly wider panel */
        top: 40px;
        width: 90px;
        background: linear-gradient(
            135deg,
            #1c3b2b 0%,
            var(--chassis-green) 40%,
            #8fbc8f 50%,
            var(--chassis-green) 60%,
            #1c3b2b 100%
        );
        padding: 15px 10px;
        border: 2px solid #1a3326;
        border-radius: 4px;
        transform: translateZ(80px) rotateY(10deg);
        box-shadow: -10px 10px 20px rgba(0, 0, 0, 0.5);
        z-index: 50;
        display: flex;
        flex-direction: column;
        gap: 15px;
        align-items: center;
    }

    /* LED SCREEN */
    .screen {
        width: 100%;
        height: 30px;
        background: #000;
        border: 1px solid #333;
        border-radius: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: inset 0 0 5px rgba(255, 0, 0, 0.2);
    }

    .screen-text {
        font-family: "Courier New", monospace;
        color: #33ff33; /* Green LED */
        font-weight: bold;
        font-size: 12px;
        text-shadow:
            0 0 5px #33ff33,
            0 0 10px rgba(51, 255, 51, 0.8);
        letter-spacing: 1px;
    }

    /* REFACTORED KEYPAD */
    .keypad {
        display: grid;
        grid-template-columns: repeat(2, 1fr); /* 2 Columns: Letters, Numbers */
        gap: 8px;
        width: 100%;
    }

    .keypad-col {
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: center;
    }

    .keypad button {
        width: 32px;
        height: 32px;
        background: #e0e0e0; /* Off-white */
        border: none;
        border-radius: 2px; /* Square with slight round */
        color: #111;
        font-family: "Inter", sans-serif;
        font-weight: 800;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.1s;
        box-shadow: 0 3px 0 #999; /* 3D Clicky feel */
    }

    .keypad button:active,
    .keypad button.active {
        transform: translateY(3px); /* Push down */
        box-shadow: 0 0 0 #999;
        background: #ffaa00; /* Active Orange */
        color: #fff;
    }
</style>
