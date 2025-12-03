<script lang="ts">
    import { setContext } from "svelte";
    import { spring } from "svelte/motion";
    import { writable } from "svelte/store";

    // Store for mouse position
    const mousePos = writable({ x: 0, y: 0 });
    setContext("bento-mouse", mousePos);

    let container: HTMLDivElement;

    function handleMouseMove(event: MouseEvent) {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        // Calculate mouse position relative to the container center?
        // Or just absolute client coordinates?
        // Let's use client coordinates for simplicity in children
        mousePos.set({ x: event.clientX, y: event.clientY });
    }

    function handleMouseLeave() {
        // Reset or move far away
        mousePos.set({ x: -1000, y: -1000 });
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="bento-grid"
    bind:this={container}
    on:mousemove={handleMouseMove}
    on:mouseleave={handleMouseLeave}
>
    <slot />
</div>

<style>
    .bento-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-auto-rows: 200px;
        gap: 1.5rem;
        width: 100%;
        max-width: 1200px;
        perspective: 1000px; /* For 3D effects if needed */
    }

    @media (max-width: 1024px) {
        .bento-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (max-width: 768px) {
        .bento-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 480px) {
        .bento-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
