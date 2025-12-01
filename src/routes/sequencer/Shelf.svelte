<script lang="ts">
    import Cartridge from "./Cartridge.svelte";

    export let cartridges: any[] = [];
    export let selectedCartridgeId: number | null = null;
    export let onDrop: (id: number) => void;
    export let onPreview: (id: number) => void;
    export let onHover: (id: number) => void;
    export let onClick: () => void;

    function handleDragOver(e: DragEvent) {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
    }

    function handleDrop(e: DragEvent) {
        e.preventDefault();
        if (e.dataTransfer) {
            const id = parseInt(e.dataTransfer.getData("text/plain"));
            if (!isNaN(id)) {
                onDrop(id);
            }
        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="shelf"
    on:dragover={handleDragOver}
    on:drop={handleDrop}
    on:click|self={onClick}
>
    <div class="shelf-label">STORAGE</div>
    <div class="cartridge-container">
        {#each cartridges as cart (cart.id)}
            <div class="cartridge-wrapper">
                <Cartridge
                    id={cart.id}
                    selected={selectedCartridgeId === cart.id}
                    on:click={() => onPreview(cart.id)}
                    on:mouseenter={() => onHover(cart.id)}
                />
            </div>
        {/each}
    </div>
</div>

<style>
    .shelf {
        width: 100%;
        min-height: 120px;
        border: 2px dashed rgba(255, 176, 0, 0.3);
        background: rgba(255, 176, 0, 0.05);
        padding: 1rem;
        margin-top: 2rem;
        position: relative;
    }

    .shelf-label {
        position: absolute;
        top: -10px;
        left: 10px;
        background: #0a0500;
        padding: 0 5px;
        color: rgba(255, 176, 0, 0.5);
        font-size: 0.8rem;
    }

    .cartridge-container {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
    }

    .cartridge-wrapper {
        width: 60px;
        height: 80px;
    }
</style>
