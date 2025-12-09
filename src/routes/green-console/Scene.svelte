<script>
    import { T } from "@threlte/core";
    import {
        ContactShadows,
        Float,
        OrbitControls,
        useGltf,
    } from "@threlte/extras";

    const gltf = useGltf("/media/green_console_2.glb?v=2");

    export let screenTexture = null;

    // React to changes
    $: {
        if ($gltf) {
            $gltf.scene.traverse((child) => {
                if (child.isMesh && child.name === "screen") {
                    if (screenTexture && child.material) {
                        child.material.map = screenTexture;
                        child.material.emissiveMap = screenTexture;
                        child.material.emissive.set("#ffb000");
                        child.material.emissiveIntensity = 2;
                        child.material.color.set("#ffffff");
                        child.material.needsUpdate = true;
                        screenTexture.flipY = false;
                        screenTexture.needsUpdate = true;
                    }
                }
            });
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
