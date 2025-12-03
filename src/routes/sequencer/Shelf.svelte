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
                    icon={cart.icon}
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
        border: 1px solid #332200;
        background: #111;
        padding: 1rem;
        margin-top: 2rem;
        position: relative;
        box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
        border-radius: 4px;
    }

    .shelf-label {
        position: absolute;
        top: -10px;
        left: 10px;
        background: #1a1a1a;
        padding: 0 5px;
        color: #ffb000;
        font-size: 0.8rem;
        border: 1px solid #332200;
        border-radius: 2px;
    }

    .cartridge-container {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        gap: 1rem;
        justify-items: center;
    }

    .cartridge-wrapper {
        width: 100%;
        aspect-ratio: 0.75;
        height: auto;
    }
</style>
