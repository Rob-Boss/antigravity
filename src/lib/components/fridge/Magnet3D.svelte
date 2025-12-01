<script lang="ts">
    import { T, useTask } from "@threlte/core";
    import { Text, HTML } from "@threlte/extras";
    import type { Magnet } from "$lib/stores/magnetStore";
    import { magnetStore } from "$lib/stores/magnetStore";
    import { Vector3, Plane, Raycaster } from "three";

    export let magnet: Magnet;
    export let draggingId: string | null;
    export let onDragStart: (id: string) => void;
    export let onDragEnd: () => void;

    let isDragging = false;

    // Drag logic
    const plane = new Plane(new Vector3(0, 0, 1), -0.52); // Plane at z=0.52 (surface)
    const intersection = new Vector3();

    $: isDragging = draggingId === magnet.id;

    function handlePointerDown(e: any) {
        e.stopPropagation();
        onDragStart(magnet.id);
        // document.body.style.cursor = 'grabbing';
    }

    // We'll handle the actual movement in the parent Scene to capture global mouse movement
    // But we can also do it here if we use Threlte's event system on a global plane

    const { draggingMagnet } = magnetStore;
    let currentX = magnet.x;
    let currentY = magnet.y;
    let currentZ = magnet.z;

    $: if (isDragging && $draggingMagnet && $draggingMagnet.id === magnet.id) {
        currentX = $draggingMagnet.x;
        currentY = $draggingMagnet.y;
        currentZ = $draggingMagnet.z;
    } else {
        currentX = magnet.x;
        currentY = magnet.y;
        currentZ = magnet.z;
    }
</script>

<T.Group
    position={[currentX, currentY, isDragging ? currentZ + 0.05 : currentZ]}
    rotation.z={magnet.rotation}
>
    <!-- Magnet Shadow/Border -->
    <T.Mesh position={[0, 0, -0.006]}>
        <T.BoxGeometry
            args={[0.022 + magnet.word.length * 0.02, 0.062, 0.01]}
        />
        <T.MeshBasicMaterial color="#cccccc" />
    </T.Mesh>

    <!-- Magnet Base -->
    <T.Mesh userData={{ isMagnet: true, id: magnet.id }}>
        <T.BoxGeometry args={[0.02 + magnet.word.length * 0.02, 0.06, 0.01]} />
        <T.MeshBasicMaterial color="#ffffff" />
    </T.Mesh>

    <!-- Text -->
    <!-- Text -->
    <Text
        text={magnet.word}
        fontSize={0.035}
        color="#000000"
        position={[0, 0, 0.006]}
        anchorX="center"
        anchorY="middle"
        on:create={({ ref }) => {
            ref.material.depthTest = true;
            ref.material.depthWrite = true;
        }}
    />
</T.Group>
