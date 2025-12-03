<script>
    import { T } from "@threlte/core";
    import {
        ContactShadows,
        Float,
        Grid,
        OrbitControls,
        useGltf,
    } from "@threlte/extras";

    const gltf = useGltf("/media/judo gltb/judo_textured.glb");
</script>

<T.PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50}>
    <OrbitControls enableDamping />
</T.PerspectiveCamera>

<T.DirectionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
<T.AmbientLight intensity={0.5} />

<T.Group position={[0, -1, 0]}>
    {#await gltf}
        <slot name="fallback" />
    {:then value}
        <T is={value.scene} />
    {:catch error}
        <slot name="error" {error} />
    {/await}
</T.Group>

<Grid
    position.y={-1}
    infiniteGrid
    sectionColor="#4a4a4a"
    cellColor="#2a2a2a"
    fadeDistance={20}
/>
