<script lang="ts">
    import { Canvas, T } from "@threlte/core";
    import { Environment, OrbitControls, Text } from "@threlte/extras";
    import { degToRad } from "three/src/math/MathUtils.js";
    import { tweened } from "svelte/motion";
    import { cubicOut } from "svelte/easing";
    import * as THREE from "three";

    export let isActive = false;

    // --- STATE ---
    let isCranking = false;
    let crankRotation = tweened(0, { duration: 1000, easing: cubicOut });

    // Capsules
    const capsuleColors = [
        "#FF5555",
        "#55AAFF",
        "#55FF55",
        "#FFFF55",
        "#FF55FF",
        "#55FFFF",
    ];
    const capsules = Array.from({ length: 30 }).map((_, i) => {
        // Random position inside sphere r=1.8 (approx)
        // Simple rejection sampling
        let x, y, z, d;
        do {
            x = (Math.random() - 0.5) * 3.4;
            y = (Math.random() - 0.5) * 3.4;
            z = (Math.random() - 0.5) * 3.4;
            d = Math.sqrt(x * x + y * y + z * z);
        } while (d > 1.6);

        return {
            id: i,
            pos: [x, y, z] as [number, number, number],
            color: capsuleColors[
                Math.floor(Math.random() * capsuleColors.length)
            ],
            rot: [Math.random() * 3, Math.random() * 3, Math.random() * 3] as [
                number,
                number,
                number,
            ],
        };
    });

    let dispensedCapsule: { color: string } | null = null;
    let dispY = tweened(-2);

    const crank = () => {
        if (isCranking) return;
        isCranking = true;
        dispensedCapsule = null;

        // Spin Crank
        crankRotation.set($crankRotation + degToRad(360)).then(() => {
            // Drop Logic
            const color =
                capsuleColors[Math.floor(Math.random() * capsuleColors.length)];
            dispensedCapsule = { color };
            dispY.set(-2, { duration: 0 }); // Reset
            dispY.set(-4, { duration: 500, easing: cubicOut }).then(() => {
                setTimeout(() => {
                    alert(`Capsule Opened: It's a ${color} item!`);
                    isCranking = false;
                }, 500);
            });
        });
    };
</script>

<div class="machine-container">
    <Canvas>
        <T.PerspectiveCamera makeDefault position={[0, 4, 8]} fov={45}>
            <OrbitControls target={[0, 1, 0]} enableZoom={true} />
        </T.PerspectiveCamera>

        <T.DirectionalLight position={[5, 10, 5]} intensity={2} castShadow />
        <T.AmbientLight intensity={0.5} />
        <Environment preset="city" />

        <!-- GACHA MACHINE -->
        <T.Group position={[0, -2, 0]}>
            <!-- BASE (Red Plastic) -->
            <T.Mesh position={[0, 0, 0]} castShadow receiveShadow>
                <T.CylinderGeometry args={[2, 2.2, 3, 32]} />
                <T.MeshStandardMaterial color="#d00" roughness={0.3} />
            </T.Mesh>

            <!-- PLATE (Metal) -->
            <T.Mesh position={[0, 1.55, 0]}>
                <T.CylinderGeometry args={[2.1, 2.1, 0.1, 32]} />
                <T.MeshStandardMaterial
                    color="#888"
                    metalness={0.8}
                    roughness={0.2}
                />
            </T.Mesh>

            <!-- GLOBE (Glass) -->
            <T.Mesh position={[0, 3.5, 0]}>
                <T.SphereGeometry args={[2, 32, 32]} />
                <T.MeshPhysicalMaterial
                    color="#ffffff"
                    transmission={0.9}
                    opacity={1}
                    roughness={0.05}
                    ior={1.5}
                    thickness={0.1}
                    clearcoat={1}
                    transparent
                />
            </T.Mesh>

            <!-- CAPSULES INSIDE -->
            <T.Group position={[0, 3.5, 0]}>
                {#each capsules as cap}
                    <T.Mesh position={cap.pos} rotation={cap.rot}>
                        <!-- Half Red / Half White capsule style? Just solid for now -->
                        <T.SphereGeometry args={[0.25, 16, 16]} />
                        <T.MeshStandardMaterial
                            color={cap.color}
                            roughness={0.4}
                        />
                    </T.Mesh>
                {/each}
            </T.Group>

            <!-- CRANK MECH (Front) -->
            <T.Group position={[0, 0, 2.1]}>
                <!-- Backplate -->
                <T.Mesh rotation={[degToRad(90), 0, 0]}>
                    <T.CylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
                    <T.MeshStandardMaterial color="#ccc" metalness={0.5} />
                </T.Mesh>

                <!-- HANDLE (Rotates) -->
                <T.Group rotation={[0, 0, -$crankRotation]}>
                    <T.Mesh
                        rotation={[degToRad(90), 0, 0]}
                        position={[0, 0, 0.1]}
                        on:click={crank}
                    >
                        <T.BoxGeometry args={[0.2, 1.4, 0.1]} />
                        <!-- Bar -->
                        <T.MeshStandardMaterial color="#eee" />
                    </T.Mesh>
                    <!-- Knob -->
                    <T.Mesh position={[0, -0.6, 0.3]} on:click={crank}>
                        <T.SphereGeometry args={[0.15]} />
                        <T.MeshStandardMaterial color="#d00" />
                    </T.Mesh>
                </T.Group>

                <!-- LABEL -->
                <Text
                    text="TURN"
                    fontSize={0.2}
                    color="white"
                    position={[0, 1, 0]}
                    anchorX="center"
                    anchorY="middle"
                />
            </T.Group>

            <!-- CHUTE (Bottom) -->
            <T.Mesh position={[0, -1, 1.8]} rotation={[degToRad(45), 0, 0]}>
                <T.BoxGeometry args={[1, 0.1, 1]} />
                <T.MeshStandardMaterial color="#222" />
            </T.Mesh>

            <!-- DISPENSED CAPSULE -->
            {#if dispensedCapsule}
                <T.Mesh position={[0, $dispY, 2.2]}>
                    <T.SphereGeometry args={[0.3]} />
                    <T.MeshStandardMaterial color={dispensedCapsule.color} />
                </T.Mesh>
            {/if}
        </T.Group>
    </Canvas>

    <div class="instructions">
        <p>Click the Crank to Spin</p>
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
        color: #666;
        font-size: 0.8rem;
        pointer-events: none;
        text-align: center;
    }
</style>
