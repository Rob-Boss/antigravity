<script lang="ts">
    import { T } from "@threlte/core";
    import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
    import type { FridgeConfig } from "./fridgeVariations";

    export let config: FridgeConfig;

    $: radius = config.radius || 0.1;
    $: handleRadius = config.handleRadius || 0.01;
    $: envMapIntensity = config.envMapIntensity || 1.0;
</script>

<!-- Main Fridge Body -->
<T.Mesh position={[0, 0, 0]}>
    <T is={RoundedBoxGeometry} args={[2, 3.5, 1, 4, radius]} />
    <T.MeshStandardMaterial
        color={config.bodyColor}
        roughness={config.roughness}
        metalness={config.metalness}
        {envMapIntensity}
    />
</T.Mesh>

<!-- Fridge Door (Bottom) -->
<T.Mesh position={[0, -0.45, 0.52]}>
    <T is={RoundedBoxGeometry} args={[1.85, 2.4, 0.05, 4, radius * 0.2]} />
    <T.MeshStandardMaterial
        color={config.doorColor}
        roughness={config.roughness}
        metalness={config.metalness}
        {envMapIntensity}
    />
</T.Mesh>

<!-- Freezer Door (Top) -->
<T.Mesh position={[0, 1.2, 0.52]}>
    <T is={RoundedBoxGeometry} args={[1.85, 0.9, 0.05, 4, radius * 0.2]} />
    <T.MeshStandardMaterial
        color={config.doorColor}
        roughness={config.roughness}
        metalness={config.metalness}
        {envMapIntensity}
    />
</T.Mesh>

<!-- Fridge Handle -->
<T.Mesh position={[-0.8, -0.15, 0.6]}>
    <T is={RoundedBoxGeometry} args={[0.05, 1.0, 0.05, 4, handleRadius]} />
    <T.MeshStandardMaterial
        color={config.handleColor}
        roughness={config.roughness}
        metalness={config.metalness}
        {envMapIntensity}
    />
</T.Mesh>

<!-- Freezer Handle -->
<T.Mesh position={[-0.8, 1.0, 0.6]}>
    <T is={RoundedBoxGeometry} args={[0.05, 0.5, 0.05, 4, handleRadius]} />
    <T.MeshStandardMaterial
        color={config.handleColor}
        roughness={config.roughness}
        metalness={config.metalness}
        {envMapIntensity}
    />
</T.Mesh>
