<script lang="ts">
    import { Canvas, T } from "@threlte/core";
    import { Environment, OrbitControls, Text } from "@threlte/extras";
    import { spring } from "svelte/motion";
    import * as THREE from "three";

    export let isActive = false;

    // A chest freezer style or upright
    // Let's do Upright Glass Door with Frost

    const frostOpacity = spring(0.5);

    const wipe = () => {
        frostOpacity.set(0).then(() => {
            setTimeout(() => frostOpacity.set(0.6), 2000); // Frost returns
        });
    };

    // Items
    const items = [
        {
            name: "POPSICLE",
            pos: [-0.6, 0.5, 0] as [number, number, number],
            color: "#f0f",
        },
        {
            name: "CONE",
            pos: [0.6, 0.5, 0] as [number, number, number],
            color: "#fa0",
        },
        {
            name: "SANDWICH",
            pos: [-0.6, -0.5, 0] as [number, number, number],
            color: "#852",
        },
        {
            name: "TUB",
            pos: [0.6, -0.5, 0] as [number, number, number],
            color: "#0ff",
        },
    ];
</script>

<div class="machine-container">
    <Canvas>
        <T.PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50}>
            <OrbitControls target={[0, 0, 0]} enableZoom={true} />
        </T.PerspectiveCamera>

        <T.AmbientLight intensity={0.6} />
        <T.DirectionalLight
            position={[5, 5, 5]}
            intensity={1.5}
            color="#ccffff"
        />
        <!-- Cold Light -->
        <Environment preset="city" />

        <!-- FREEZER BODY -->
        <T.Mesh position={[0, 0, -0.5]}>
            <T.BoxGeometry args={[3, 4, 2]} />
            <T.MeshStandardMaterial color="#eee" roughness={0.1} />
        </T.Mesh>

        <!-- INTERIOR ITEMS -->
        {#each items as item}
            <T.Mesh position={item.pos} rotation={[0.4, 0, 0]}>
                <T.BoxGeometry args={[0.8, 0.8, 0.2]} />
                <T.MeshStandardMaterial color={item.color} />
                <Text
                    text={item.name}
                    fontSize={0.15}
                    color="white"
                    position={[0, 0, 0.11]}
                    anchorX="center"
                    anchorY="middle"
                />
            </T.Mesh>
        {/each}

        <!-- FOG / CALD -->
        <!-- Just colored lights for now -->

        <!-- FROSTED GLASS DOOR -->
        <T.Mesh position={[0, 0, 0.6]} on:click={wipe}>
            <T.BoxGeometry args={[2.5, 3.5, 0.1]} />
            <T.MeshPhysicalMaterial
                color="#fff"
                transmission={0.9}
                opacity={1}
                roughness={$frostOpacity}
                metalness={0.1}
                thickness={0.5}
                transparent
            />
        </T.Mesh>
    </Canvas>

    <div class="instructions">
        <p>Click Glass to Wipe Frost</p>
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
        color: #88f;
        font-size: 0.8rem;
        pointer-events: none;
    }
</style>
