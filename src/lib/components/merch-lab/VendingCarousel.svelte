<script lang="ts">
    import { Canvas, T } from "@threlte/core";
    import { Environment, OrbitControls, Text } from "@threlte/extras";
    import { degToRad } from "three/src/math/MathUtils.js";
    import { type Spring, spring } from "svelte/motion";
    import { get } from "svelte/store";
    import * as THREE from "three";

    export let isActive = false;

    // --- DATA ---
    const tiers = 4;
    const itemsPerTier = 6;
    const tierSpacing = 1.2;

    // Each tier needs its own rotation state
    const tierRotations = spring(Array(tiers).fill(0), {
        stiffness: 0.05,
        damping: 0.4,
    });

    const spinTier = (index: number) => {
        tierRotations.update(($r) => {
            const newR = [...$r];
            newR[index] += 360 / itemsPerTier;
            return newR;
        });
    };

    const spinAll = () => {
        tierRotations.update(($r) => {
            return $r.map((r) => r + 360 / itemsPerTier);
        });
    };

    let isDoorOpen = false;
    const doorY = spring(0, { stiffness: 0.1, damping: 0.6 });

    const toggleDoor = () => {
        isDoorOpen = !isDoorOpen;
        doorY.set(isDoorOpen ? 2 : 0);
    };
</script>

<div class="machine-container">
    <Canvas>
        <T.PerspectiveCamera makeDefault position={[3, 2, 5]} fov={50}>
            <OrbitControls target={[0, 1, 0]} enableZoom={true} />
        </T.PerspectiveCamera>

        <T.AmbientLight intensity={0.5} />
        <T.SpotLight
            position={[0, 10, 5]}
            intensity={2}
            angle={0.3}
            penumbra={1}
            castShadow
        />
        <Environment preset="city" />

        <!-- CAROUSEL UNIT -->
        <T.Group position={[0, -2, 0]}>
            <!-- CENTRAL PILLAR -->
            <T.Mesh position={[0, 2.5, 0]}>
                <T.CylinderGeometry args={[0.2, 0.2, 6, 16]} />
                <T.MeshStandardMaterial color="#666" metalness={0.8} />
            </T.Mesh>

            <!-- TIERS -->
            {#each $tierRotations as rot, i}
                <T.Group
                    position={[0, i * tierSpacing + 0.5, 0]}
                    rotation={[0, degToRad(rot), 0]}
                >
                    <!-- PLATTER -->
                    <T.Mesh receiveShadow>
                        <T.CylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
                        <T.MeshStandardMaterial color="#eee" />
                    </T.Mesh>

                    <!-- DIVIDERS & ITEMS -->
                    {#each Array(itemsPerTier) as _, j}
                        <T.Group
                            rotation={[
                                0,
                                degToRad(j * (360 / itemsPerTier)),
                                0,
                            ]}
                        >
                            <!-- Divider Wall -->
                            <T.Mesh
                                position={[0.8, 0.3, 0]}
                                rotation={[0, 0, 0]}
                            >
                                <T.BoxGeometry args={[1.4, 0.6, 0.05]} />
                                <T.MeshStandardMaterial
                                    color="#ccc"
                                    transparent
                                    opacity={0.5}
                                />
                            </T.Mesh>

                            <!-- ITEM -->
                            <T.Mesh position={[1, 0.4, 0.4]} castShadow>
                                <T.BoxGeometry args={[0.4, 0.4, 0.4]} />
                                <T.MeshStandardMaterial
                                    color={`hsl(${i * 50 + j * 30}, 60%, 50%)`}
                                />
                            </T.Mesh>
                        </T.Group>
                    {/each}
                </T.Group>

                <!-- SPIN BUTTON FOR THIS TIER -->
                <T.Group
                    position={[1.8, i * tierSpacing + 0.5, 0.8]}
                    rotation={[0, degToRad(30), 0]}
                >
                    <T.Mesh
                        on:click={() => spinTier(i)}
                        rotation={[degToRad(90), 0, 0]}
                    >
                        <T.CylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
                        <T.MeshStandardMaterial color="#d00" />
                    </T.Mesh>
                    <Text
                        text="SPIN"
                        fontSize={0.1}
                        color="white"
                        position={[0, 0, 0.06]}
                        anchorX="center"
                        anchorY="middle"
                    />
                </T.Group>
            {/each}

            <!-- GLASS DOOR (Curved?) -->
            <!-- Creating a curved glass panel is tricky with basic geometries. Using opacity box for now or multiple planes. OR Cylinder segment -->
            <T.Group position={[0, 2.5, 0]} rotation={[0, degToRad(30), 0]}>
                <!-- Simplified sliding door - just moves UP -->
                <T.Group position={[0, $doorY, 1.6]}>
                    <T.Mesh>
                        <T.PlaneGeometry args={[2, 5]} />
                        <T.MeshPhysicalMaterial
                            color="#aaf"
                            transmission={0.8}
                            metalness={0.1}
                            roughness={0.1}
                            side={THREE.DoubleSide}
                            transparent
                        />
                    </T.Mesh>
                    <!-- Handle -->
                    <T.Mesh position={[0.5, 0, 0.1]} on:click={toggleDoor}>
                        <T.BoxGeometry args={[0.1, 0.5, 0.1]} />
                        <T.MeshStandardMaterial color="#333" />
                    </T.Mesh>
                </T.Group>
            </T.Group>
        </T.Group>
    </Canvas>

    <div class="instructions">
        <p>Click Red Buttons to Rotate Tiers. Click Handle to Open Door.</p>
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
