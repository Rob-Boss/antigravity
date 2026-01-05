<script lang="ts">
    import { T, useTask } from "@threlte/core";
    import { useGltf, interactivity } from "@threlte/extras";
    import * as THREE from "three";

    let {
        selection = "",
        screenStatus = "CHOOSE",
        doorGlow = 0,
        armY = 2,
        doorRotation = 0,
        screenTexture = null,
        onKeyClick = (key: string) => {},
        onGltfLoaded = () => {},
    } = $props();

    interactivity();

    console.log("VendingMachineScene: Initializing...");

    const gltfStore = useGltf("/vending_machine_3.glb");

    // Float Animation State
    let time = 0;
    let cameraGroup: THREE.Group;

    useTask((delta) => {
        time += delta;
        if (cameraGroup) {
            // Gentle float: mostly vertical (Y), slight horizontal (X)
            cameraGroup.position.y = Math.sin(time * 0.5) * 0.1;
            cameraGroup.position.x = Math.sin(time * 0.3) * 0.05;
        }
    });

    $effect(() => {
        console.log("VendingMachineScene: gltfStore state:", $gltfStore);
        if ($gltfStore) {
            console.log("VendingMachineScene: GLB Loaded!", $gltfStore);
            $gltfStore.scene.traverse((child: any) => {
                if (child.isMesh && child.name === "screen") {
                    // Apply the dynamic texture to the map, preserving other material properties
                    if (child.material) {
                        child.material.map = screenTexture;
                        child.material.needsUpdate = true;
                    }
                }
                if (child.isMesh && child.name === "push.door.001") {
                    if (!child.userData.materialCloned) {
                        child.material = child.material.clone();
                        child.userData.materialCloned = true;
                    }
                    child.material.emissiveIntensity = doorGlow;
                    child.material.needsUpdate = true;
                }
                if (child.isMesh && /^[A-D][1-3]$/.test(child.name)) {
                    child.visible = false;
                }
            });
            onGltfLoaded();
        }
    });
</script>

{#if $gltfStore}
    <T is={$gltfStore.scene}>
        {#if $gltfStore.cameras.length > 0}
            <T.Group bind:ref={cameraGroup}>
                <T is={$gltfStore.cameras[0]} makeDefault />
            </T.Group>
        {/if}

        {#if $gltfStore.nodes.arm}
            <T.Mesh isMesh object={$gltfStore.nodes.arm} position.y={armY} />
        {/if}

        {#if $gltfStore.nodes["push.door"]}
            <T.Mesh
                isMesh
                object={$gltfStore.nodes["push.door"]}
                rotation.x={doorRotation}
            />
        {/if}

        {#each Object.entries($gltfStore.nodes) as [name, node]}
            {#if name.startsWith("button.") || name === "button.clear"}
                {@const key = name.split(".")[1] || "clear"}
                <T.Mesh
                    isMesh
                    object={node}
                    on:pointerenter={() =>
                        (document.body.style.cursor = "pointer")}
                    on:pointerleave={() =>
                        (document.body.style.cursor = "default")}
                    on:click={(e) => {
                        e.stopPropagation();
                        onKeyClick(key);
                    }}
                />
            {/if}
        {/each}
    </T>
{/if}
