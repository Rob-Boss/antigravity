<script lang="ts">
    import { Canvas } from "@threlte/core";
    import VendingSceneV3 from "./VendingSceneV3.svelte";
    import * as THREE from "three";
    import { onMount } from "svelte";

    onMount(() => {
        console.log("VendingMachineV3: Component Mounted");
    });

    // --- STATE ---
    let selection = $state("");
    let screenStatus = $state("CHOOSE");

    // Animation State
    let armY = $state(0); // default rest position (origin)
    let doorGlow = $state(0); // emissive intensity
    let doorRotation = $state(0); // door opening (radians)

    // Screen Canvas State
    let canvas: HTMLCanvasElement;
    let screenTexture = $state<THREE.CanvasTexture | null>(null);

    // --- SCREEN RENDERING ---
    $effect(() => {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, 512, 512);

        // Border
        ctx.strokeStyle = "lime";
        ctx.lineWidth = 10;
        ctx.strokeRect(20, 20, 472, 472);

        // Selection / Status Text
        ctx.fillStyle = "lime";
        ctx.font = "bold 80px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (screenStatus === "VENDING") {
            ctx.fillText("VENDING...", 256, 256);
        } else {
            ctx.fillText(selection || "CHOOSE", 256, 256);
        }

        // Texture Update
        if (!screenTexture) {
            screenTexture = new THREE.CanvasTexture(canvas);
            screenTexture.colorSpace = THREE.SRGBColorSpace;
            screenTexture.flipY = false; // Fix: User reported upside down with true
        } else {
            screenTexture.needsUpdate = true;
        }
    });

    // --- VENDING SEQUENCE ---
    const triggerVending = async () => {
        screenStatus = "VENDING";

        // 1. Arm moves up to pick position
        armY = 2.0;

        // 2. Door opens and glows
        setTimeout(() => {
            armY = 0.5; // drop position
            doorGlow = 2.0;
            doorRotation = -Math.PI / 4; // open door
        }, 1000);

        // 3. Reset
        setTimeout(() => {
            selection = "";
            screenStatus = "CHOOSE";
            armY = 0; // back direct to origin
            doorGlow = 0;
            doorRotation = 0;
        }, 5000);
    };

    // --- HANDLERS ---
    const handleKeyClick = (key: string) => {
        if (screenStatus === "VENDING") return;

        console.log("VendingMachine: Interaction with key:", key);

        if (key === "clear") {
            selection = "";
        } else if (selection.length < 2) {
            selection += key;
            if (selection.length === 2) {
                triggerVending();
            }
        }
    };
</script>

<div class="canvas-container">
    <Canvas toneMapping={THREE.ACESFilmicToneMapping} shadows>
        <VendingSceneV3
            {selection}
            {screenStatus}
            onKeyClick={handleKeyClick}
            {screenTexture}
            {armY}
            {doorGlow}
            {doorRotation}
        />
    </Canvas>

    <!-- Hidden Screen Canvas -->
    <canvas bind:this={canvas} width="512" height="512" style="display: none;"
    ></canvas>
</div>

<div class="overlay">
    <h2>Vending Machine V3</h2>
    <p>Selection: {selection || "--"}</p>
</div>

<style>
    .canvas-container {
        width: 100%;
        height: 100%;
        display: block;
    }

    .overlay {
        position: absolute;
        bottom: 40px;
        right: 40px;
        color: lime;
        font-family: monospace;
        background: rgba(0, 0, 0, 0.85);
        padding: 20px;
        pointer-events: none;
        border: 1px solid #333;
        border-radius: 8px;
        max-width: 250px;
        z-index: 10;
    }
</style>
