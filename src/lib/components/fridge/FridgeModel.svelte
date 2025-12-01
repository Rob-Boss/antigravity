<script lang="ts">
    import { T } from "@threlte/core";
    import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
</script>

<!-- Main Fridge Body -->
<T.Mesh position={[0, 0, 0]}>
    <T is={RoundedBoxGeometry} args={[2, 3.5, 1, 4, 0.1]} />
    <T.MeshStandardMaterial color="#f2e8d5" roughness={0.4} metalness={0.1} />
</T.Mesh>

<!-- Fridge Door (Bottom) -->
<T.Mesh position={[0, -0.5, 0.52]}>
    <T is={RoundedBoxGeometry} args={[1.95, 2.4, 0.05, 4, 0.02]} />
    <T.MeshStandardMaterial color="#fdfdd0" roughness={0.3} metalness={0.05} />
</T.Mesh>

<!-- Freezer Door (Top) -->
<T.Mesh position={[0, 1.15, 0.52]}>
    <T is={RoundedBoxGeometry} args={[1.95, 0.9, 0.05, 4, 0.02]} />
    <T.MeshStandardMaterial color="#fdfdd0" roughness={0.3} metalness={0.05} />
</T.Mesh>

<!-- Fridge Handle -->
<T.Mesh position={[-0.8, -0.2, 0.6]}>
    <T is={RoundedBoxGeometry} args={[0.05, 1.0, 0.05, 4, 0.01]} />
    <T.MeshStandardMaterial color="#cccccc" roughness={0.3} metalness={0.8} />
</T.Mesh>

<!-- Freezer Handle -->
<T.Mesh position={[-0.8, 0.95, 0.6]}>
    <T is={RoundedBoxGeometry} args={[0.05, 0.5, 0.05, 4, 0.01]} />
    <T.MeshStandardMaterial color="#cccccc" roughness={0.3} metalness={0.8} />
</T.Mesh>
