<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    let container: HTMLElement;
    let isVisible = false;

    onMount(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    isVisible = entry.isIntersecting;
                });
            },
            {
                root: null, // viewport
                rootMargin: "100px", // load a bit before it comes into view
                threshold: 0.01,
            },
        );

        if (container) {
            observer.observe(container);
        }

        return () => {
            if (container) {
                observer.unobserve(container);
            }
        };
    });
</script>

<div class="lazy-loader" bind:this={container}>
    {#if isVisible}
        <slot />
    {:else}
        <div class="placeholder">
            <span class="loading-text">LOADING EXPERIENCE...</span>
        </div>
    {/if}
</div>

<style>
    .lazy-loader {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #111;
        color: #333;
        border: 1px dashed #333;
    }

    .loading-text {
        font-family: monospace;
        animation: blink 1s infinite;
    }

    @keyframes blink {
        50% {
            opacity: 0.5;
        }
    }
</style>
