<script lang="ts">
    import type { Magnet } from "$lib/stores/magnetStore";

    export let magnet: Magnet;
    export let onMouseDown: (e: MouseEvent, magnet: Magnet) => void;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="magnet"
    style="
        left: {magnet.x}px; 
        top: {magnet.y}px; 
        --rotation: {magnet.rotation}deg;
        transform: rotate(var(--rotation));
        z-index: {magnet.zIndex};
    "
    on:mousedown={(e) => onMouseDown(e, magnet)}
>
    {magnet.word}
</div>

<style>
    .magnet {
        position: absolute;
        background: #fff;
        color: #000;
        padding: 5px 10px;
        font-family: "Times New Roman", Times, serif;
        font-size: 18px;
        box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        cursor: grab;
        user-select: none;
        border: 1px solid #ddd;
        white-space: nowrap;
        transition:
            transform 0.1s,
            box-shadow 0.1s;
    }

    .magnet:active {
        cursor: grabbing;
        box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.4);
        transform: rotate(var(--rotation)) scale(1.05);
    }
</style>
