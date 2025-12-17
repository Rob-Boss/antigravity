<script lang="ts">
    import { Canvas, T } from "@threlte/core";
    import { Environment, OrbitControls, Text } from "@threlte/extras";
    import { spring } from "svelte/motion";
    import * as THREE from "three";

    export let isActive = false;

    // Featureless black slab.
    // On hover/click, a section glows or slides out.

    const drawerZ = spring(0);
    const glow = spring(0);

    const activate = () => {
        glow.set(2).then(() => {
            drawerZ.set(1.5).then(() => {
                setTimeout(() => {
                    drawerZ.set(0);
                    glow.set(0);
                }, 2000);
            });
        });
    };
</script>

<div class="machine-container">
    <Canvas>
        <T.PerspectiveCamera makeDefault position={[0, 2, 6]} fov={50}>
            <OrbitControls target={[0, 1, 0]} enableZoom={true} />
        </T.PerspectiveCamera>

        <T.AmbientLight intensity={0.1} />
        <Environment preset="night" />

        <!-- THE MONOLITH -->
        <T.Group on:click={activate}>
            <T.Mesh position={[0, 2, 0]}>
                <T.BoxGeometry args={[3, 6, 1]} />
                <T.MeshPhysicalMaterial
                    color="#000"
                    roughness={0.1}
                    metalness={0.9}
                    clearcoat={1}
                />
            </T.Mesh>

            <!-- GLOW STRIP -->
            <T.Mesh position={[0, 3, 0.51]}>
                <T.PlaneGeometry args={[2.8, 0.1]} />
                <T.MeshBasicMaterial
                    color="#0ff"
                    transparent
                    opacity={$glow > 1 ? 1 : 0}
                />
            </T.Mesh>

            <!-- DRAWER -->
            <T.Group position={[0, 1, 0.5 + $drawerZ]}>
                <T.Mesh>
                    <T.BoxGeometry args={[2, 0.5, 1]} />
                    <T.MeshStandardMaterial color="#111" />
                </T.Mesh>
                <!-- ITEM -->
                <T.Mesh position={[0, 0.5, 0]}>
                    <T.OctahedronGeometry args={[0.3]} />
                    <T.MeshBasicMaterial wireframe color="#0ff" />
                </T.Mesh>
            </T.Group>
        </T.Group>
    </Canvas>

    <div class="instructions">
        <p>Touch the Monolith</p>
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
        color: #444;
        font-size: 0.8rem;
        pointer-events: none;
    }
</style>
