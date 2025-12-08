<script lang="ts">
    import { T } from "@threlte/core";
    import { useGltf, OrbitControls } from "@threlte/extras";
    import FridgeObject from "./FridgeObject.svelte";
    import { Mesh } from "three";

    const gltf = useGltf("/media/kitchen.glb");

    let fridgePosition: [number, number, number] = [0, 0, 0];
    let fridgeRotation: [number, number, number] = [0, 0, 0];
    let fridgeScale: [number, number, number] = [1, 1, 1];
    let fridgeFound = false;

    $: if ($gltf) {
        const scene = $gltf.scene;
        const locationNode = scene.getObjectByName("fridge_location");
        if (locationNode) {
            fridgePosition = locationNode.position.toArray();
            // Euler.toArray() returns [x, y, z, order], we just want [x, y, z]
            fridgeRotation = locationNode.rotation.toArray().slice(0, 3) as [
                number,
                number,
                number,
            ];
            fridgeScale = locationNode.scale.toArray();
            fridgeFound = true;

            // Hide the placeholder object if it's a mesh so it doesn't clash
            if (locationNode instanceof Mesh) {
                locationNode.visible = false;
            }
        }
    }
</script>

<T.PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50}>
    <OrbitControls enableDamping />
</T.PerspectiveCamera>

<T.DirectionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
<T.AmbientLight intensity={0.5} />

{#if $gltf}
    <T is={$gltf.scene} />
{/if}

{#if fridgeFound}
    <FridgeObject
        position={fridgePosition}
        rotation={fridgeRotation}
        scale={fridgeScale}
    />
{/if}
