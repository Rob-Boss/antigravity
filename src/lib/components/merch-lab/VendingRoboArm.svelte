<script lang="ts">
    import { Canvas, T } from "@threlte/core";
    import { Environment, OrbitControls, Text } from "@threlte/extras";
    import { tweened } from "svelte/motion";
    import { cubicOut } from "svelte/easing";
    import * as THREE from "three";

    export let isActive = false;

    // --- LOGIC ---
    let moving = false;
    // Current head position
    const headX = tweened(0, { duration: 1000, easing: cubicOut });
    const headY = tweened(3, { duration: 1000, easing: cubicOut });
    const headZ = tweened(0, { duration: 1000, easing: cubicOut });

    const items = [
        {
            id: "A",
            pos: [-1.5, 0, -0.5] as [number, number, number],
            color: "#f00",
        },
        {
            id: "B",
            pos: [0, 0, -0.5] as [number, number, number],
            color: "#0f0",
        },
        {
            id: "C",
            pos: [1.5, 0, -0.5] as [number, number, number],
            color: "#00f",
        },
        {
            id: "D",
            pos: [-1.5, -2, -0.5] as [number, number, number],
            color: "#ff0",
        },
        {
            id: "E",
            pos: [0, -2, -0.5] as [number, number, number],
            color: "#0ff",
        },
        {
            id: "F",
            pos: [1.5, -2, -0.5] as [number, number, number],
            color: "#f0f",
        },
    ];

    const grabItem = async (item: any) => {
        if (moving) return;
        moving = true;

        // 1. Hover X/Y
        headX.set(item.pos[0]);
        await headY.set(item.pos[1] + 1);

        // 2. Descend
        await headY.set(item.pos[1] + 0.5);

        // 3. "Grab" (delay)
        await new Promise((r) => setTimeout(r, 300));

        // 4. Ascend
        await headY.set(2);

        // 5. Move to Drop Zone (Right front)
        headX.set(2.5);
        await headY.set(-2);

        // 6. Reset
        moving = false;
        alert("Delivered!");
        headX.set(0);
        headY.set(3);
    };
</script>

<div class="machine-container">
    <Canvas>
        <T.PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50}>
            <OrbitControls target={[0, 0, 0]} enableZoom={true} />
        </T.PerspectiveCamera>

        <T.AmbientLight intensity={0.5} />
        <T.DirectionalLight position={[5, 10, 5]} intensity={1} castShadow />
        <Environment preset="city" />

        <!-- FRAME -->
        <T.Group position={[0, 0, 0]}>
            <T.Mesh position={[0, 0, -1]}>
                <T.BoxGeometry args={[6, 6, 0.2]} />
                <T.MeshStandardMaterial color="#222" />
            </T.Mesh>
            <!-- Rails -->
            <T.Mesh position={[0, 3.5, 0]}>
                <T.BoxGeometry args={[6, 0.2, 0.2]} />
                <T.MeshStandardMaterial color="#888" />
            </T.Mesh>
        </T.Group>

        <!-- ITEMS -->
        {#each items as item}
            <T.Mesh
                position={item.pos}
                castShadow
                on:click={() => grabItem(item)}
            >
                <T.BoxGeometry args={[0.8, 0.8, 0.8]} />
                <T.MeshStandardMaterial color={item.color} />
                <Text
                    text={item.id}
                    fontSize={0.3}
                    color="white"
                    position={[0, 0, 0.41]}
                    anchorX="center"
                    anchorY="middle"
                />
            </T.Mesh>
        {/each}

        <!-- GANTRY HEAD -->
        <T.Group position={[$headX, $headY, $headZ]}>
            <!-- Vertical Rod -->
            <T.Mesh position={[0, 1, 0]}>
                <T.CylinderGeometry args={[0.1, 0.1, 4, 8]} />
                <T.MeshStandardMaterial color="#666" metalness={0.8} />
            </T.Mesh>
            <!-- Claw/Suction -->
            <T.Mesh position={[0, -1, 0]}>
                <T.CylinderGeometry args={[0.3, 0.1, 0.5, 16]} />
                <T.MeshStandardMaterial color="#d00" />
            </T.Mesh>
        </T.Group>

        <!-- DROP BIN -->
        <T.Mesh position={[2.5, -3, 0]}>
            <T.BoxGeometry args={[1.5, 0.5, 1.5]} />
            <T.MeshStandardMaterial color="#111" />
        </T.Mesh>
    </Canvas>

    <div class="instructions">
        <p>Click a colored box. The Robo-Arm will retrieve it.</p>
    </div>
</div>

<style>
    .machine-container {
        width: 100%;
        height: 100%;
        background: #000;
        position: relative;
    }
    .instructions {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        color: #888;
        font-size: 0.8rem;
        pointer-events: none;
    }
</style>
