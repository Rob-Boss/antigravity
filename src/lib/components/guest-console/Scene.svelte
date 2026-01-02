<script lang="ts">
    import { T, useThrelte, useTask } from "@threlte/core";
    import {
        ContactShadows,
        Float,
        OrbitControls,
        useGltf,
    } from "@threlte/extras";
    import * as THREE from "three";
    import { createEventDispatcher, onMount } from "svelte";
    import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
    import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
    import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
    import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

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
    const { camera, renderer, scene, size, autoRender, renderStage } =
        useThrelte();

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    let keyboardMesh: THREE.Mesh | null = null;
    let isHovered = false;

    const gltf = useGltf("/media/green_console_5.glb");

    // --- MANUAL INPUT HANDLING ---

    const updatePointer = (event: MouseEvent) => {
        const canvas = renderer.domElement;
        const rect = canvas.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleMouseMove = (event: MouseEvent) => {
        updatePointer(event);
    };

    const handleClick = (event: MouseEvent) => {
        if (!keyboardMesh || !$camera) return;
        updatePointer(event); // Ensure precise pos

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

    // 1. Find Meshes
    $: if ($gltf) {
        $gltf.scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;

                // --- AUTO SMOOTHING (Requested by User) ---
                mesh.geometry.computeVertexNormals();
                if (mesh.material && !Array.isArray(mesh.material)) {
                    (mesh.material as THREE.MeshStandardMaterial).flatShading =
                        false;
                    mesh.material.needsUpdate = true;
                }
                // ------------------------------------------

                if (mesh.name === "keyboard") {
                    console.log("Keyboard Mesh Found");
                    keyboardMesh = mesh;
                }

                if (mesh.name === "screen" && screenTexture) {
                    if (!Array.isArray(mesh.material)) {
                        if (!mesh.userData.materialCloned) {
                            mesh.material = mesh.material.clone();
                            mesh.userData.materialCloned = true;
                        }
                        const m = mesh.material as THREE.MeshStandardMaterial;
                        m.map = screenTexture;
                        m.emissiveMap = screenTexture;
                        m.emissive.set("#ff6600");
                        m.emissiveIntensity = 4.0;
                        m.color.set("#ffffff");
                        m.toneMapped = false;
                        m.roughness = 0.2;
                        m.metalness = 0.1;
                        m.needsUpdate = true;
                    }
                    screenTexture.flipY = false;
                    screenTexture.colorSpace = THREE.SRGBColorSpace;
                    screenTexture.needsUpdate = true;
                }
            }
        });
    }

    // 2. Apply Keyboard Texture
    $: if (keyboardMesh && keyboardTexture) {
        const mesh = keyboardMesh;
        if (!Array.isArray(mesh.material)) {
            if (!mesh.userData.materialCloned) {
                const basicMat = new THREE.MeshBasicMaterial();
                mesh.material = basicMat;
                mesh.userData.materialCloned = true;
            }
            const m = mesh.material as THREE.MeshBasicMaterial;
            m.map = keyboardTexture;
            m.color.set("#ffffff");
            m.color.multiplyScalar(4.0);
            m.toneMapped = false;
            m.side = THREE.DoubleSide;
            m.needsUpdate = true;
        }
        keyboardTexture.flipY = false;
        keyboardTexture.colorSpace = THREE.SRGBColorSpace;
        keyboardTexture.wrapS = THREE.RepeatWrapping;
        keyboardTexture.wrapT = THREE.RepeatWrapping;
        keyboardTexture.needsUpdate = true;
    }

    // 3. Apply Tuning Transforms
    $: if (keyboardTexture) {
        keyboardTexture.flipY = false;
        keyboardTexture.colorSpace = THREE.SRGBColorSpace;
        keyboardTexture.center.set(kbCenterX, kbCenterY);
        keyboardTexture.rotation = kbRotation;
        keyboardTexture.offset.set(kbOffsetX, kbOffsetY);
        keyboardTexture.repeat.set(kbRepeatX, kbRepeatY);
        keyboardTexture.needsUpdate = true;
    }

    // --- BLOOM SETUP ---
    export let bloomStrength = 0.25;
    export let bloomRadius = 0.4;
    export let bloomThreshold = 0.5;

    const renderTarget = new THREE.WebGLRenderTarget(800, 600, {
        type: THREE.HalfFloatType,
        format: THREE.RGBAFormat,
    });
    const composer = new EffectComposer(renderer, renderTarget);
    const renderPass = new RenderPass(scene, $camera);
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2($size.width, $size.height),
        bloomStrength,
        bloomRadius,
        bloomThreshold,
    );
    const outputPass = new OutputPass();

    composer.addPass(renderPass);
    composer.addPass(bloomPass);
    composer.addPass(outputPass);

    $: renderPass.camera = $camera;
    $: bloomPass.strength = bloomStrength;
    $: bloomPass.radius = bloomRadius;
    $: bloomPass.threshold = bloomThreshold;
    $: composer.setSize($size.width, $size.height);

    // REVERT TO 'ALMOST THERE' STATE (0x0E0E0E)
    renderer.setClearColor(0x0e0e0e, 1);

    autoRender.set(false);

    // RENDER LOOP & HOVER CHECK
    useTask(
        (delta) => {
            // Render Bloom
            composer.render();

            // Check Hover (Manual Raycast)
            if (keyboardMesh && $camera) {
                raycaster.setFromCamera(pointer, $camera);

                let hit = false;
                if ($gltf && $gltf.scene) {
                    const intersects = raycaster.intersectObject(
                        $gltf.scene,
                        true,
                    ); // true = recursive
                    hit = intersects.length > 0;
                }

                if (hit !== isHovered) {
                    isHovered = hit;
                    dispatch("hover", isHovered);
                    // console.log("Hover State Change:", isHovered);
                }
            }
        },
        { stage: renderStage, autoInvalidate: false },
    );

    onMount(() => {
        window.addEventListener("click", handleClick);
        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("click", handleClick);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    });
</script>

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
        <T.Group rotation={[0, 0, 0]} scale={0.8}>
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
