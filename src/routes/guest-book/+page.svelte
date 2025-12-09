<script lang="ts">
    import { Canvas } from "@threlte/core";
    import Scene from "./Scene.svelte";
    import GuestBookUI from "./GuestBookUI.svelte";
    import { onMount, tick } from "svelte";
    import * as htmlToImage from "html-to-image";
    import * as THREE from "three";

    let uiContainer: HTMLElement;
    let screenTexture: THREE.CanvasTexture | null = null;

    onMount(async () => {
        // Wait for mounting
        await tick();

        // Give fonts/images a moment to load
        setTimeout(async () => {
            if (uiContainer) {
                try {
                    console.log("Attempting to rasterize UI...");
                    const canvas = await htmlToImage.toCanvas(uiContainer, {
                        width: 800,
                        height: 600,
                        backgroundColor: "#ff0000",
                        skipAutoScale: true,
                    });

                    console.log(
                        "Rasterization complete. Canvas size:",
                        canvas.width,
                        canvas.height,
                    );

                    screenTexture = new THREE.CanvasTexture(canvas);
                    screenTexture.colorSpace = THREE.SRGBColorSpace;
                    console.log("Texture created and assigned.");
                } catch (error) {
                    console.error("Failed to rasterize UI:", error);
                }
            }
        }, 500);
    });
</script>

<div class="container">
    <Canvas>
        <Scene {screenTexture} />
    </Canvas>
</div>

<!-- Off-screen container for rasterization -->
<div class="offscreen-ui" bind:this={uiContainer}>
    <div class="ui-wrapper">
        <GuestBookUI />
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: #1a1a1a;
    }
    .container {
        width: 100vw;
        height: 100vh;
    }

    .offscreen-ui {
        position: fixed;
        top: 0;
        left: 0;
        opacity: 0;
        pointer-events: none;
        z-index: -1000;
        /* Ensure valid dimensions for capture */
        width: 800px;
        height: 600px;
        background: #000;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .ui-wrapper {
        width: 100%;
        height: 100%;
        display: flex; /* Scale content to fit */
    }
</style>
