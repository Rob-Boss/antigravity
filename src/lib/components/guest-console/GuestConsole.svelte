<script lang="ts">
    import { Canvas, useThrelte } from "@threlte/core";
    import Scene from "./Scene.svelte";
    import ConsoleUI from "./ConsoleUI.svelte";
    import { onMount, tick } from "svelte";
    import * as htmlToImage from "html-to-image";
    import * as THREE from "three";

    export let isActive = false;

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
    const MAX_MSG_LEN = 119;

    let nameDraft = "";
    let messageDraft = "";
    let activeField: "name" | "message" | null = "name"; // Default to name on load
    let selectionCount = 0; // Number of characters selected from the END

    // --- RASTERIZATION ---
    const updateScreen = async () => {
        if (!uiContainer || isRasterizing || !isActive) return;
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

        // --- SELECTION HIGHLIGHT ---
        if (activeField && selectionCount > 0) {
            ctx.fillStyle = "rgba(0, 100, 255, 0.4)";

            const currentText =
                activeField === "name" ? nameDraft : messageDraft;

            if (activeField === "name") {
                // Calculate Name Tail Highlight
                // Font is valueFont = "32px Arial"
                ctx.font = valueFont;
                const unselectedText = currentText.slice(
                    0,
                    currentText.length - selectionCount,
                );
                const selectedText = currentText.slice(
                    currentText.length - selectionCount,
                );
                const startX = 120 + ctx.measureText(unselectedText).width;
                const selWidth = ctx.measureText(selectedText).width;

                // Name Box Bounds: starts at 120, y=65 (baseline). Box H=70 (20-90)
                ctx.fillRect(startX, 25, selWidth, 60);
            }
            // Message highlighting is handled line-by-line in the text loop below
        }

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
        const maxLineWidth = 390;
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

        // Pre-calculate total length of rendered text (including spaces and cursor)
        let totalRenderedLength = 0;
        lines.forEach((l) => (totalRenderedLength += l.length));

        // Define Highlight Range (Global Indices)
        // Cursor (_) is at the very end if active. Selection is immediately before cursor.
        const cursorLen = msgActive ? 1 : 0;
        // Depending on split/join logic, totalRenderedLength might have slight drift from messageDraft.length + cursorLen
        // But since we select from END, we can rely on relative offset from end.
        const selEnd = totalRenderedLength - cursorLen;
        const selStart = selEnd - selectionCount;

        let charIdx = 0;

        lines.forEach((l, i) => {
            const lineStart = charIdx;
            const lineEnd = charIdx + l.length;
            const y = startY + i * lineHeight;

            // Highlight Intersection Logic
            // We want intersection of [lineStart, lineEnd) AND [selStart, selEnd)
            const overlapStart = Math.max(lineStart, selStart);
            const overlapEnd = Math.min(lineEnd, selEnd);

            if (overlapStart < overlapEnd) {
                // There is selection on this line
                const localStart = overlapStart - lineStart;
                const localEnd = overlapEnd - lineStart;

                const preText = l.substring(0, localStart);
                const selText = l.substring(localStart, localEnd);

                const xOffset = ctx.measureText(preText).width;
                const selWidth = ctx.measureText(selText).width;

                ctx.fillStyle = "rgba(0, 100, 255, 0.4)";
                // Rect: LeftX + xOffset, Y - Ascender?, Width, LineHeight
                // Y=140 is baseline approx? No, startY ~140.
                // Text is drawn at `y`. y is baseline.
                // Rect should start at y - fontSize (approx).
                // msgFont = 24px. lineHeight = 28.
                // Draw rect centered vertically on line?
                // y is baseline. y - 24 for top?
                ctx.fillRect(leftX + xOffset, y - 22, selWidth, 28);
            }

            // Draw Text
            ctx.fillStyle = textColor; // Reset color
            ctx.fillText(l, leftX, y);

            charIdx += l.length;
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
        if (!isActive) return;

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
            selectionCount = 0; // Reset
            if (nameDraft && messageDraft) submitEntry();
        } else {
            if (activeField === "name") activeField = "message";
            else activeField = "name";
            selectionCount = 0; // Reset
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
        activeField = "name"; // Auto-select name field after submit
        updateScreen();
        updateKeyboard();
    };

    const handleKeydown = (e: KeyboardEvent) => {
        if (!isActive) return;

        // Scroll Logic
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

        // --- SELECTION LOGIC (Tail Selection) ---
        if (activeField) {
            const text = activeField === "name" ? nameDraft : messageDraft;

            // Shift + Arrows (Select from End)
            if (e.shiftKey) {
                if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    selectionCount = Math.min(text.length, selectionCount + 1);
                    updateKeyboard();
                    return;
                }
                if (e.key === "ArrowRight") {
                    e.preventDefault();
                    selectionCount = Math.max(0, selectionCount - 1);
                    updateKeyboard();
                    return;
                }
            }

            // Select All (Cmd+A)
            if ((e.metaKey || e.ctrlKey) && e.key === "a") {
                e.preventDefault();
                selectionCount = text.length;
                updateKeyboard();
                return;
            }
        }

        if (e.ctrlKey || e.altKey || e.metaKey) {
            // Check for Paste (Cmd+V / Ctrl+V)
            if (e.key === "v" && activeField) {
                e.preventDefault();
                navigator.clipboard
                    .readText()
                    .then((clipText) => {
                        if (!clipText) return;

                        // Clean text (basic)
                        // limit length based on field
                        let text = clipText.replace(/\r?\n|\r/g, " "); // Flatten newlines? Or allow?
                        // Keyboard UI doesn't explicitly support newlines in rendering (it splits by space)
                        // So flatten to spaces is safer.

                        if (selectionCount > 0) deleteSelection();

                        if (activeField === "name") {
                            const remaining = MAX_NAME_LEN - nameDraft.length;
                            if (remaining > 0) {
                                nameDraft += text.slice(0, remaining);
                            }
                        } else if (activeField === "message") {
                            const remaining = MAX_MSG_LEN - messageDraft.length;
                            if (remaining > 0) {
                                messageDraft += text.slice(0, remaining);
                            }
                        }
                        updateKeyboard();
                    })
                    .catch((err) => {
                        console.error("Paste failed", err);
                    });
            }
            return;
        }

        // TAB Support
        if (e.key === "Tab") {
            e.preventDefault();
            if (activeField === "name") activeField = "message";
            else activeField = "name";
            selectionCount = 0; // Reset
            updateKeyboard();
            return;
        }

        if (!activeField) return;

        let changed = false;

        // Helper: Remove Selected Text
        const deleteSelection = () => {
            if (selectionCount === 0) return;
            if (activeField === "name")
                nameDraft = nameDraft.slice(0, -selectionCount);
            if (activeField === "message")
                messageDraft = messageDraft.slice(0, -selectionCount);
            selectionCount = 0;
        };

        if (e.key === "Enter") {
            if (activeField === "name") activeField = "message";
            else if (activeField === "message") submitEntry();
            selectionCount = 0;
            changed = true;
        } else if (e.key === "Backspace") {
            if (selectionCount > 0) {
                deleteSelection();
            } else {
                // Normal Backspace (delete last char)
                if (activeField === "name") nameDraft = nameDraft.slice(0, -1);
                if (activeField === "message")
                    messageDraft = messageDraft.slice(0, -1);
            }
            changed = true;
        } else if (e.key.length === 1) {
            // Typing replaces selection
            if (selectionCount > 0) deleteSelection();

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
        } else {
            // Other keys shouldn't necessarily reset selection unless navigation?
            // Actually unhandled keys should probably leave selection alone.
        }

        if (changed) updateKeyboard();
    };

    let isHovering = false; // Track hover state for scroll locking

    // --- DRAG TO SCROLL ---
    let isDraggingScroll = false;
    let lastDragY = 0;

    const startDrag = (e: MouseEvent) => {
        // Only start drag if interacting with 3D scene (hovering)
        if (!isHovering || !isActive) return;

        // Use basic button check (Left Click)
        if (e.button !== 0) return;

        isDraggingScroll = true;
        lastDragY = e.clientY;

        window.addEventListener("mousemove", onDrag);
        window.addEventListener("mouseup", endDrag);
    };

    const onDrag = (e: MouseEvent) => {
        if (!isDraggingScroll) return;

        const deltaY = e.clientY - lastDragY; // Drag DOWN to scroll DOWN (scrollbar logic)
        lastDragY = e.clientY;

        // Multiplier?
        const speed = 2.0;

        if (Math.abs(deltaY) > 0) {
            // Scroll Logic
            scrollOffset = Math.max(0, scrollOffset + deltaY * speed);
            updateScreen();
        }
    };

    const endDrag = () => {
        isDraggingScroll = false;
        window.removeEventListener("mousemove", onDrag);
        window.removeEventListener("mouseup", endDrag);
    };

    onMount(() => {
        window.addEventListener("keydown", handleKeydown);

        // Initial Paint
        setTimeout(() => {
            updateKeyboard();
            updateScreen();
        }, 800);

        const kbInterval = setInterval(() => {
            if (isActive) updateKeyboard();
        }, 1000);

        return () => {
            window.removeEventListener("keydown", handleKeydown);
            window.removeEventListener("mousemove", onDrag); // Cleanup safety
            window.removeEventListener("mouseup", endDrag);
            clearInterval(kbInterval);
        };
    });
</script>

<div
    class="container"
    role="presentation"
    on:mouseenter={() => (isHovering = true)}
    on:mouseleave={() => (isHovering = false)}
    on:mousedown={startDrag}
>
    <!-- Threlte Stage (Size handled by parent) -->
    <Canvas renderMode={isActive ? "always" : "manual"}>
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
            on:hover={(e) => (isHovering = e.detail)}
        />
    </Canvas>
</div>

<!-- LCOAL BURIAL SHIELD (Blocks render-source behind global background color) -->
<div class="burial-shield"></div>

<!-- OFFSCREEN RENDERING SOURCES (Z-HACK HIDDEN) -->
<div
    class="render-source"
    style="width: 800px; height: 600px; top: 0; left: 0;"
    bind:this={uiContainer}
>
    <ConsoleUI {entries} {scrollOffset} />
</div>

<style>
    .container {
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 20; /* High Foreground: Above static background (10) */
        background-color: transparent; /* Parent handles BG */
        padding-top: 10vh; /* Reserved space for Swardy logo */
        box-sizing: border-box;
    }
    .burial-shield {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: var(--module-grey);
        z-index: 10; /* Shield layer: Blocks render-source below it */
        pointer-events: none;
    }
    .render-source {
        position: fixed;
        top: 0;
        left: 0; /* Must be on-screen for some capture libs */
        width: 800px;
        height: 600px;
        background: #000;
        pointer-events: none;
        z-index: 5; /* Buried: Behind local shield (10) */
        opacity: 1; /* Fully opaque for capture */
    }
</style>
