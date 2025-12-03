<script>
    import { Canvas } from "@threlte/core";
    import Scene from "./Scene.svelte";
</script>

<div class="h-screen w-full bg-gray-900 text-white">
    <Canvas>
        <Scene />
    </Canvas>
    <div
        class="absolute top-4 left-4 p-4 bg-black/50 rounded pointer-events-none"
    >
        <h1 class="text-2xl font-bold">Judo Model Viewer</h1>
        <p>Left click to rotate, right click to pan, scroll to zoom.</p>
    </div>
</div>
