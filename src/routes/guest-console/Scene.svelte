<script lang="ts">
    import { T, useThrelte } from "@threlte/core";
    import {
        ContactShadows,
        Float,
        OrbitControls,
        useGltf,
    } from "@threlte/extras";
    import * as THREE from "three";
    import { createEventDispatcher, onMount } from "svelte";

    export let screenTexture: THREE.CanvasTexture | null = null;
    export let keyboardTexture: THREE.CanvasTexture | null = null;

    // Tuning Props (Primitives for Reactivity)
    export let kbOffsetX = 0;
    export let kbOffsetY = 0;
    export let kbRepeatX = 1;
    export let kbRepeatY = 1;
    export let kbRotation = -Math.PI / 2;
    export let kbCenterX = 0.5;
    export let kbCenterY = 0.5;

    const dispatch = createEventDispatcher();
    const { camera, renderer } = useThrelte();

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    let keyboardMesh: THREE.Mesh | null = null;

    const gltf = useGltf("/media/green_console_5.glb");

    // Handle Click
    const handleClick = (event: MouseEvent) => {
        if (!keyboardMesh || !$camera) return;

        // Calculate pointer position in normalized device coordinates (-1 to +1)
        const canvas = renderer.domElement;
        const rect = canvas.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(pointer, $camera);

        const intersects = raycaster.intersectObject(keyboardMesh);

        if (intersects.length > 0) {
            const uv = intersects[0].uv;
            if (uv) {
                console.log("Keyboard Click UV:", uv);
                dispatch("keyboardClick", uv);
            }
        }
    };

    // 1. Find Meshes Once
    $: if ($gltf) {
        $gltf.scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;

                // --- AUTO SMOOTHING (Requested by User) ---
                // Re-calculating normals makes low-poly faceted curves look smooth.
                mesh.geometry.computeVertexNormals();
                if (mesh.material && !Array.isArray(mesh.material)) {
                    // Ensure the material isn't forcing flat shading
                    (mesh.material as THREE.MeshStandardMaterial).flatShading =
                        false;
                    mesh.material.needsUpdate = true;
                }
                // ------------------------------------------

                if (mesh.name === "keyboard") {
                    console.log("Keyboard Mesh Found");
                    keyboardMesh = mesh;
                }

                // ... (rest of logic) ...

                // Screen is handled inline usually, but let's keep it simple or refactor similarly if needed.
                // For now, focusing on fixing Keyboard.
                if (mesh.name === "screen" && screenTexture) {
                    // (Existing Screen Logic kept inline for minimal disruption, though could be refactored too)
                    if (!Array.isArray(mesh.material)) {
                        // Ensure we don't clone endlessly if this runs multiple times
                        if (!mesh.userData.materialCloned) {
                            mesh.material = mesh.material.clone();
                            mesh.userData.materialCloned = true;
                        }
                        const m = mesh.material as THREE.MeshStandardMaterial;
                        m.map = screenTexture;
                        m.emissiveMap = screenTexture;
                        m.emissive.set("#ffb000");
                        m.emissiveIntensity = 2.0;
                        m.color.set("#ffffff");
                        m.needsUpdate = true;
                    }
                    screenTexture.flipY = false;
                    screenTexture.colorSpace = THREE.SRGBColorSpace;
                    screenTexture.needsUpdate = true;
                }
            }
        });
    }

    // 2. Apply Keyboard Texture Material (Once per unique texture)
    $: if (keyboardMesh && keyboardTexture) {
        console.log("Applying Real Keyboard Texture to Mesh");
        const mesh = keyboardMesh;

        if (!Array.isArray(mesh.material)) {
            // Clone once to avoid sharing with screen if needed
            if (!mesh.userData.materialCloned) {
                mesh.material = mesh.material.clone();
                mesh.userData.materialCloned = true;
            }
            const m = mesh.material as THREE.MeshStandardMaterial;

            m.map = keyboardTexture;
            m.emissiveMap = keyboardTexture;
            m.emissive.set("#ffffff");
            m.emissiveIntensity = 2.0;
            m.color.set("#ffffff");

            // VISIBILITY HACKS
            m.side = THREE.DoubleSide;
            // m.depthTest = false; // Careful, might show through everything

            m.needsUpdate = true;
        }

        keyboardTexture.flipY = false;
        keyboardTexture.colorSpace = THREE.SRGBColorSpace;

        // CRITICAL: Enable Wrapping so sliders don't just smear the edge pixels
        keyboardTexture.wrapS = THREE.RepeatWrapping;
        keyboardTexture.wrapT = THREE.RepeatWrapping;

        keyboardTexture.needsUpdate = true;
    }

    // 3. Apply Tuning Transforms (Runs on Slider Change)
    $: if (keyboardTexture) {
        console.log("Updating Texture Transforms", {
            kbOffsetX,
            kbOffsetY,
            kbRepeatX,
            kbRepeatY,
            kbRotation,
        });
        keyboardTexture.flipY = false;
        keyboardTexture.colorSpace = THREE.SRGBColorSpace;

        // Tuning Application
        keyboardTexture.center.set(kbCenterX, kbCenterY);
        keyboardTexture.rotation = kbRotation;
        keyboardTexture.offset.set(kbOffsetX, kbOffsetY);
        keyboardTexture.repeat.set(kbRepeatX, kbRepeatY);

        keyboardTexture.needsUpdate = true;
    }

    // Final Camera Lock
    // Position: [-2.269749013915371, 2.4415972710310374, 4.832407447029052]
    // Target: [0.041087251020466585, 0.6398831827492274, -0.20973650676077182]

    onMount(() => {
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    });
</script>

<!-- Camera Locked -->
<T.PerspectiveCamera
    makeDefault
    position={[-2.269749013915371, 2.4415972710310374, 4.832407447029052]}
    fov={50}
>
    <OrbitControls
        enableDamping
        target={[
            0.041087251020466585, 0.6398831827492274, -0.20973650676077182,
        ]}
        enableZoom={false}
        enableRotate={false}
        enablePan={false}
    />
</T.PerspectiveCamera>

<T.DirectionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
<T.AmbientLight intensity={0.5} />

{#if $gltf}
    <Float floatIntensity={0.5} rotationIntensity={0.2}>
        <T.Group rotation={[0, 0, 0]}>
            <T is={$gltf.scene} />
        </T.Group>
    </Float>
{/if}

<ContactShadows
    opacity={0.5}
    scale={10}
    blur={2}
    far={10}
    resolution={256}
    color="#000000"
/>
