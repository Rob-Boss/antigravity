<script lang="ts">
    import { T, useThrelte, useTask } from "@threlte/core";
    import { Environment, interactivity } from "@threlte/extras";
    import { magnetStore } from "$lib/stores/magnetStore";
    import FridgeModel from "./FridgeModel.svelte";
    import Magnet3D from "./Magnet3D.svelte";
    import { Vector3, Plane, Raycaster, Vector2, MathUtils } from "three";
    import { playPickupSound, playDropSound } from "$lib/audio/magnetSound";

    interactivity();

    const { camera, renderer, scene } = useThrelte();

    let draggingId: string | null = null;

    // Navigation State
    const mouse = { x: 0, y: 0 };
    const targetCameraPos = new Vector3(0, 0, 4);
    const currentCameraPos = new Vector3(0, 0, 4);

    // Configuration
    const START_Z = 5.0; // Starting zoom (further back)
    const BASE_Z = 3.8; // Final zoom (pulled back even further)
    const INTRO_DURATION = 3.0; // Seconds to zoom in
    const PAN_X_RANGE = 2.5;
    const PAN_Y_RANGE = 1.5;
    const VERTICAL_OFFSET = 1.4; // Shift camera up significantly so fridge appears lower
    const DAMPING = 0.05;

    // State
    let timeElapsed = 0;
    let currentZ = START_Z;

    useTask((delta) => {
        // Update intro zoom
        if (timeElapsed < INTRO_DURATION) {
            timeElapsed += delta;
            const t = Math.min(timeElapsed / INTRO_DURATION, 1);
            // Ease out cubic for smooth settle
            const ease = 1 - Math.pow(1 - t, 3);
            currentZ = MathUtils.lerp(START_Z, BASE_Z, ease);
        } else {
            currentZ = BASE_Z;
        }

        // Calculate target X/Y based on mouse position (pan)
        const targetX = mouse.x * PAN_X_RANGE;
        const targetY = mouse.y * PAN_Y_RANGE + VERTICAL_OFFSET;

        targetCameraPos.set(targetX, targetY, currentZ);

        // Smoothly move camera (only for pan/tilt now, Z is handled by intro)
        // We apply damping to X/Y, but Z is already smoothed by the intro lerp
        // However, using lerp on the whole vector is fine as long as targetZ is smooth
        currentCameraPos.lerp(targetCameraPos, DAMPING);

        if ($camera) {
            $camera.position.copy(currentCameraPos);
            // Look slightly towards center but mostly parallel
            // Shifting lookAt slightly lower to enhance the "top-down" access
            $camera.lookAt(
                currentCameraPos.x * 0.8,
                (currentCameraPos.y - VERTICAL_OFFSET) * 0.8,
                0,
            );
        }
    });

    // Raycasting for drag
    const raycaster = new Raycaster();
    const pointer = new Vector2();
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
        mouse.x = x;
        mouse.y = y;

        raycaster.setFromCamera(pointer, $camera);
        const intersects = raycaster.intersectObjects(scene.children, true);
        const hit = intersects.find((i) => i.object.userData.isMagnet);

        if (hit) {
            const id = hit.object.userData.id;
            draggingId = id;
            event.stopPropagation();
            magnetStore.bringToFront(id);
            playPickupSound();
        }
    }

    function handlePointerMove(event: PointerEvent) {
        const { x, y } = getRelativePointerPosition(event);

        // Update mouse position for navigation
        mouse.x = x;
        mouse.y = y;

        if (!draggingId) return;

        pointer.x = x;
        pointer.y = y;

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

<T.PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />

<T.DirectionalLight position={[5, 5, 10]} intensity={1} />
<T.AmbientLight intensity={0.5} />
<Environment preset="studio" />

<FridgeModel />

{#each $magnetStore as magnet (magnet.id)}
    <Magnet3D {magnet} {draggingId} {onDragStart} {onDragEnd} />
{/each}
