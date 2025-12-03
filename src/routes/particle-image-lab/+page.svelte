<script lang="ts">
    import ParticleImage from "./ParticleImage.svelte";

    let density = 50;
    let localDensity = 50;
    let particleSize = 0.1;
    let imageUrl = "/media/nissan_judo_pink.png";

    let debounceTimer: ReturnType<typeof setTimeout>;
    function handleDensityChange() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            density = localDensity;
        }, 100); // 100ms debounce
    }
</script>

<div class="w-full h-screen bg-black relative overflow-hidden">
    <ParticleImage {imageUrl} {density} {particleSize} />

    <div
        class="absolute top-4 right-4 z-10 w-64"
        style="right: 1rem; top: 1rem;"
    >
        <div
            class="bg-gray-900 p-4 rounded text-white opacity-90 border border-gray-700 shadow-lg"
        >
            <h3
                class="text-sm font-bold uppercase tracking-wider mb-4 border-b border-gray-700 pb-2"
            >
                Controls
            </h3>

            <label class="block mb-4">
                <div
                    class="flex justify-between text-xs uppercase tracking-wider mb-1 opacity-70"
                >
                    <span>Density</span>
                    <span>{localDensity}</span>
                </div>
                <input
                    type="range"
                    bind:value={localDensity}
                    on:input={handleDensityChange}
                    min="10"
                    max="150"
                    step="1"
                    class="w-full accent-blue-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
            </label>

            <label class="block">
                <div
                    class="flex justify-between text-xs uppercase tracking-wider mb-1 opacity-70"
                >
                    <span>Size</span>
                    <span>{particleSize}</span>
                </div>
                <input
                    type="range"
                    bind:value={particleSize}
                    min="0.01"
                    max="0.5"
                    step="0.01"
                    class="w-full accent-blue-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
            </label>
        </div>
    </div>
</div>
