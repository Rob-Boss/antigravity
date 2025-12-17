<script lang="ts">
    import { Canvas, T } from "@threlte/core";
    import { Environment, OrbitControls, Text } from "@threlte/extras";
    import { tweened } from "svelte/motion";
    import { cubicInOut } from "svelte/easing";
    import * as THREE from "three";

    export let isActive = false;

    // --- DATA ---
    const buttons = [
        { id: "COLA", color: "#d00", pos: [-1, 2, 0] },
        { id: "FIZZ", color: "#0d0", pos: [1, 2, 0] },
        { id: "SODA", color: "#00d", pos: [-1, 0, 0] },
        { id: "WATER", color: "#0dd", pos: [1, 0, 0] },
    ];

    const canY = tweened(10); // Start hidden high up
    let currentCanColor = "#fff";

    const pressButton = (btn: any) => {
        currentCanColor = btn.color;
        // Drop animation
        canY.set(3, { duration: 0 }); // Init
        canY.set(-2, { duration: 800, easing: cubicInOut }); // Fall
    };
</script>

<div class="machine-container">
    <Canvas>
        <T.PerspectiveCamera makeDefault position={[0, 1, 6]} fov={50}>
            <OrbitControls target={[0, 1, 0]} enableZoom={true} />
        </T.PerspectiveCamera>

        <T.AmbientLight intensity={0.5} />
        <T.PointLight position={[0, 5, 5]} intensity={2} />
        <Environment preset="city" />

        <!-- CURVED FRONT PANEL -->
        <T.Mesh position={[0, 1, 0]} receiveShadow>
            <T.BoxGeometry args={[4, 5, 2]} />
            <T.MeshStandardMaterial
                color="#ddd"
                roughness={0.1}
                metalness={0.5}
            />
        </T.Mesh>

        <!-- BUTTONS -->
        {#each buttons as btn}
            <T.Group position={[btn.pos[0], btn.pos[1], 1]}>
                <!-- Button Body -->
                <T.Mesh on:click={() => pressButton(btn)} scale={0.8}>
                    <T.BoxGeometry args={[1.5, 1, 0.2]} />
                    <T.MeshStandardMaterial
                        color={btn.color}
                        emissive={btn.color}
                        emissiveIntensity={0.5}
                    />
                </T.Mesh>
                <!-- Label -->
                <Text
                    text={btn.id}
                    fontSize={0.3}
                    color="white"
                    position={[0, 0, 0.12]}
                    anchorX="center"
                    anchorY="middle"
                />
            </T.Group>
        {/each}

        <!-- DISPENSE SLOT -->
        <T.Mesh position={[0, -2, 1.1]}>
            <T.BoxGeometry args={[3, 1, 0.5]} />
            <T.MeshStandardMaterial color="#222" />
        </T.Mesh>

        <!-- FALLING CAN -->
        <T.Mesh position={[0, $canY, 1.5]} rotation={[0, 0, 0.5]}>
            <T.CylinderGeometry args={[0.3, 0.3, 0.8, 16]} />
            <T.MeshStandardMaterial
                color={currentCanColor}
                metalness={0.8}
                roughness={0.2}
            />
        </T.Mesh>
    </Canvas>

    <div class="instructions">
        <p>Smash the Giant Buttons</p>
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
