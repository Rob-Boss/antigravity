<script lang="ts">
    import { Canvas, useThrelte } from "@threlte/core";
    import Scene from "./Scene.svelte";
    import ConsoleUI from "./ConsoleUI.svelte";
    import { onMount, tick } from "svelte";
    import * as htmlToImage from "html-to-image";
    import * as THREE from "three";
    import SignalStatic from "$lib/components/visuals/SignalStatic.svelte";

    export let isActive = false;

    // Mobile detection
    let isMobile = false;
    let hiddenInput: HTMLInputElement;
    let isMobileKeyboardOpen = false;

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
    let activeField: "name" | "message" | null = "name";
    let selectionCount = 0;

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
        const canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = 200;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, 800, 200);

        const activeColor = "#ff6600";
        const inactiveColor = "#443300";
        const textColor = "#ff6600";

        // GUEST CONSOLE BAKED GLOW
        ctx.shadowBlur = 4;
        ctx.shadowColor = "#ff6600";
        const labelFont = "bold 20px Arial";
        const valueFont = "32px Arial";
        const msgFont = "24px Arial";

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

        const msgActive = activeField === "message";
        ctx.strokeStyle = msgActive ? activeColor : inactiveColor;
        ctx.lineWidth = msgActive ? 4 : 2;
        ctx.strokeRect(20, 110, 600, 70);

        if (activeField && selectionCount > 0) {
            ctx.fillStyle = "rgba(0, 100, 255, 0.4)";
            const currentText =
                activeField === "name" ? nameDraft : messageDraft;
            if (activeField === "name") {
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
                ctx.fillRect(startX, 25, selWidth, 60);
            }
        }

        ctx.fillStyle = textColor;
        ctx.font = labelFont;
        ctx.fillText("MESSAGE:", 35, 140);

        ctx.save();
        ctx.beginPath();
        ctx.rect(20, 110, 600, 70);
        ctx.clip();
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

        const totalHeight = lines.length * lineHeight;
        let startY = 140;
        if (totalHeight > 40) {
            startY = 170 - (lines.length - 1) * lineHeight;
        }

        let totalRenderedLength = 0;
        lines.forEach((l) => (totalRenderedLength += l.length));
        const cursorLen = msgActive ? 1 : 0;
        const selEnd = totalRenderedLength - cursorLen;
        const selStart = selEnd - selectionCount;
        let charIdx = 0;

        lines.forEach((l, i) => {
            const lineStart = charIdx;
            const lineEnd = charIdx + l.length;
            const y = startY + i * lineHeight;
            const overlapStart = Math.max(lineStart, selStart);
            const overlapEnd = Math.min(lineEnd, selEnd);
            if (overlapStart < overlapEnd) {
                const localStart = overlapStart - lineStart;
                const localEnd = overlapEnd - lineStart;
                const preText = l.substring(0, localStart);
                const selText = l.substring(localStart, localEnd);
                const xOffset = ctx.measureText(preText).width;
                const selWidth = ctx.measureText(selText).width;
                ctx.fillStyle = "rgba(0, 100, 255, 0.4)";
                ctx.fillRect(leftX + xOffset, y - 22, selWidth, 28);
            }
            ctx.fillStyle = textColor;
            ctx.fillText(l, leftX, y);
            charIdx += l.length;
        });

        ctx.restore();

        const canSubmit = nameDraft.length > 0 && messageDraft.length > 0;
        const btnColor = canSubmit ? "#00ff00" : "#004400";
        ctx.strokeStyle = btnColor;
        ctx.shadowColor = btnColor; // Match glow to button color
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
            keyboardTexture.wrapS = THREE.RepeatWrapping;
            keyboardTexture.wrapT = THREE.RepeatWrapping;
        } else {
            keyboardTexture.image = canvas;
            keyboardTexture.needsUpdate = true;
        }
    };

    let kbOffsetX = 0;
    let kbOffsetY = 0;
    let kbRepeatX = 1;
    let kbRepeatY = 1;
    let kbRotation = -1.57;
    let kbCenterX = 0.5;
    let kbCenterY = 0.5;

    const handleKeyboardClick = (e: CustomEvent) => {
        if (!isActive) return;
        const uv = e.detail;
        const texX = 1 - uv.y;
        if (texX > 0.8) {
            activeField = null;
            selectionCount = 0;
            if (nameDraft && messageDraft) submitEntry();
        } else {
            activeField = activeField === "name" ? "message" : "name";
            selectionCount = 0;
            syncHiddenInput();
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
        activeField = "name";
        updateScreen();
        updateKeyboard();
    };

    const handleKeydown = (e: KeyboardEvent) => {
        if (!isActive) return;
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

        if (activeField) {
            const text = activeField === "name" ? nameDraft : messageDraft;
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
            if ((e.metaKey || e.ctrlKey) && e.key === "a") {
                e.preventDefault();
                selectionCount = text.length;
                updateKeyboard();
                return;
            }
        }

        if (e.ctrlKey || e.altKey || e.metaKey) {
            if (e.key === "v" && activeField) {
                e.preventDefault();
                navigator.clipboard.readText().then((clipText) => {
                    if (!clipText) return;
                    let text = clipText.replace(/\r?\n|\r/g, " ");
                    if (selectionCount > 0) deleteSelection();
                    if (activeField === "name") {
                        const remaining = MAX_NAME_LEN - nameDraft.length;
                        if (remaining > 0)
                            nameDraft += text.slice(0, remaining);
                    } else if (activeField === "message") {
                        const remaining = MAX_MSG_LEN - messageDraft.length;
                        if (remaining > 0)
                            messageDraft += text.slice(0, remaining);
                    }
                    updateKeyboard();
                });
            }
            return;
        }

        if (e.key === "Tab") {
            e.preventDefault();
            activeField = activeField === "name" ? "message" : "name";
            selectionCount = 0;
            updateKeyboard();
            return;
        }

        if (!activeField) return;
        let changed = false;
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
            if (selectionCount > 0) deleteSelection();
            else {
                if (activeField === "name") nameDraft = nameDraft.slice(0, -1);
                if (activeField === "message")
                    messageDraft = messageDraft.slice(0, -1);
            }
            changed = true;
        } else if (e.key.length === 1) {
            if (selectionCount > 0) deleteSelection();
            if (activeField === "name" && nameDraft.length < MAX_NAME_LEN) {
                nameDraft += e.key;
                changed = true;
            }
            if (
                activeField === "message" &&
                messageDraft.length < MAX_MSG_LEN
            ) {
                messageDraft += e.key;
                changed = true;
            }
        }
        if (changed) updateKeyboard();
    };

    let isHovering = false;
    let isDraggingScroll = false;
    let lastDragY = 0;

    const startDrag = (e: MouseEvent) => {
        if (!isHovering || !isActive || e.button !== 0) return;
        isDraggingScroll = true;
        lastDragY = e.clientY;
        window.addEventListener("mousemove", onDrag);
        window.addEventListener("mouseup", endDrag);
    };

    const onDrag = (e: MouseEvent) => {
        if (!isDraggingScroll) return;
        const deltaY = e.clientY - lastDragY;
        lastDragY = e.clientY;
        scrollOffset = Math.max(0, scrollOffset + deltaY * 2.0);
        updateScreen();
    };

    const endDrag = () => {
        isDraggingScroll = false;
        window.removeEventListener("mousemove", onDrag);
        window.removeEventListener("mouseup", endDrag);
    };

    // Mobile input handler
    const handleMobileInput = (e: Event) => {
        if (!isActive || !activeField) return;
        const target = e.target as HTMLInputElement;
        const value = target.value;

        if (activeField === "name") {
            nameDraft = value.slice(0, MAX_NAME_LEN);
        } else if (activeField === "message") {
            messageDraft = value.slice(0, MAX_MSG_LEN);
        }
        updateKeyboard();
    };

    const handleMobileKeydown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (activeField === "name") {
                activeField = "message";
                syncHiddenInput();
            } else if (activeField === "message" && nameDraft && messageDraft) {
                submitEntry();
                syncHiddenInput();
            }
        }
    };

    const syncHiddenInput = () => {
        if (!hiddenInput) return;
        hiddenInput.value = activeField === "name" ? nameDraft : messageDraft;
    };

    const focusMobileInput = () => {
        if (!isMobile || !hiddenInput) return;
        syncHiddenInput();
        hiddenInput.focus();
    };

    onMount(() => {
        // Detect mobile/touch device
        isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;

        window.addEventListener("keydown", handleKeydown);
        setTimeout(() => {
            updateKeyboard();
            updateScreen();
        }, 800);
        const kbInterval = setInterval(() => {
            if (isActive) updateKeyboard();
        }, 1000);
        return () => {
            window.removeEventListener("keydown", handleKeydown);
            window.removeEventListener("mousemove", onDrag);
            window.removeEventListener("mouseup", endDrag);
            clearInterval(kbInterval);
        };
    });
