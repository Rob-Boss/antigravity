<script lang="ts">
    import { Canvas, T } from "@threlte/core";
    import { Environment, OrbitControls, useGltf } from "@threlte/extras";
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { spring } from "svelte/motion";
    import * as THREE from "three";
    import VendingMachineScene from "./VendingMachineScene.svelte";

    // interactivity(); // Handled in Scene component

    // --- Selection State ---
    let selection = $state("");
    let screenStatus = $state("CHOOSE");
    let statusText = $state("Initializing...");
    let gltfLoaded = $state(false);

    // --- Animation State ---
    const armY = spring(2, { stiffness: 0.1, damping: 0.8 });
    const doorRotation = spring(0, { stiffness: 0.1, damping: 0.8 });
    let doorGlow = $state(0);

    // --- Scene Setup ---
    let screenCanvas: HTMLCanvasElement;
    let screenTexture: THREE.CanvasTexture | null = $state(null);

    function updateScreenCanvas() {
        if (!screenCanvas) return;
        const ctx = screenCanvas.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, screenCanvas.width, screenCanvas.height);
        ctx.fillStyle = "#ffaa00";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#ffaa00";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const hasWestminster = document.fonts.check('10px "Westminster"');
        ctx.font = `bold 64px ${hasWestminster ? '"Westminster"' : '"Courier New", monospace'}`;

        const displayText = selection || screenStatus;
        ctx.fillText(
            displayText,
            screenCanvas.width / 2,
            screenCanvas.height / 2,
        );

        if (screenTexture) screenTexture.needsUpdate = true;
    }

    $effect(() => {
        if (browser && (selection || screenStatus || screenTexture)) {
            statusText = `Selection: ${selection || "None"} | Status: ${screenStatus}`;
            updateScreenCanvas();
        }
    });

    onMount(async () => {
        screenCanvas = document.createElement("canvas");
        screenCanvas.width = 512;
        screenCanvas.height = 256;
        screenTexture = new THREE.CanvasTexture(screenCanvas);
        screenTexture.colorSpace = THREE.SRGBColorSpace;

        try {
            await document.fonts.load('bold 64px "Westminster"');
        } catch (e) {
            console.log("Westminster font not yet available.");
        }

        updateScreenCanvas();
    });

    function handleKeyClick(key: string) {
        if (screenStatus === "VENDING") return;
        if (key === "clear") {
            selection = "";
            screenStatus = "CHOOSE";
            return;
        }
        if (/[A-D]/.test(key) && selection.length === 0) {
            selection = key;
        } else if (/[1-3]/.test(key) && selection.length === 1) {
            selection += key;
            triggerVending();
        }
    }

    async function triggerVending() {
        screenStatus = "VENDING";
        const rowIndex = selection.charCodeAt(0) - 65;
        const targetY = 2.5 - rowIndex * 0.7;
        await armY.set(targetY);

        setTimeout(async () => {
            await armY.set(0.5);
            doorRotation.set(Math.PI / 4);
            doorGlow = 2;
            setTimeout(() => {
                doorRotation.set(0);
                doorGlow = 0;
                screenStatus = "CHOOSE";
                selection = "";
                armY.set(2);
            }, 3000);
        }, 1000);
    }
</script>

<div class="canvas-container">
    <Canvas>
        <!-- Camera handled by VendingMachineScene from GLB -->

        <T.AmbientLight intensity={0.5} />
        <T.PointLight position={[5, 10, 5]} intensity={1.5} castShadow />

        <Environment
            url="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/snowy_park_01_1k-7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K.hdr"
        />

        <VendingMachineScene
            {selection}
            {screenStatus}
            {doorGlow}
            armY={$armY}
            doorRotation={$doorRotation}
            {screenTexture}
            onKeyClick={handleKeyClick}
            onGltfLoaded={() => (gltfLoaded = true)}
        />
    </Canvas>

    <div class="debug-overlay">
        <h2 style="color: #0f0; margin: 0;">V2 COMPONENT MOUNTED</h2>
        <p>STATUS: {statusText}</p>
        <p>GLB: {gltfLoaded ? "LOADED" : "WAITING"}</p>
    </div>
</div>

<style>
    .canvas-container {
        width: 100%;
        height: 100%;
        background-color: #111;
        position: relative;
        border: 2px solid red; /* Confirm bounds */
    }

    .debug-overlay {
        position: absolute;
        top: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.9);
        color: #0f0;
        padding: 15px;
        font-family: monospace;
        z-index: 1000;
        pointer-events: none;
        border: 1px solid #0f0;
    }
</style>
