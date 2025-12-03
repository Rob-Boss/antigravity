<script lang="ts">
    import { T } from "@threlte/core";
    import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
</script>

<!-- Main Fridge Body -->
<T.Mesh position={[0, 0, 0]}>
    <T is={RoundedBoxGeometry} args={[2, 3.5, 1, 4, 0.15]} />
    <T.MeshStandardMaterial color="#98ff98" roughness={0.5} metalness={0.0} />
</T.Mesh>

<!-- Fridge Door (Bottom) -->
<T.Mesh position={[0, -0.45, 0.52]}>
    <T is={RoundedBoxGeometry} args={[1.85, 2.4, 0.05, 4, 0.03]} />
    <T.MeshStandardMaterial color="#b0ffb0" roughness={0.5} metalness={0.0} />
</T.Mesh>

<!-- Freezer Door (Top) -->
<T.Mesh position={[0, 1.2, 0.52]}>
    <T is={RoundedBoxGeometry} args={[1.85, 0.9, 0.05, 4, 0.03]} />
    <T.MeshStandardMaterial color="#b0ffb0" roughness={0.5} metalness={0.0} />
</T.Mesh>

<!-- Fridge Handle -->
<T.Mesh position={[-0.8, -0.15, 0.6]}>
    <T is={RoundedBoxGeometry} args={[0.05, 1.0, 0.05, 4, 0.02]} />
    <T.MeshStandardMaterial color="#ffffff" roughness={0.5} metalness={0.0} />
</T.Mesh>

<!-- Freezer Handle -->
<T.Mesh position={[-0.8, 1.0, 0.6]}>
    <T is={RoundedBoxGeometry} args={[0.05, 0.5, 0.05, 4, 0.02]} />
    <T.MeshStandardMaterial color="#ffffff" roughness={0.5} metalness={0.0} />
</T.Mesh>
