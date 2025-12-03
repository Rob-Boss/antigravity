<script lang="ts">
    import { T } from "@threlte/core";
    import { OrbitControls, Environment, HTML } from "@threlte/extras";
    import FridgeObject from "./FridgeObject.svelte";
    import Sequencer from "$lib/components/Sequencer.svelte";

    // Camera controls
    let controls: any;
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50}>
    <OrbitControls
        bind:ref={controls}
        enableDamping
        dampingFactor={0.1}
        minDistance={2}
        maxDistance={15}
    />
</T.PerspectiveCamera>

<T.DirectionalLight position={[5, 5, 10]} intensity={1} />
<T.AmbientLight intensity={0.5} />
<Environment preset="studio" />

<!-- The Fridge (Left) -->
<FridgeObject position={[-2.5, 0, 0]} />

<!-- The Sequencer (Right) - Diegetic UI -->
<!-- 
    We place it on a "table" or just floating in space.
    transform: applies 3D transforms to the HTML element to match the scene.
    pointerEvents: 'auto' ensures we can click buttons.
-->
<T.Group position={[2.5, 0, 0]}>
    <HTML
        transform
        pointerEvents="auto"
        position={[0, 0, 0]}
        occlude="blending"
    >
        <div class="sequencer-wrapper">
            <Sequencer />
        </div>
    </HTML>

    <!-- A backing plate for the sequencer so it looks like a device -->
    <T.Mesh position={[0, 0, -0.1]}>
        <T.BoxGeometry args={[4.2, 3.2, 0.1]} />
        <T.MeshStandardMaterial color="#222" />
    </T.Mesh>
</T.Group>

<style>
    .sequencer-wrapper {
        width: 800px;
        height: 600px;
        /* We scale it down in 3D space via the HTML component's scale prop if needed, 
           or just let it be huge and move the camera back. 
           Threlte's HTML transform usually maps 1px = 1 unit unless scaled. 
           Actually, default is usually 1px = 0.01 units or similar depending on implementation.
           Let's verify scale. usually we need to scale down the HTML group.
        */
        transform: scale(
            0.005
        ); /* Scale down the HTML to fit in 3D world units */
    }
</style>
