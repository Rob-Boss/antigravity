<script lang="ts">
    import { Canvas, T } from "@threlte/core";
    import { Environment, OrbitControls, Text } from "@threlte/extras";
    import { tweened } from "svelte/motion";
    import { cubicInOut } from "svelte/easing";
    import * as THREE from "three";

    export let isActive = false;

    // A wall of tubes.
    // Tube paths are complex to model with primitives, so we'll use a straight vertical tube for "delivery"
    // and some curved toruses for decoration.

    const capsuleY = tweened(5);

    const suck = () => {
        capsuleY.set(5, { duration: 0 }); // Reset
        capsuleY.set(-2, { duration: 600, easing: cubicInOut }); // WHOOSH down
    };
</script>

<div class="machine-container">
    <Canvas>
        <T.PerspectiveCamera makeDefault position={[0, 0, 7]} fov={50}>
            <OrbitControls target={[0, 0, 0]} enableZoom={true} />
        </T.PerspectiveCamera>

        <T.AmbientLight intensity={0.5} />
        <T.PointLight position={[0, 0, 5]} intensity={1} />
        <Environment preset="studio" />

        <!-- MAIN TUBE (Glass Cylinder) -->
        <T.Mesh position={[0, 0, 0]}>
            <T.CylinderGeometry args={[0.8, 0.8, 8, 32, 1, true]} />
            <!-- Open ended? -->
            <T.MeshPhysicalMaterial
                color="#fff"
                transmission={0.95}
                opacity={1}
                roughness={0.1}
                thickness={0.2}
                transparent
                side={THREE.DoubleSide}
            />
        </T.Mesh>

        <!-- CAPSULE -->
        <T.Group position={[0, $capsuleY, 0]}>
            <T.Mesh>
                <T.CylinderGeometry args={[0.5, 0.5, 1.5, 16]} />
                <T.MeshStandardMaterial color="#d40" />
            </T.Mesh>
            <T.Mesh position={[0, 0.8, 0]}>
                <T.SphereGeometry args={[0.5]} />
                <T.MeshStandardMaterial color="#d40" />
            </T.Mesh>
            <T.Mesh position={[0, -0.8, 0]}>
                <T.SphereGeometry args={[0.5]} />
                <T.MeshStandardMaterial color="#d40" />
            </T.Mesh>
        </T.Group>

        <!-- BUTTON -->
        <T.Mesh position={[2, 0, 0]} rotation={[1, 0, 0]} on:click={suck}>
            <T.CylinderGeometry args={[0.5, 0.5, 0.2]} />
            <T.MeshStandardMaterial color="red" />
            <Text
                text="SEND"
                fontSize={0.3}
                color="white"
                position={[0, 0.11, 0]}
                rotation={[-1.57, 0, 0]}
                anchorX="center"
                anchorY="middle"
            />
        </T.Mesh>

        <!-- DECORATIVE PIPES -->
        <T.Mesh position={[-2, 0, -2]} rotation={[0, 0, 0.5]}>
            <T.CylinderGeometry args={[0.5, 0.5, 10]} />
            <T.MeshStandardMaterial color="#888" metalness={0.8} />
        </T.Mesh>
    </Canvas>

    <div class="instructions">
        <p>Press SEND to Pneumatic Transfer</p>
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
