<script lang="ts">
    import { getContext, onMount } from "svelte";
    import { spring } from "svelte/motion";
    import type { Writable } from "svelte/store";

    export let item: { id: string; title: string; type: string; color: string };

    const mousePos =
        getContext<Writable<{ x: number; y: number }>>("bento-mouse");

    let element: HTMLDivElement;
    let center = { x: 0, y: 0 };

    // Physics configuration
    const scale = spring(1, {
        stiffness: 0.1,
        damping: 0.4,
    });

    const zIndex = spring(1, {
        stiffness: 0.2,
        damping: 0.5,
    });

    // Update center position on mount and resize
    function updateRect() {
        if (element) {
            const rect = element.getBoundingClientRect();
            center = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
            };
        }
    }

    onMount(() => {
        updateRect();
        window.addEventListener("resize", updateRect);
        window.addEventListener("scroll", updateRect); // Update on scroll too
        return () => {
            window.removeEventListener("resize", updateRect);
            window.removeEventListener("scroll", updateRect);
        };
    });

    // React to mouse movement
    $: if ($mousePos && element) {
        const dx = $mousePos.x - center.x;
        const dy = $mousePos.y - center.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Proximity threshold (pixels) - increased slightly for smoother falloff
        const threshold = 600;

        // Calculate scale factor
        // Base scale (distant) = 0.9
        // Max scale (focused) = 1.1
        // Formula: min + (max - min) * (1 - dist/threshold)
        const minScale = 0.9;
        const maxScale = 1.1;

        let targetScale = minScale;
        let targetZ = 1;

        if (distance < threshold) {
            const proximity = 1 - distance / threshold;
            // Use a power curve for sharper focus near the center
            const curve = Math.pow(proximity, 1.5);
            targetScale = minScale + (maxScale - minScale) * curve;

            // Bring to front if significantly focused
            if (proximity > 0.8) targetZ = 10;
            else if (proximity > 0.5) targetZ = 5;
            else targetZ = 1;
        }

        scale.set(targetScale);
        zIndex.set(targetZ);
    }
</script>

<div
    class="bento-item {item.type}"
    bind:this={element}
    style="
		--bg-color: {item.color};
		transform: scale({$scale});
		z-index: {Math.round($zIndex)};
	"
>
    <div class="inner">
        <slot />
    </div>
</div>

<style>
    .bento-item {
        position: relative;
        border-radius: 24px;
        background-color: var(--bg-color);
        color: #1a1a1a;
        cursor: pointer;
        /* Smooth transition for non-spring properties */
        transition: box-shadow 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform-origin: center center;
        will-change: transform;
    }

    .bento-item:hover {
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }

    .inner {
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 24px;
    }

    /* Grid Spans */
    .xl {
        grid-column: span 2;
        grid-row: span 2;
    }

    .large {
        grid-column: span 2;
        grid-row: span 1;
    }

    .medium {
        grid-column: span 1;
        grid-row: span 1;
    }

    .small {
        grid-column: span 1;
        grid-row: span 1;
    }

    /* Responsive Spans */
    @media (max-width: 768px) {
        .xl,
        .large {
            grid-column: span 2;
        }
    }

    @media (max-width: 480px) {
        .xl,
        .large,
        .medium,
        .small {
            grid-column: span 1;
        }
    }
</style>
