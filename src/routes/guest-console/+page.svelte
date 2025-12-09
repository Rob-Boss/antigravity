<script lang="ts">
    import { Canvas, useThrelte } from "@threlte/core";
    import Scene from "./Scene.svelte";
    import ConsoleUI from "./ConsoleUI.svelte";
    import KeyboardUI from "./KeyboardUI.svelte";
    import { onMount, tick } from "svelte";
    import * as htmlToImage from "html-to-image";
    import * as THREE from "three";

    // Containers
    let uiContainer: HTMLElement; // Main Screen
    let kbContainer: HTMLElement; // Keyboard Screen

    // Textures
    let screenTexture: THREE.CanvasTexture | null = null;
    let keyboardTexture: THREE.CanvasTexture | null = null;
    let isRasterizing = false;

    // --- STATE ---
    let entries = [
        {
            id: "1",
            date: "2025-12-01 14:20",
            name: "System",
            message: "Guest Book Online.",
        },
        {
            id: "2",
            date: "2025-12-05 09:15",
            name: "Rob",
            message: "First post! This thing is heavy.",
        },
        {
            id: "3",
            date: "2025-12-08 19:00",
            name: "Swardy",
            message: "Welcome to the void.",
        },
    ];
    let scrollOffset = 0;

    // --- FORM STATE ---
    const MAX_NAME_LEN = 15;
    const MAX_MSG_LEN = 100;

    let nameDraft = "";
    let messageDraft = "";
    let activeField: "name" | "message" | null = null;

    // --- RASTERIZATION ---
    const updateScreen = async () => {
        if (!uiContainer || isRasterizing) return;
        isRasterizing = true;

        try {
            await tick();
            const canvas = await htmlToImage.toCanvas(uiContainer, {
                width: 800,
                height: 600,
                backgroundColor: "#000000",
                skipAutoScale: true,
                fontEmbedCSS: document.head.querySelector("style")?.innerText,
            });

            if (!screenTexture) {
                screenTexture = new THREE.CanvasTexture(canvas);
                screenTexture.colorSpace = THREE.SRGBColorSpace;
                screenTexture.minFilter = THREE.LinearFilter;
            } else {
                screenTexture.image = canvas;
                screenTexture.needsUpdate = true;
            }
        } finally {
            isRasterizing = false;
        }
    };

    const updateKeyboard = async () => {
        // MANUAL CANVAS GENERATION (Custom Renderer)
        const canvas = document.createElement("canvas");
        canvas.width = 800; // High res for text
        canvas.height = 200;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // 1. Background (Shiny Black)
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, 800, 200);

        // CONFIG
        const activeColor = "#ff6600"; // Saturated Orange
        const inactiveColor = "#443300"; // Dim Orange
        const textColor = "#ff6600";
        const labelFont = "bold 20px Arial";
        const valueFont = "32px Arial";
        const msgFont = "24px Arial"; // Smaller for message

        // --- DRAW NAME FIELD (Top Half) ---
        // Box: x=20, y=20, w=400, h=70
        const nameActive = activeField === "name";
        ctx.strokeStyle = nameActive ? activeColor : inactiveColor;
        ctx.lineWidth = nameActive ? 4 : 2;
        ctx.strokeRect(20, 20, 400, 70);

        ctx.fillStyle = textColor;
        ctx.font = labelFont;
        ctx.textAlign = "left";
        ctx.fillText("NAME:", 35, 50);

        ctx.font = valueFont;
        ctx.fillText((nameDraft || "") + (nameActive ? "_" : ""), 120, 65);

        // --- DRAW MESSAGE FIELD (Bottom Half) ---
        // Box: x=20, y=110, w=600, h=70
        const msgActive = activeField === "message";
        ctx.strokeStyle = msgActive ? activeColor : inactiveColor;
        ctx.lineWidth = msgActive ? 4 : 2;
        ctx.strokeRect(20, 110, 600, 70);

        ctx.fillStyle = textColor;
        ctx.font = labelFont;
        ctx.fillText("MESSAGE:", 35, 140);

        // Text Wrapping & Scrolling
        ctx.save();
        ctx.beginPath();
        ctx.rect(20, 110, 600, 70);
        ctx.clip(); // Clip everything to the message box

        ctx.font = msgFont;
        const msgText = (messageDraft || "") + (msgActive ? "_" : "");
        const maxLineWidth = 450;
        const lineHeight = 28;
        const leftX = 150;

        const words = msgText.split(" ");
        let lines = [];
        let line = "";

        for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + " ";
            let metrics = ctx.measureText(testLine);
            if (metrics.width > maxLineWidth && n > 0) {
                lines.push(line);
                line = words[n] + " ";
            } else {
                line = testLine;
            }
        }
        lines.push(line);

        // Scroll Logic: If lines exceed height, push Y up
        const totalHeight = lines.length * lineHeight;
        const boxHeight = 70;
        let startY = 140; // Default baseline for first line

        if (totalHeight > 40) {
            // 40 is approx available height after padding
            // Shift up so the last line is visible at bottom
            // Targeted Y for last line = 110 + 70 - 10 = 170
            // Actual Y for last line = startY + (lines.length-1)*lineHeight
            // 170 = newStartY + ...
            // newStartY = 170 - (lines.length-1)*lineHeight
            startY = 170 - (lines.length - 1) * lineHeight;
        }

        lines.forEach((l, i) => {
            ctx.fillText(l, leftX, startY + i * lineHeight);
        });

        ctx.restore(); // Remove clipping

        // --- DRAW SUBMIT BUTTON (Right Side) ---
        // Box: x=650, y=20, w=130, h=160
        const canSubmit = nameDraft.length > 0 && messageDraft.length > 0;
        const submitActive = !activeField && canSubmit;

        const btnColor = canSubmit ? "#00ff00" : "#004400";

        ctx.strokeStyle = btnColor;
        ctx.lineWidth = 4;
        ctx.strokeRect(650, 20, 130, 160);

        ctx.fillStyle = btnColor;
        ctx.font = "bold 28px Arial";
        ctx.textAlign = "center";
        ctx.fillText("SUBMIT", 715, 110);

        if (!keyboardTexture) {
            keyboardTexture = new THREE.CanvasTexture(canvas);
            keyboardTexture.colorSpace = THREE.SRGBColorSpace;
            keyboardTexture.minFilter = THREE.LinearFilter;
            // Ensure wrapping is persistent for tuning
            keyboardTexture.wrapS = THREE.RepeatWrapping;
            keyboardTexture.wrapT = THREE.RepeatWrapping;
        } else {
            keyboardTexture.image = canvas;
            keyboardTexture.needsUpdate = true;
        }
    };

    // --- TUNING ---
    // (Sliders removed per user request)

    let kbOffsetX = 0;
    let kbOffsetY = 0;
    let kbRepeatX = 1;
    let kbRepeatY = 1;
    let kbRotation = -1.57;
    let kbCenterX = 0.5;
    let kbCenterY = 0.5;

    // --- INPUT ---
    const handleKeyboardClick = (e: CustomEvent) => {
        const uv = e.detail; // THREE.Vector2

        // Transform Mesh UVs to Texture UVs (because Texture is rotated -90deg)
        // Inverse Rotation (+90deg) to map back to texture space
        const texX = 1 - uv.y;
        // const texY = uv.x; // Unused for now, but valid

        // Interaction Zones:
        // Left 80% (0.8) -> Toggle Field
        // Right 20% (> 0.8) -> Submit

        if (texX > 0.8) {
            activeField = null;
            if (nameDraft && messageDraft) submitEntry();
        } else {
            if (activeField === "name") activeField = "message";
            else activeField = "name";
        }
        updateKeyboard();
    };

    const submitEntry = () => {
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 16).replace("T", " ");
        entries = [
            ...entries,
            {
                id: Date.now().toString(),
                date: dateStr,
                name: nameDraft,
                message: messageDraft,
            },
        ];
        nameDraft = "";
        messageDraft = "";
        activeField = null;
        updateScreen();
        updateKeyboard();
    };

    const handleKeydown = (e: KeyboardEvent) => {
        // Scroll Logic overrides typing if CTRL is held or just Arrows?
        // Let's allowarrows for scroll always for now
        if (e.key === "ArrowUp") {
            scrollOffset += 30;
            e.preventDefault();
            updateScreen();
            return;
        }
        if (e.key === "ArrowDown") {
            scrollOffset = Math.max(0, scrollOffset - 30);
            e.preventDefault();
            updateScreen();
            return;
        }

        if (e.ctrlKey || e.altKey || e.metaKey) return;

        // TAB Support
        if (e.key === "Tab") {
            e.preventDefault();
            if (activeField === "name") activeField = "message";
            else activeField = "name";
            updateKeyboard();
            return;
        }

        if (!activeField) {
            // If typing without selection, default to Name?
            // Or maybe just ignore?
            // Let's enforce selection first by click or Tab
            // Actually, if user hits a letter, maybe just start the first field?
            // For now, respect explicit selection.
            return;
        }

        let changed = false;
        if (e.key === "Enter") {
            // If Name, jump to message?
            if (activeField === "name") activeField = "message";
            else if (activeField === "message") submitEntry();
            changed = true;
        } else if (e.key === "Backspace") {
            if (activeField === "name") nameDraft = nameDraft.slice(0, -1);
            if (activeField === "message")
                messageDraft = messageDraft.slice(0, -1);
            changed = true;
        } else if (e.key.length === 1) {
            // Enforce Limits
            if (activeField === "name") {
                if (nameDraft.length < MAX_NAME_LEN) {
                    nameDraft += e.key;
                    changed = true;
                }
            }
            if (activeField === "message") {
                if (messageDraft.length < MAX_MSG_LEN) {
                    messageDraft += e.key;
                    changed = true;
                }
            }
        }

        if (changed) updateKeyboard();
    };

    const handleWheel = (e: WheelEvent) => {
        // Scroll Logic for Mouse Wheel
        // Use deltaY directly to respect user's system scrolling preference (Natural vs Standard)
        // deltaY > 0 (Scroll Down) -> Reduce Offset -> Move content UP (towards recent)
        // deltaY < 0 (Scroll Up) -> Increase Offset -> Move content DOWN (towards history)
        // USER REQUESTED INVERSION: Using '+' instead of '-'
        scrollOffset = Math.max(0, scrollOffset + e.deltaY);
        updateScreen();
    };

    onMount(() => {
        window.addEventListener("keydown", handleKeydown);
        window.addEventListener("wheel", handleWheel); // Capture scroll everywhere

        // Initial Paint
        setTimeout(() => {
            updateKeyboard();
            updateScreen();
        }, 800);

        const kbInterval = setInterval(updateKeyboard, 1000);

        return () => {
            window.removeEventListener("keydown", handleKeydown);
            window.removeEventListener("wheel", handleWheel);
            clearInterval(kbInterval);
        };
    });
