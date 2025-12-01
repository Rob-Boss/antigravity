<script lang="ts">
    import { T, useTask } from "@threlte/core";
    import {
        OrbitControls,
        Grid,
        Text,
        Float,
        ContactShadows,
    } from "@threlte/extras";
    import { guestbookEntries, type GuestbookEntry } from "$lib/stores";
    import { onMount } from "svelte";
    import * as THREE from "three";

    // Camera controls
    let rotation = 0;
    useTask((delta) => {
        rotation += delta * 0.1;
    });

    const fontUrl =
        "https://fonts.gstatic.com/s/vt323/v17/pxiKyp0ihIEF2isRF5XF.woff2"; // VT323 font
</script>

<T.PerspectiveCamera
    makeDefault
    position={[10, 10, 10]}
    fov={50}
    on:create={({ ref }) => {
        ref.lookAt(0, 0, 0);
    }}
>
    <OrbitControls
        enableDamping
        autoRotate={true}
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2 - 0.1}
    />
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.5} />
<T.DirectionalLight position={[10, 10, 5]} intensity={1.5} color="#00ff00" />
<T.PointLight position={[-10, -10, -5]} intensity={1} color="#00ffff" />

<!-- The Floor -->
<Grid
    position={[0, -2, 0]}
    infiniteGrid
    sectionColor="#00ff00"
    sectionThickness={1}
    cellColor="#003300"
    cellThickness={0.5}
    fadeDistance={50}
    followCamera
/>

<!-- Central Monolith / Terminal -->
<T.Group position={[0, 0, 0]}>
    <!-- Base -->
    <T.Mesh position={[0, -1, 0]}>
        <T.CylinderGeometry args={[2, 2.5, 2, 8]} />
        <T.MeshStandardMaterial color="#111" wireframe />
    </T.Mesh>

    <!-- Hologram Beam -->
    <T.Mesh position={[0, 2, 0]}>
        <T.CylinderGeometry args={[0.1, 2, 6, 16]} />
        <T.MeshBasicMaterial
            color="#00ff00"
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
        />
    </T.Mesh>

    <!-- Floating Title -->
    <Float floatIntensity={2} rotationIntensity={1} speed={2}>
        <Text
            text="GUEST_NET"
            fontSize={1.5}
            position={[0, 2.5, 0]}
            color="#00ff00"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#003300"
        />
    </Float>
</T.Group>

<!-- Floating Entries -->
{#each $guestbookEntries.slice(0, 15) as entry, i (entry.id)}
    {@const angle = (i / $guestbookEntries.length) * Math.PI * 2}
    {@const radius = 6 + Math.random() * 2}
    {@const x = Math.cos(angle) * radius}
    {@const z = Math.sin(angle) * radius}
    {@const y = Math.random() * 4 - 1}

    <Float
        position={[x, y, z]}
        floatIntensity={1}
        rotationIntensity={0.5}
        speed={1 + Math.random()}
    >
        <T.Group lookAt={[0, 0, 0]}>
            <!-- Debug Cube (Visible if text fails) -->
            <T.Mesh position={[0, 1.5, 0]}>
                <T.BoxGeometry args={[0.2, 0.2, 0.2]} />
                <T.MeshBasicMaterial color="red" wireframe />
            </T.Mesh>

            <!-- Background Panel -->
            <T.Mesh position={[0, 0, -0.1]}>
                <T.PlaneGeometry args={[4, 2]} />
                <T.MeshBasicMaterial
                    color="#001100"
                    transparent
                    opacity={0.8}
                    side={THREE.DoubleSide}
                />
            </T.Mesh>

            <!-- Wireframe Border -->
            <T.LineSegments>
                <T.EdgesGeometry args={[new THREE.PlaneGeometry(4, 2)]} />
                <T.LineBasicMaterial color="#00ff00" linewidth={1} />
            </T.LineSegments>

            <!-- Message Text -->
            <Text
                text={entry.message}
                fontSize={0.3}
                maxWidth={3.5}
                lineHeight={1.2}
                position={[0, 0.3, 0]}
                color="#ccffcc"
                anchorX="center"
                anchorY="middle"
                textAlign="center"
            />

            <!-- Author Text -->
            <Text
                text={`> ${entry.name}`}
                fontSize={0.25}
                position={[0, -0.6, 0]}
                color="#00ff00"
                anchorX="center"
                anchorY="middle"
            />
        </T.Group>
    </Float>
{/each}

<!-- Background Particles -->
{#each { length: 100 } as _, i}
    <T.Mesh
        position={[
            Math.random() * 40 - 20,
            Math.random() * 40 - 20,
            Math.random() * 40 - 20,
        ]}
    >
        <T.BoxGeometry args={[0.05, 0.05, 0.05]} />
        <T.MeshBasicMaterial color="#00ff00" transparent opacity={0.4} />
    </T.Mesh>
{/each}

<!-- Post Processing (Bloom) - Note: Threlte v6+ handles this differently, usually via <EffectComposer> -->
<!-- For simplicity in this first pass, we'll stick to standard glowing materials and basic scene -->
