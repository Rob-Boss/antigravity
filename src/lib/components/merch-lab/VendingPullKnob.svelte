<script lang="ts">
    import { Canvas, T } from "@threlte/core";
    import { Environment, OrbitControls, Text } from "@threlte/extras";
    import { type Spring, spring } from "svelte/motion";
    import * as THREE from "three";

    export let isActive = false;

    // --- DATA ---
    type PullColumn = {
        id: number;
    };

    // 4 Columns
    const cols = 4;
    const pulls: PullColumn[] = Array.from({ length: cols }).map((_, i) => ({
        id: i,
    }));

    const pullSprings = spring(Array(cols).fill(0), {
        stiffness: 0.2,
        damping: 0.5,
    });
    const itemYSprings = spring(Array(cols).fill(0), {
        stiffness: 0.1,
        damping: 0.7,
    });

    const pullKnob = (index: number) => {
        // Pull Out
        pullSprings.update(($p) => {
            $p[index] = 1;
            return $p;
        });

        // Drop item?
        itemYSprings.update(($y) => {
            $y[index] = -2;
            return $y;
        });

        // Reset knob
        setTimeout(() => {
            pullSprings.update(($p) => {
                $p[index] = 0;
                return $p;
            });
        }, 500);

        // Reset item later
        setTimeout(() => {
            itemYSprings.update(
                ($y) => {
                    $y[index] = 0;
                    return $y;
                },
                { hard: true },
            );
        }, 1500);
    };
</script>

<div class="machine-container">
    <Canvas>
        <T.PerspectiveCamera makeDefault position={[0, 2, 5]} fov={50}>
            <OrbitControls target={[0, 1, 0]} enableZoom={true} />
        </T.PerspectiveCamera>

        <T.AmbientLight intensity={0.5} />
        <T.DirectionalLight position={[-5, 5, 5]} intensity={1} />
        <Environment preset="night" />

        <!-- VINTAGE MACHINE BODY -->
        <T.Mesh position={[0, 1, -0.5]}>
            <T.BoxGeometry args={[5, 4, 1.5]} />
            <T.MeshStandardMaterial color="#533" roughness={0.4} />
        </T.Mesh>

        <T.Group position={[-1.5, 0, 0]}>
            {#each pulls as p, i}
                <T.Group position={[i * 1, 0, 0]}>
                    <!-- ITEM COLUMN (Glass) -->
                    <T.Mesh position={[0, 2, 0]}>
                        <T.BoxGeometry args={[0.8, 2, 0.5]} />
                        <T.MeshPhysicalMaterial
                            color="#fff"
                            transmission={0.7}
                            thickness={0.5}
                            roughness={0.1}
                        />
                    </T.Mesh>

                    <!-- ITEM INSIDE -->
                    <T.Mesh position={[0, 2 + $itemYSprings[i], 0]}>
                        <T.BoxGeometry args={[0.6, 0.8, 0.2]} />
                        <T.MeshStandardMaterial color="#eda" />
                        <Text
                            text="CIGS"
                            fontSize={0.2}
                            color="black"
                            position={[0, 0, 0.11]}
                            anchorX="center"
                            anchorY="middle"
                        />
                    </T.Mesh>

                    <!-- KNOB MECHANISM -->
                    <T.Group position={[0, 0.5, 0.5 + $pullSprings[i]]}>
                        <T.Mesh
                            rotation={[1.57, 0, 0]}
                            on:click={() => pullKnob(i)}
                        >
                            <T.CylinderGeometry args={[0.1, 0.1, 1, 16]} />
                            <T.MeshStandardMaterial
                                color="#ccc"
                                metalness={0.8}
                            />
                        </T.Mesh>
                        <T.Mesh
                            position={[0, 0, 0.5]}
                            on:click={() => pullKnob(i)}
                        >
                            <T.SphereGeometry args={[0.2]} />
                            <T.MeshStandardMaterial color="#fff" />
                        </T.Mesh>
                    </T.Group>
                </T.Group>
            {/each}
        </T.Group>

        <!-- FLAP AT BOTTOM -->
        <T.Mesh position={[0, -0.5, 0.3]} rotation={[0.4, 0, 0]}>
            <T.BoxGeometry args={[4, 0.5, 0.1]} />
            <T.MeshStandardMaterial color="#444" />
        </T.Mesh>
    </Canvas>

    <div class="instructions">
        <p>Pull the Knobs to Dispense</p>
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