</script>

<div class="container">
    <Canvas>
        <Scene
            {screenTexture}
            {keyboardTexture}
            {kbOffsetX}
            {kbOffsetY}
            {kbRepeatX}
            {kbRepeatY}
            {kbRotation}
            {kbCenterX}
            {kbCenterY}
            on:keyboardClick={handleKeyboardClick}
        />
    </Canvas>
</div>

<!-- OFFSCREEN RENDERING SOURCES (Z-HACK HIDDEN) -->
<div
    class="render-source"
    style="width: 800px; height: 600px; top: 0; left: 0; z-index: 1;"
    bind:this={uiContainer}
>
    <ConsoleUI {entries} {scrollOffset} />
</div>

<!-- KEYBOARD UI REMOVED - using Manual Canvas Renderer in updateKeyboard() -->
<!-- <div class="render-source" bind:this={kbContainer}>...</div> -->

<!-- DEBUG CONTROLS REMOVED -->

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: #051a05;
    }
    .container {
        width: 100vw;
        height: 100vh;
        position: relative;
        z-index: 10;
        background-color: #051a05;
    }
    .render-source {
        position: fixed;
        background: #000; /* Ensure background is opaque for capture */
        pointer-events: none;
        /* Border removed for final look */
    }
    /* Debug controls style removed */
</style>
