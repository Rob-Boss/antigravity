<script lang="ts">
    import { Canvas } from "@threlte/core";
    import VendingSceneV3 from "./VendingSceneV3.svelte";
    import * as THREE from "three";
    import { onMount } from "svelte";
    import gsap from "gsap";
    import {
        Pane,
        Slider,
        Folder,
        Binding,
        Monitor,
    } from "svelte-tweakpane-ui";

    // --- STATE ---
    let selection = $state("");
    let screenStatus = $state("CHOOSE");

    // Animation State
    let armY = $state(0.96); // Idle height
    let doorGlow = $state(0);
    let doorRotation = $state(0);

    // Calibration State (Internal)
    let cal = $state({
        y: 0.96,
        rot: 0,
        glow: 0,
        isCalibrating: false,
    });

    onMount(() => {
        console.log("VendingMachineV3: Component Mounted");
        // Apply idle height immediately
        armY = 0.96;
    });

    // When calibrating, sync cal values to animation state
    $effect(() => {
        if (cal.isCalibrating) {
            armY = cal.y;
            doorRotation = cal.rot;
            doorGlow = cal.glow;
        }
    });

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

        // Border (rounded to match screen shape)
        ctx.strokeStyle = "lime";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.roundRect(20, 20, 472, 472, 40);
        ctx.stroke();

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
    const triggerVending = () => {
        cal.isCalibrating = false;
        screenStatus = "VENDING";

        const row = selection.charAt(0).toLowerCase();
        const heights: Record<string, number> = {
            a: 2.78,
            b: 2.17,
            c: 1.57,
            d: 0.96,
        };
        const pickHeight = heights[row] || 2.78;
        const dropHeight = 0.96;

        const anim = {
            y: armY,
            rotation: 0, // skipping for now
            glow: 0,
        };

        const tl = gsap.timeline({
            onUpdate: () => {
                armY = anim.y;
                doorGlow = anim.glow;
                doorRotation = anim.rotation;
                // Sync HUD while calibrating/testing
                cal.y = anim.y;
                cal.glow = anim.glow;
            },
            onComplete: () => {
                selection = "";
                screenStatus = "CHOOSE";
                cal.isCalibrating = false;
            },
        });

        // 1. Arm moves to pick height
        tl.to(anim, {
            y: pickHeight,
            duration: 1.2,
            ease: "power2.inOut",
        });

        // 2. Pause at pick
        tl.to({}, { duration: 0.5 });

        // 3. Arm moves down to delivery slot (dropHeight)
        tl.to(anim, {
            y: dropHeight,
            duration: 1.5,
            ease: "power2.in",
        });

        // 4. Glow pulse
        tl.to(anim, {
            glow: 1.0,
            duration: 0.8,
            repeat: 5,
            yoyo: true,
            ease: "sine.inOut",
        });

        // 5. Reset Glow
        tl.to(anim, {
            glow: 0,
            duration: 0.5,
        });

        // 6. Manual Reset to Idle
        tl.add(() => {
            cal.isCalibrating = true;
        });
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

<!-- Calibration HUD (Toggle with cal.isCalibrating if needed, for now just keeping but adding a hide prop) -->
{#if cal.isCalibrating}
    <div
        style="position: fixed; top: 20px; right: 20px; z-index: 999999; width: 300px; pointer-events: auto !important; background: #000; border: 1px solid lime; border-radius: 8px; overflow: hidden;"
    >
        <Pane title="Vending Machine Calibrator" position="inline">
            <Folder title="Settings" expanded={true}>
                <Slider
                    label="Arm Y"
                    bind:value={cal.y}
                    min={-2}
                    max={6}
                    step={0.01}
                />
            </Folder>
            <Folder title="Debug" expanded={false}>
                <button
                    style="width: 100%; padding: 10px; background: #222; color: #666; cursor: pointer; border: 1px solid #444;"
                    onclick={() => (cal.isCalibrating = false)}
                >
                    HIDE HUD
                </button>
            </Folder>
        </Pane>
    </div>
{/if}

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
        display: none;
    }
</style>
