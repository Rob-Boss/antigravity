<script lang="ts">
    import { Canvas, T } from "@threlte/core";
    import { Environment, OrbitControls } from "@threlte/extras";
    import * as THREE from "three";

    export let isActive = false;
</script>

<div class="demo-container">
    <Canvas>
        <T.PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50}>
            <OrbitControls enableZoom={true} />
        </T.PerspectiveCamera>

        <!-- Lighting -->
        <T.DirectionalLight position={[5, 10, 5]} intensity={2} />
        <T.AmbientLight intensity={0.5} />

        <!-- Environment for Reflections/Refraction -->
        <Environment preset="city" />

        <!-- Glass Object -->
        <T.Mesh position={[0, 0, 0]}>
            <!-- Icosahedron for interesting refractions -->
            <T.IcosahedronGeometry args={[1, 0]} />
            <T.MeshPhysicalMaterial
                color="white"
                roughness={0.05}
                metalness={0.0}
                transmission={0.95}
                thickness={2.0}
                ior={1.5}
                clearcoat={1.0}
                clearcoatRoughness={0.05}
            />
        </T.Mesh>

        <!-- Object BEHIND the glass to show refraction -->
        <T.Mesh position={[-1, -0.5, -2]}>
            <T.BoxGeometry args={[0.5, 4, 0.5]} />
            <T.MeshStandardMaterial color="#ff5555" />
        </T.Mesh>

        <T.Mesh position={[1, 0.5, -2]}>
            <T.SphereGeometry args={[0.5]} />
            <T.MeshStandardMaterial color="#5555ff" />
        </T.Mesh>
    </Canvas>

    <div class="overlay">
        <h3>Glass Material Demo</h3>
        <p>Using <code>MeshPhysicalMaterial</code> with Transmission.</p>
        <p class="note">
            Yes, Shape Keys (Morph Targets) are fully supported in
            Three.js/Threlte. You animate them via <code
                >mesh.morphTargetInfluences</code
            >.
        </p>
    </div>
</div>

<style>
    .demo-container {
        width: 100%;
        height: 100%;
        background: #111; /* Dark bg to make glass pop? Or checkerboard? */
        position: relative;
    }
    .overlay {
        position: absolute;
        bottom: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.7);
        padding: 20px;
        border-radius: 8px;
        color: #eee;
        pointer-events: none;
    }
    h3 {
        margin: 0 0 10px 0;
        color: #fff;
    }
    p {
        margin: 5px 0;
        font-size: 0.9rem;
        color: #ccc;
    }
    .note {
        color: #8f8;
        font-weight: bold;
        margin-top: 10px;
    }
</style>
