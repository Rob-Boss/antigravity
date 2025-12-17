<script lang="ts">
    import { Canvas, T } from "@threlte/core";
    import { Environment, OrbitControls, Text } from "@threlte/extras";
    import { spring } from "svelte/motion";
    import { degToRad } from "three/src/math/MathUtils.js";

    export let isActive = false;

    // --- DATA ---
    const rows = 3;
    const cols = 3;
    const items = [
        { id: "A1", name: "Tee", color: "#FF5555", row: 0, col: 0 },
        { id: "A2", name: "Hat", color: "#55AAFF", row: 0, col: 1 },
        { id: "A3", name: "LP", color: "#55FF55", row: 0, col: 2 },
        { id: "B1", name: "Stix", color: "#FFFF55", row: 1, col: 0 },
        { id: "B2", name: "Art", color: "#FF55FF", row: 1, col: 1 },
        { id: "B3", name: "Pin", color: "#55FFFF", row: 1, col: 2 },
        { id: "C1", name: "Hood", color: "#AAAAAA", row: 2, col: 0 },
        { id: "C2", name: "Mug", color: "#FFAA55", row: 2, col: 1 },
        { id: "C3", name: "Bag", color: "#AA55FF", row: 2, col: 2 },
    ];

    // --- STATE ---
    let selectedId = "";
    let dispensing = false;

    // --- LOGIC ---
    const selectItem = (id: string) => {
        if (dispensing) return;
        if (selectedId === id) {
            // Deselect
            selectedId = "";
        } else {
            selectedId = id;
        }
    };

    const dispense = () => {
        if (!selectedId || dispensing) return;
        dispensing = true;
        setTimeout(() => {
            alert("This is where the physical drop would happen! (Link opens)");
            dispensing = false;
            selectedId = "";
        }, 1500);
    };

    // --- LAYOUT HELPERS ---
    // Cabinet Size: 4w x 6h x 2d
    const shelfY = (row: number) => 2 - row * 1.5;
    const shelfX = (col: number) => -1 + col * 1;
</script>

