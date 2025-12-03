<script lang="ts">
    import { T, useThrelte } from "@threlte/core";
    import { OrbitControls, Environment, interactivity } from "@threlte/extras";
    import { magnetStore } from "$lib/stores/magnetStore";
    import FridgeModelVariant from "./FridgeModelVariant.svelte";
    import Magnet3D from "./Magnet3D.svelte";
    import { Vector3, Plane, Raycaster, Vector2 } from "three";
    import { playPickupSound, playDropSound } from "$lib/audio/magnetSound";
    import type { FridgeConfig } from "./fridgeVariations";

    export let config: FridgeConfig;

    interactivity();

    const { camera, scene } = useThrelte();

    let draggingId: string | null = null;
    let controls: any;

    // Raycasting for drag
    const raycaster = new Raycaster();
    const pointer = new Vector2();
    const fridgePlane = new Plane(new Vector3(0, 0, 1), -0.56);
    const intersection = new Vector3();

    function onDragStart(id: string) {
        draggingId = id;
        if (controls) controls.enabled = false;
    }

    function onDragEnd() {
        draggingId = null;
        if (controls) controls.enabled = true;
        playDropSound();
    }

    function handlePointerDown(event: PointerEvent) {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(pointer, $camera);

        const intersects = raycaster.intersectObjects(scene.children, true);
        const hit = intersects.find((i) => i.object.userData.isMagnet);

        if (hit) {
            const id = hit.object.userData.id;
            draggingId = id;
            if (controls) controls.enabled = false;
            event.stopPropagation();
            magnetStore.bringToFront(id);
            playPickupSound();
        }
    }

    function handlePointerMove(event: PointerEvent) {
        if (!draggingId) return;

        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(pointer, $camera);

        if (raycaster.ray.intersectPlane(fridgePlane, intersection)) {
            magnetStore.updateDragPosition(intersection.x, intersection.y);
        }
    }

    function handlePointerUp() {
        if (draggingId) {
            magnetStore.commitDrag();
            onDragEnd();
        }
    }
</script>

<svelte:window
    on:pointerdown={handlePointerDown}
    on:pointermove={handlePointerMove}
    on:pointerup={handlePointerUp}
/>

<T.PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50}>
    <OrbitControls
        bind:ref={controls}
        enableDamping
        dampingFactor={0.1}
        minDistance={2}
        maxDistance={8}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 2.5}
    />
</T.PerspectiveCamera>

<T.DirectionalLight position={[5, 5, 10]} intensity={1} />
<T.AmbientLight intensity={0.5} />
<Environment preset="studio" />

<FridgeModelVariant {config} />

{#each $magnetStore as magnet (magnet.id)}
    <Magnet3D {magnet} {draggingId} {onDragStart} {onDragEnd} />
{/each}
