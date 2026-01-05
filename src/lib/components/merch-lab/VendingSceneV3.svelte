<script lang="ts">
    import { T, useTask, useThrelte } from "@threlte/core";
    import {
        useGltf,
        Environment,
        ContactShadows,
        Float,
    } from "@threlte/extras";
    import * as THREE from "three";

    interface Props {
        selection?: string;
        screenStatus?: string;
        onKeyClick?: (key: string) => void;
        screenTexture?: THREE.CanvasTexture | null;
        armY?: number;
        doorGlow?: number;
        doorRotation?: number;
    }

    let {
        selection = "",
        screenStatus = "CHOOSE",
        onKeyClick = (key: string) => {},
        screenTexture = null,
        armY = 3.5,
        doorGlow = 0,
        doorRotation = 0,
    }: Props = $props();

    let hoveredKey = $state<string | null>(null);

    const { renderer, scene: threlteScene, camera } = useThrelte();

    // Finalized Lighting Settings
    const exposure = 1.3;
    const envIntensity = 1.0;
    const dirIntensity = 0.4;
    const ambIntensity = 0.4;

    // Sync Exposure and Env Intensity to Three.js
    $effect(() => {
        renderer.toneMappingExposure = exposure;
        threlteScene.environmentIntensity = envIntensity;
    });

    const gltfStore = useGltf("/vending_machine_3.glb");
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    // Track hovered mesh to restore material
    let hoveredMesh: THREE.Mesh | null = null;
    let originalMaterial: THREE.Material | THREE.Material[] | null = null;

    // --- MANUAL RAYCASTER SETUP ---

    // 1. Track Mouse Position
    const onPointerMove = (event: PointerEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        checkIntersection(false); // Check for hover
    };

    // 2. Handle Clicks
    const onClick = (event: MouseEvent) => {
        checkIntersection(true); // Check for click
    };

    // Helper to apply hover effect
    const applyHover = (mesh: THREE.Mesh, key: string) => {
        if (hoveredMesh === mesh) return; // Already hovering this one

        // Restore previous if exists
        clearHover();

        // Apply new
        hoveredMesh = mesh;
        hoveredKey = key;
        document.body.style.cursor = "pointer";

        if (mesh.material) {
            originalMaterial = mesh.material; // Keep ref to original
            // Clone and modify
            const newMat = (
                mesh.material as THREE.MeshStandardMaterial
            ).clone();
            newMat.emissive.set("lime");
            newMat.emissiveIntensity = 1.0;
            mesh.material = newMat;
        }
    };

    const clearHover = () => {
        if (hoveredMesh && originalMaterial) {
            hoveredMesh.material = originalMaterial;
        }
        hoveredMesh = null;
        originalMaterial = null;
        hoveredKey = null;
        document.body.style.cursor = "default";
    };

    // 3. Core Raycast Logic
    const checkIntersection = (isClick: boolean): string | null => {
        if (!camera.current || !$gltfStore) return null;

        raycaster.setFromCamera(pointer, camera.current);

        // Raycast against the entire GLTF scene
        const targetObjects: THREE.Object3D[] = [];
        targetObjects.push($gltfStore.scene);

        const intersects = raycaster.intersectObjects(targetObjects, true);

        // Iterate through ALL hits to find the first valid one
        for (const hit of intersects) {
            const name = hit.object.name;
            const lowerName = name.toLowerCase();

            // Logic to manually ignore things if needed
            // Currently letting everything be hit so we can see blockers in logs if they exist

            if (isClick) {
                // console.log("RAYCAST HIT:", name);
            }

            // BUTTON logic
            if (/^(Button[A-D1-3]|ButtonClear|[A-D][1-3])$/i.test(name)) {
                const key = name.replace(/^Button/i, "").toLowerCase();

                if (!isClick) {
                    applyHover(hit.object as THREE.Mesh, key);
                } else {
                    onKeyClick(key);
                }
                return key;
            }

            // If we hit chassis/text first, we stop (unless we want to punch through)
            // For now, let's stop on first hit to be standard physical raycasting
            break;
        }

        // If no button hit
        if (!isClick) {
            clearHover();
        }
        return null;
    };

    // Attach Listeners
    $effect(() => {
        const domElement = renderer.domElement;
        domElement.addEventListener("pointermove", onPointerMove);
        domElement.addEventListener("click", onClick);

        return () => {
            domElement.removeEventListener("pointermove", onPointerMove);
            domElement.removeEventListener("click", onClick);
        };
    });

    // Unified Model Processing
    $effect(() => {
        if ($gltfStore) {
            $gltfStore.scene.traverse((child) => {
                if (!(child as THREE.Mesh).isMesh) return;
                const mesh = child as THREE.Mesh;
                const lowerName = mesh.name.toLowerCase();

                mesh.visible = true;

                // 2. Shading Fix
                if (lowerName.includes("push") || lowerName.includes("door")) {
                    mesh.geometry.computeVertexNormals();
                    if (mesh.material && !Array.isArray(mesh.material)) {
                        (
                            mesh.material as THREE.MeshStandardMaterial
                        ).flatShading = false;
                        mesh.material.needsUpdate = true;
                    }
                }

                // 3. Material overrides (SCREEN)
                if (mesh.name === "SCREEN") {
                    if (mesh.material && !Array.isArray(mesh.material)) {
                        const mat = mesh.material as THREE.MeshStandardMaterial;
                        if (screenTexture) {
                            mat.map = screenTexture;
                            mat.emissiveMap = screenTexture;
                            mat.emissive = new THREE.Color(0x00ff00);
                            mat.emissiveIntensity = 1.0;
                            mat.toneMapped = false;
                            mat.needsUpdate = true;
                        }
                    }
                }

                // 4. Emissive (pushdoor)
                if (lowerName.includes("pushdoor")) {
                    if (mesh.material && !Array.isArray(mesh.material)) {
                        if (!mesh.userData.materialCloned) {
                            mesh.material = mesh.material.clone();
                            mesh.userData.materialCloned = true;
                        }
                        const mat = mesh.material as THREE.MeshStandardMaterial;
                        mat.emissive = new THREE.Color(0x00ff00);
                        mat.emissiveIntensity = doorGlow;
                        mat.needsUpdate = true;
                    }
                }
            });
        }
    });

    const CAM_POS: [number, number, number] = [-2.56, 1.68, 6.24];
    const CAM_ROT: [number, number, number] = [0.08, -0.41, 0.03];
</script>

<Environment url="/media/golden_gate_hills_1k.exr" />

<T.DirectionalLight position={[5, 10, 5]} intensity={dirIntensity} castShadow />
<T.AmbientLight intensity={ambIntensity} />

<Float floatIntensity={0.2} rotationIntensity={0.05} speed={2}>
    <T.PerspectiveCamera makeDefault position={CAM_POS} rotation={CAM_ROT} />
</Float>

{#if $gltfStore}
    <T is={$gltfStore.scene}>
        {#if $gltfStore.nodes.ARM}
            <T is={$gltfStore.nodes.ARM} position.y={armY} />
        {/if}

        {#if $gltfStore.nodes.pushdoor}
            <T is={$gltfStore.nodes.pushdoor} rotation.x={doorRotation} />
        {/if}
    </T>
{/if}

<ContactShadows
    y={-0.02}
    opacity={0.6}
    scale={15}
    blur={1.5}
    far={10}
    resolution={256}
    color="#000000"
/>
