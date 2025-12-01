<script lang="ts">
    import Cartridge from "./Cartridge.svelte";

    export let index: number;
    export let cartridge: any = null;
    export let isCurrent: boolean = false;
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
    class="slot"
    class:has-cartridge={!!cartridge}
    class:current={isCurrent}
    on:dragover={handleDragOver}
    on:drop={handleDrop}
    on:click|self={onClick}
>
    <div class="slot-inner" on:click={onClick}>
        {#if cartridge}
            <Cartridge
                id={cartridge.id}
                selected={selectedCartridgeId === cartridge.id}
                on:click={(e) => {
                    e.stopPropagation();
                    onPreview(cartridge.id);
                }}
                on:mouseenter={() => onHover(cartridge.id)}
            />
        {:else}
            <span class="index">{index + 1}</span>
            <div class="placeholder"></div>
        {/if}
    </div>
</div>

<style>
    .slot {
        aspect-ratio: 1;
        border: 1px solid rgba(255, 176, 0, 0.3);
        position: relative;
        transition: all 0.1s;
        background: rgba(255, 176, 0, 0.05);
        padding: 4px;
    }

    .slot:hover {
        border-color: #ffb000;
        background: rgba(255, 176, 0, 0.1);
    }

    .slot.current {
        box-shadow: 0 0 20px #ffb000;
        border-color: #ffb000;
        z-index: 2;
    }

    .slot-inner {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .index {
        font-size: 0.8rem;
        opacity: 0.3;
        position: absolute;
    }

    .placeholder {
        width: 100%;
        height: 100%;
        border: 1px dashed rgba(255, 176, 0, 0.2);
        border-radius: 4px;
    }
</style>
