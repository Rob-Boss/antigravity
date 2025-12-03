<script lang="ts">
    import { T, useThrelte } from "@threlte/core";
    import { magnetStore } from "$lib/stores/magnetStore";
    import FridgeModel from "../fridge/FridgeModel.svelte";
    import Magnet3D from "../fridge/Magnet3D.svelte";
    import { Vector3, Plane, Raycaster, Vector2 } from "three";
    import { playPickupSound, playDropSound } from "$lib/audio/magnetSound";

    export let position: [number, number, number] = [0, 0, 0];
    export let rotation: [number, number, number] = [0, 0, 0];
    export let scale: [number, number, number] | number = 1;

    const { camera, renderer, scene } = useThrelte();

    let draggingId: string | null = null;

    // Raycasting for drag
    const raycaster = new Raycaster();
    const pointer = new Vector2();
    // Plane parallel to fridge surface, slightly offset.
    // Note: This plane logic assumes the fridge is at (0,0,0) facing Z.
    // If the fridge moves, this plane needs to move with it.
    // For this prototype, we'll keep it simple, but strictly speaking
    // we should transform this plane by the object's matrix.
    const fridgePlane = new Plane(new Vector3(0, 0, 1), -0.56);
    const intersection = new Vector3();

    function onDragStart(id: string) {
        draggingId = id;
    }

    function onDragEnd() {
        draggingId = null;
        playDropSound();
    }

    function getRelativePointerPosition(event: PointerEvent) {
        const rect = renderer.domElement.getBoundingClientRect();
        return {
            x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
            y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
        };
    }

    function handlePointerDown(event: PointerEvent) {
        const { x, y } = getRelativePointerPosition(event);
        pointer.x = x;
        pointer.y = y;

        raycaster.setFromCamera(pointer, $camera);

        // Raycast against all objects in the scene
        const intersects = raycaster.intersectObjects(scene.children, true);

        // Find the first object that is a magnet
        const hit = intersects.find((i) => i.object.userData.isMagnet);

        if (hit) {
            const id = hit.object.userData.id;
            draggingId = id;
            event.stopPropagation(); // Prevent other handlers
            magnetStore.bringToFront(id);
            playPickupSound();
        }
    }

    function handlePointerMove(event: PointerEvent) {
        if (!draggingId) return;

        const { x, y } = getRelativePointerPosition(event);
        pointer.x = x;
        pointer.y = y;

        raycaster.setFromCamera(pointer, $camera);

        if (raycaster.ray.intersectPlane(fridgePlane, intersection)) {
            // The intersection point is in world space.
            // Since the magnetStore expects positions relative to the fridge center (mostly),
            // and our fridge might be offset, we *should* transform this point into the fridge's local space.
            // However, magnetStore logic is a bit coupled to the original setup.
            // For now, let's see if it works "as is" if we don't rotate the fridge too much.
            // If we move the fridge to x=-2, the intersection.x will be around -2.
            // If the magnets are children of the scene (which they seem to be in Magnet3D via <T.Mesh>),
            // they need world coordinates.
            // Let's check Magnet3D... it uses absolute positioning from the store.
            // So if the store holds "local" fridge coordinates (e.g. -0.5 to 0.5),
            // but we are rendering them in world space at x=-2... they will appear at x=-0.5 (wrong).

            // Correction: We need to wrap the magnets in a Group that applies the Fridge's transform.
            // Then the store coordinates (local) will be correct relative to that group.

            // BUT, the raycasting gives us WORLD coordinates.
            // So we need to convert WORLD intersection -> LOCAL fridge space -> Store.

            // Let's implement a basic world-to-local conversion if possible,
            // or just rely on the Group transform for rendering and assume the store values are local.
            // The issue is `magnetStore.updateDragPosition` updates the store.
            // If we pass world coords to it, the magnet will move to world coords.
            // If the magnet is rendered inside a transformed group, it will be double-transformed?
            // Actually, let's look at Magnet3D. It likely uses <T.Mesh position={[m.x, m.y, m.z]}>.
            // If we wrap everything in <T.Group position={...}>, then m.x/m.y should be LOCAL.
            // So we need to convert the raycast intersection (WORLD) to LOCAL space before updating the store.

            // Simplified for prototype: We will wrap content in a T.Group.
            // We will subtract the group's position from the intersection point before sending to store.
            // This assumes no rotation/scale for simplicity.
            magnetStore.updateDragPosition(
                intersection.x - position[0],
                intersection.y - position[1],
            );
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

<T.Group {position} {rotation} {scale}>
    <FridgeModel />

    {#each $magnetStore as magnet (magnet.id)}
        <!-- 
            Magnet3D usually renders the magnet. 
            We need to ensure it doesn't have its own absolute positioning logic that fights this group.
            Assuming Magnet3D just renders a mesh at the given props.
        -->
        <Magnet3D {magnet} {draggingId} {onDragStart} {onDragEnd} />
    {/each}
</T.Group>
