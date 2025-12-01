<script lang="ts">
    export let id: number;
    export let label: string = "";
    export let selected: boolean = false;
    export let playing: boolean = false;
    export let duration: number = 0;

    function handleDragStart(e: DragEvent) {
        if (e.dataTransfer) {
            e.dataTransfer.setData("text/plain", id.toString());
            e.dataTransfer.effectAllowed = "move";
        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="cartridge"
    class:selected
    draggable="true"
    on:dragstart={handleDragStart}
    on:click
    on:mouseenter
>
    {#if playing}
        <div
            class="progress-overlay"
            style="animation-duration: {duration}s"
        ></div>
    {/if}
    <div class="grip"></div>
    <div class="label">
        {label || `CART_${id.toString().padStart(2, "0")}`}
    </div>
    <div class="connectors"></div>
</div>

<style>
    .cartridge {
        width: 100%;
        height: 100%;
        background: #ffb000;
        color: #000;
        border: 2px solid #000;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        cursor: grab;
        box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.5);
        transition:
            transform 0.1s,
            box-shadow 0.1s;
        user-select: none;
        position: relative;
        overflow: hidden;
    }

    .progress-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 0%;
        background: linear-gradient(
            to top,
            rgba(255, 176, 0, 0.2),
            rgba(255, 255, 255, 0.8)
        );
        box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
        animation: progress linear forwards;
        pointer-events: none;
        z-index: 1;
        mix-blend-mode: overlay;
    }

    @keyframes progress {
        from {
            height: 0%;
            opacity: 0.5;
        }
        to {
            height: 100%;
            opacity: 1;
        }
    }

    .cartridge.selected {
        box-shadow:
            0 0 10px #fff,
            2px 2px 0px rgba(0, 0, 0, 0.5);
        border-color: #fff;
        z-index: 10;
    }

    .cartridge:active {
        cursor: grabbing;
        transform: scale(0.95);
    }

    .grip {
        height: 10px;
        background: repeating-linear-gradient(
            90deg,
            #000,
            #000 2px,
            transparent 2px,
            transparent 4px
        );
        margin: 4px;
        opacity: 0.3;
    }

    .label {
        text-align: center;
        font-weight: bold;
        font-size: 0.7rem;
        padding: 2px;
        background: #000;
        color: #ffb000;
        margin: 0 4px;
    }

    .connectors {
        height: 6px;
        background: #333;
        margin: 0 8px 4px 8px;
        border-radius: 2px;
    }
</style>
