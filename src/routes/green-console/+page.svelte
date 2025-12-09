<script lang="ts">
    import { Canvas } from "@threlte/core";
    import Scene from "./Scene.svelte";
    import ConsoleUI from "./ConsoleUI.svelte";
    import { onMount, tick } from "svelte";
    import * as htmlToImage from "html-to-image";
    import * as THREE from "three";

    let uiContainer: HTMLElement;
    let screenTexture: THREE.CanvasTexture | null = null;

    // Interactive State
    let messages: string[] = [
        "Welcome to the Guest Book.",
        "Type a message and press ENTER.",
    ];
    let inputValue = "";
    let isRasterizing = false;

    // Core Rasterization Function
    const updateTexture = async () => {
        if (!uiContainer || isRasterizing) return;
        isRasterizing = true;

        try {
            // Wait for Svelte DOM update
            await tick();

            const canvas = await htmlToImage.toCanvas(uiContainer, {
                width: 800,
                height: 600,
                backgroundColor: "#000000",
                skipAutoScale: true,
            });

            if (!screenTexture) {
                // First time initialization
                screenTexture = new THREE.CanvasTexture(canvas);
                screenTexture.colorSpace = THREE.SRGBColorSpace;
                screenTexture.minFilter = THREE.LinearFilter; // Better looking text
            } else {
                // Efficient update: just copy the new canvas data
                screenTexture.image = canvas;
                screenTexture.needsUpdate = true;
            }
        } catch (error) {
            console.error("Rasterization failed:", error);
        } finally {
            isRasterizing = false;
        }
    };

    // Input Handling
    const handleKeydown = (e: KeyboardEvent) => {
        // Ignore special keys (ctrl, alt, meta)
        if (e.ctrlKey || e.altKey || e.metaKey) return;

        if (e.key === "Enter") {
            if (inputValue.trim()) {
                messages = [...messages, inputValue];
                inputValue = "";
                updateTexture();
            }
        } else if (e.key === "Backspace") {
            inputValue = inputValue.slice(0, -1);
            updateTexture();
        } else if (e.key.length === 1) {
            // Regular character
            inputValue += e.key;
            updateTexture();
        }
    };

    onMount(async () => {
        window.addEventListener("keydown", handleKeydown);

        // Initial render after fonts load
        setTimeout(() => {
            updateTexture();
        }, 500);

        return () => {
            window.removeEventListener("keydown", handleKeydown);
        };
    });
</script>

<div class="container">
    <Canvas>
        <Scene {screenTexture} />
    </Canvas>
</div>

<!-- Off-screen container for texture generation -->
<!-- Z-index hack: visible but behind scene, to ensure capture -->
<div class="texture-source" bind:this={uiContainer}>
    <ConsoleUI {messages} {inputValue} />
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: #051a05; /* Deep green bg */
    }
    .container {
        width: 100vw;
        height: 100vh;
        position: relative;
        z-index: 10; /* Sit on top of the texture source */
        background-color: #051a05; /* Solid color to hide what's behind */
    }

    .texture-source {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1; /* Sit behind the container */
        opacity: 1;
        pointer-events: none;
        width: 800px;
        height: 600px;
    }
</style>
