<script lang="ts">
    import { Canvas, T } from "@threlte/core";
    import { Environment, OrbitControls, Text } from "@threlte/extras";
    // import { degToRad } from "three/src/math/MathUtils.js"; // REPLACED
    import { type Spring, spring } from "svelte/motion";
    import * as THREE from "three";

    export let isActive = false;

    // --- DATA ---
    type Locker = {
        id: string;
        row: number;
        col: number;
        color: string;
        isOpen: boolean;
    };

    // 3x4 Grid of Lockers
    const rows = 4;
    const cols = 3;
    const lockers: Locker[] = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            lockers.push({
                id: `L-${r}-${c}`,
                row: r,
                col: c,
                color: `hsl(${Math.random() * 360}, 50%, 50%)`,
                isOpen: false,
            });
        }
    }

    const lockerAngles = spring(Array(rows * cols).fill(0), {
        stiffness: 0.1,
        damping: 0.5,
    });

    // --- LOGIC ---
    const toggleDoor = (index: number) => {
        const locker = lockers[index];
        locker.isOpen = !locker.isOpen;
        // Trigger Svelte reactivity for the array item
        lockers[index] = locker;

        // Animate
        lockerAngles.update(($a) => {
            const newA = [...$a];
            newA[index] = locker.isOpen ? 110 : 0;
            return newA;
        });
    };

    // --- HELPERS ---
    const lockerW = 1.2;
    const lockerH = 1.2;
    const gap = 0.1;

    const getPos = (r: number, c: number): [number, number, number] => {
        const x = (c - 1) * (lockerW + gap);
        const y = (1.5 - r) * (lockerH + gap) + 1; // Center vertically somewhat
        return [x, y, 0];
    };
</script>

<div class="machine-container">
    <Canvas>
        <T.PerspectiveCamera makeDefault position={[0, 1, 6]} fov={50}>
            <OrbitControls target={[0, 1, 0]} enableZoom={true} />
        </T.PerspectiveCamera>

        <T.AmbientLight intensity={0.4} />
        <T.PointLight position={[2, 4, 5]} intensity={1} />
        <Environment preset="city" />

        <!-- WALL MOUNT -->
        <T.Mesh position={[0, 1, -1]}>
            <T.BoxGeometry args={[5, 6, 0.5]} />
            <T.MeshStandardMaterial
                color="#444"
                roughness={0.1}
                metalness={0.6}
            />
        </T.Mesh>

        <!-- LOCKERS -->
        <T.Group>
            {#each lockers as locker, i (locker.id)}
                {@const pos = getPos(locker.row, locker.col)}
                <T.Group position={pos}>
                    <!-- BOX FRAME -->
                    <T.Mesh position={[0, 0, -0.4]}>
                        <T.BoxGeometry args={[lockerW, lockerH, 0.8]} />
                        <T.MeshStandardMaterial color="#222" />
                    </T.Mesh>

                    <!-- ITEM INSIDE -->
                    <T.Mesh position={[0, 0, -0.4]}>
                        <T.BoxGeometry args={[0.5, 0.5, 0.5]} />
                        <T.MeshStandardMaterial color={locker.color} />
                        <Text
                            text="ITEM"
                            fontSize={0.2}
                            color="white"
                            position={[0, 0, 0.26]}
                            anchorX="center"
                            anchorY="middle"
                        />
                    </T.Mesh>

                    <!-- DOOR HINGE PIVOT (Left side) -->
                    <T.Group
                        position={[-lockerW / 2, 0, 0]}
                        rotation={[
                            0,
                            THREE.MathUtils.degToRad(-$lockerAngles[i]),
                            0,
                        ]}
                    >
                        <!-- DOOR MESH (Offset so it pivots correctly) -->
                        <T.Mesh
                            position={[lockerW / 2, 0, 0]}
                            on:click={() => toggleDoor(i)}
                        >
                            <T.BoxGeometry args={[lockerW, lockerH, 0.05]} />
                            <T.MeshPhysicalMaterial
                                color="#ffffff"
                                transmission={0.6}
                                opacity={1}
                                roughness={0.2}
                                metalness={0.1}
                                thickness={0.1}
                                transparent
                            />
                        </T.Mesh>

                        <!-- FRAME/HANDLE -->
                        <T.Mesh
                            position={[lockerW - 0.2, 0, 0.05]}
                            on:click={() => toggleDoor(i)}
                        >
                            <T.BoxGeometry args={[0.1, 0.3, 0.05]} />
                            <T.MeshStandardMaterial color="#888" />
                        </T.Mesh>

                        <!-- DOOR NUMBER -->
                        <Text
                            text={`${locker.row + 1}${locker.col + 1}`}
                            fontSize={0.2}
                            color="black"
                            position={[lockerW - 0.2, 0.3, 0.04]}
                            rotation={[0, 0, 0]}
                            anchorX="center"
                            anchorY="middle"
                        />
                    </T.Group>
                </T.Group>
            {/each}
        </T.Group>
    </Canvas>

    <div class="instructions">
        <p>Click a Door to Open It</p>
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