<div class="machine-container">
    <Canvas>
        <T.PerspectiveCamera makeDefault position={[4, 3, 6]} fov={45}>
            <OrbitControls target={[0, 0, 0]} enableZoom={true} />
        </T.PerspectiveCamera>

        <T.AmbientLight intensity={0.5} />
        <T.SpotLight
            position={[0, 5, 5]}
            angle={0.5}
            penumbra={1}
            intensity={2}
            castShadow
        />

        <Environment preset="city" />

        <!-- VENDING MACHINE GROUP -->
        <T.Group position={[0, -1, 0]}>
            <!-- CABINET SHELL (Back & Sides) -->
            <T.Mesh position={[0, 1.5, -0.5]} castShadow receiveShadow>
                <T.BoxGeometry args={[3.5, 5.5, 2]} />
                <T.MeshStandardMaterial
                    color="#222"
                    roughness={0.2}
                    metalness={0.8}
                />
            </T.Mesh>

            <!-- INTERIOR SHELVES -->
            {#each items as item}
                <T.Group position={[shelfX(item.col), shelfY(item.row), 0]}>
                    <!-- PRODUCT -->
                    <T.Mesh position={[0, 0.3, 0]} castShadow>
                        <T.BoxGeometry args={[0.6, 0.6, 0.6]} />
                        <T.MeshStandardMaterial
                            color={item.color}
                            emissive={selectedId === item.id
                                ? item.color
                                : "#000"}
                            emissiveIntensity={0.5}
                        />
                        <!-- SIMPLE LABEL -->
                        <Text
                            text={item.name}
                            fontSize={0.2}
                            color="black"
                            position={[0, 0, 0.31]}
                            anchorX="center"
                            anchorY="middle"
                        />
                    </T.Mesh>

                    <!-- COIL (Simplified as Cylinder) -->
                    <T.Mesh position={[0, 0, -0.5]} rotation.z={degToRad(90)}>
                        <T.CylinderGeometry args={[0.1, 0.1, 1, 16]} />
                        <T.MeshStandardMaterial
                            color="#888"
                            metalness={0.9}
                            roughness={0.1}
                        />
                    </T.Mesh>

                    <!-- SHELF PLATE -->
                    <T.Mesh position={[0, -0.1, 0]}>
                        <T.BoxGeometry args={[0.9, 0.05, 1.8]} />
                        <T.MeshStandardMaterial color="#111" />
                    </T.Mesh>

                    <!-- ID TAG -->
                    <Text
                        text={item.id}
                        fontSize={0.2}
                        color="white"
                        position={[0, -0.3, 0.6]}
                        anchorX="center"
                        anchorY="middle"
                    />
                </T.Group>
            {/each}

            <!-- GLASS FRONT -->
            <T.Mesh position={[0, 1.5, 0.6]}>
                <T.BoxGeometry args={[3.2, 5.2, 0.1]} />
                <!-- Thin pane -->
                <T.MeshPhysicalMaterial
                    color="#ccffff"
                    transmission={0.95}
                    roughness={0.0}
                    metalness={0.0}
                    thickness={0.5}
                    ior={1.5}
                    transparent
                />
            </T.Mesh>

            <!-- SIDE CONTROL PANEL -->
            <T.Group position={[2.2, 1.5, 0]}>
                <!-- PANEL BODY -->
                <T.Mesh position={[0, 0, 0]}>
                    <T.BoxGeometry args={[0.8, 5, 0.5]} />
                    <T.MeshStandardMaterial color="#333" />
                </T.Mesh>

                <!-- KEYPAD BUTTONS -->
                {#each items as item}
                    <T.Mesh
                        position={[
                            0,
                            1.5 - item.row * 0.4 - (item.col > 1 ? 0 : 0),
                            0.3,
                        ]}
                        scale={0.15}
                        on:click={() => selectItem(item.id)}
                    >
                        <T.BoxGeometry args={[1, 1, 0.5]} />
                        <T.MeshStandardMaterial
                            color={selectedId === item.id ? "#f00" : "#555"}
                        />
                        <Text
                            text={item.id}
                            fontSize={0.5}
                            color="white"
                            position={[0, 0, 0.3]}
                            anchorX="center"
                            anchorY="middle"
                        />
                    </T.Mesh>
                {/each}

                <!-- DISPENSE BUTTON -->
                <T.Mesh position={[0, -1, 0.3]} scale={0.4} on:click={dispense}>
                    <T.CylinderGeometry
                        args={[0.5, 0.5, 0.2, 32]}
                        rotation={[degToRad(90), 0, 0]}
                    />
                    <T.MeshStandardMaterial
                        color={dispensing ? "#500" : "#d00"}
                    />
                    <Text
                        text="PUSH"
                        fontSize={0.3}
                        color="white"
                        position={[0, 0.2, 0]}
                        rotation={[-degToRad(90), 0, 0]}
                        anchorX="center"
                        anchorY="middle"
                    />
                </T.Mesh>

                <!-- DISPLAY SCREEN -->
                <T.Mesh position={[0, 2, 0.3]}>
                    <T.PlaneGeometry args={[0.6, 0.4]} />
                    <T.MeshBasicMaterial color="#000" />
                    <Text
                        text={dispensing ? "..." : selectedId || "RDY"}
                        fontSize={0.2}
                        color="#f00"
                        position={[0, 0, 0.01]}
                        anchorX="center"
                        anchorY="middle"
                        font="/fonts/Inter-Bold.json"
                    />
                </T.Mesh>
            </T.Group>
        </T.Group>
    </Canvas>

    <div class="instructions">
        <p>Use Mouse to Rotate/Zoom</p>
        <p>Click Buttons on the Panel</p>
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
        color: #666;
        font-size: 0.8rem;
        pointer-events: none;
        text-align: center;
    }
</style>
