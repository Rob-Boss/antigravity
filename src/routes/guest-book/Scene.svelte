<script>
    import { T } from "@threlte/core";
    import {
        ContactShadows,
        Float,
        OrbitControls,
        useGltf,
    } from "@threlte/extras";

    const gltf = useGltf("/media/retro_computer.glb");

    export let screenTexture = null;

    $: if ($gltf) {
        const screen = $gltf.nodes.screen;
        if (screen) {
            // Unhide the screen mesh so it acts as the backing
            if (screenTexture) {
                screen.material.map = screenTexture;
                screen.material.emissiveMap = screenTexture;
                screen.material.emissive.set("#ffffff");
                screen.material.emissiveIntensity = 1;
                screen.material.roughness = 0.2;
                screen.material.metalness = 0.5;
                // Flip texture often needed for GLTF mapping
                screenTexture.flipY = false;
                screenTexture.needsUpdate = true;
            } else {
                // Fallback if no texture yet
                screen.material.color.set("#000000");
            }
        }
    }
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50}>
    <OrbitControls enableDamping target={[0, 0, 0]} />
</T.PerspectiveCamera>

<T.DirectionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
<T.AmbientLight intensity={0.5} />

{#if $gltf}
    <Float floatIntensity={0.5} rotationIntensity={0.2}>
        <!-- Render the full model. The screen node is part of this hierarchy. -->
        <T.Group rotation={[0, -Math.PI / 2, 0]}>
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