</script>

<div
    class="container-wrapper"
    role="presentation"
    on:mouseenter={() => (isHovering = true)}
    on:mouseleave={() => (isHovering = false)}
    on:mousedown={startDrag}
    on:click={focusMobileInput}
>
    <!-- Hidden input for mobile keyboard -->
    {#if isMobile}
        <input
            bind:this={hiddenInput}
            type="text"
            class="hidden-mobile-input"
            on:input={handleMobileInput}
            on:keydown={handleMobileKeydown}
            on:focus={() => (isMobileKeyboardOpen = true)}
            on:blur={() => (isMobileKeyboardOpen = false)}
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
        />
    {/if}
    <!-- Threlte Stage (Size handled by parent) -->
    <div class="container" class:keyboard-open={isMobileKeyboardOpen}>
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

    <!-- LOCAL SANDWICH BREAD (Shield Static) -->
    <div class="shield-static">
        <SignalStatic
            resolution={1.0}
            blackPoint={0.3}
            whitePoint={0.49}
            speed={20.0}
        />
    </div>

    <!-- LOCAL BURIAL SHIELD -->
    <div class="burial-shield"></div>
</div>

<!-- OFFSCREEN RENDERING SOURCES -->
<div class="render-source" bind:this={uiContainer}>
    <ConsoleUI {entries} {scrollOffset} />
</div>

<style>
    .container-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
    }
    .container {
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 70;
        background-color: transparent;
        padding-top: 10vh;
        box-sizing: border-box;
        transition: transform 0.3s ease-out;
    }
    .container.keyboard-open {
        transform: translateY(-35vh);
    }
    .shield-static {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 60;
        pointer-events: none;
    }
    .burial-shield {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #000;
        z-index: 10;
        pointer-events: none;
    }
    .render-source {
        position: fixed;
        top: 0;
        left: 0;
        width: 800px;
        height: 600px;
        background: #000;
        pointer-events: none;
        z-index: 5;
        opacity: 1;
    }
    .hidden-mobile-input {
        position: absolute;
        top: -9999px;
        left: -9999px;
        opacity: 0;
        width: 1px;
        height: 1px;
        border: none;
        background: transparent;
    }
</style>
