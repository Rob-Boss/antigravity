<script lang="ts">
    import { T } from "@threlte/core";
    import * as THREE from "three";
    import type { Magnet } from "$lib/stores/magnetStore";
    import { magnetStore } from "$lib/stores/magnetStore";
    import { Vector3, Plane } from "three";
    import { onMount } from "svelte";

    export let magnet: Magnet;
    export let draggingId: string | null;
    export let onDragStart: (id: string) => void;
    export let onDragEnd: () => void;

    let isDragging = false;

    // Drag logic
    const plane = new Plane(new Vector3(0, 0, 1), -0.52);
    $: isDragging = draggingId === magnet.id;

    function handlePointerDown(e: any) {
        e.stopPropagation();
        onDragStart(magnet.id);
    }

    const { draggingMagnet } = magnetStore;
    let currentX = magnet.x;
    let currentY = magnet.y;
    let currentZ = magnet.z;

    $: if (isDragging && $draggingMagnet && $draggingMagnet.id === magnet.id) {
        currentX = $draggingMagnet.x;
        currentY = $draggingMagnet.y;
        currentZ = $draggingMagnet.z;
    } else {
        currentX = magnet.x;
        currentY = magnet.y;
        currentZ = magnet.z;
    }

    // --- OPTIMIZED CANVAS TEXTURE SOLUTION ---
    let canvas: HTMLCanvasElement;
    let texture: THREE.CanvasTexture | null = null;
    let mounted = false;

    onMount(() => {
        mounted = true;
    });

    const magnetWidth = 0.016 + magnet.word.length * 0.016;
    const magnetHeight = 0.048;
    const aspect = magnetWidth / magnetHeight;

    $: if (mounted && magnet.word && canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
            // High Resolution: 256px height, width based on aspect
            canvas.height = 256;
            canvas.width = Math.round(256 * aspect);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Background
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Text - Large and Bold
            ctx.fillStyle = "black";
            // Dynamically adjust font size to fill height (approx 75%)
            const fontSize = 180;
            ctx.font = `bold ${fontSize}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(magnet.word, canvas.width / 2, canvas.height / 2);

            if (!texture) {
                texture = new THREE.CanvasTexture(canvas);
                texture.colorSpace = THREE.SRGBColorSpace;
                texture.minFilter = THREE.LinearMipmapLinearFilter;
                texture.magFilter = THREE.LinearFilter;
                texture.generateMipmaps = true;
                texture.anisotropy = 4; // Sharpness at angles
            }
            texture.needsUpdate = true;
        }
    }
</script>

<!-- Hidden canvas -->
<canvas bind:this={canvas} style="display: none;"></canvas>

<T.Group
    position={[currentX, currentY, isDragging ? currentZ + 0.05 : currentZ]}
    rotation.z={magnet.rotation}
>
    <!-- Magnet Base -->
    <T.Mesh
        userData={{ isMagnet: true, id: magnet.id }}
        on:pointerdown={handlePointerDown}
    >
        <T.BoxGeometry args={[magnetWidth, magnetHeight, 0.01]} />
        <T.MeshStandardMaterial
            color="#ffffff"
            roughness={0.5}
            metalness={0.1}
        />
    </T.Mesh>

    <!-- Text Layer (Perfectly sized to magnet face) -->
    {#if texture}
        <T.Mesh position={[0, 0, 0.0051]}>
            <T.PlaneGeometry args={[magnetWidth, magnetHeight]} />
            <T.MeshBasicMaterial
                map={texture}
                transparent={false}
                toneMapped={false}
            />
        </T.Mesh>
    {/if}

    <!-- Shadow/Border Layer -->
    <T.Mesh position={[0, 0, -0.006]}>
        <T.BoxGeometry args={[magnetWidth * 1.05, magnetHeight * 1.1, 0.009]} />
        <T.MeshBasicMaterial color="#cccccc" />
    </T.Mesh>
</T.Group>
