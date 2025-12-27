<script lang="ts">
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import SwardyLogo from "$lib/components/SwardyLogo.svelte";
    import { fly } from "svelte/transition";
    import { quartInOut } from "svelte/easing";
    import { onMount, tick } from "svelte";

    // ROUTES ORDER
    const ROUTES = [
        { id: "sequencer", path: "/scroll-3/sequencer" },
        { id: "console", path: "/scroll-3/console" },
        { id: "fridge", path: "/scroll-3/fridge" },
        { id: "vending", path: "/scroll-3/vending" },
    ];

    $: currentIndex = ROUTES.findIndex((r) =>
        $page.url.pathname.includes(r.id),
    );
    $: effectiveIndex = currentIndex === -1 ? 0 : currentIndex;

    let isNavigating = false;
    let showLoader = true;
    let direction = 1;
    let innerWidth = 1000;

    $: logoScale = Math.max(0.3, Math.min(0.8, innerWidth / 1200));

    // Handle Entry Animation on Mount
    onMount(async () => {
        // Just wait a beat to show the loader, then cut to content
        await new Promise((r) => setTimeout(r, 600));
        showLoader = false;
    });

    const navigate = async (newIndex: number) => {
        if (newIndex < 0 || newIndex >= ROUTES.length) return;

        isNavigating = true;
        direction = newIndex > effectiveIndex ? 1 : -1;

        // 1. Enter Loading State (Loader slides in)
        showLoader = true;

        // 2. Wait for Loader entry transition (Match transition duration)
        await new Promise((r) => setTimeout(r, 800));

        // 3. HARD RELOAD NAVIGATE (Clean URL)
        window.location.assign(ROUTES[newIndex].path);
    };

    const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        if (isNavigating || showLoader) return;
        if (Math.abs(e.deltaY) < 20 && Math.abs(e.deltaX) < 20) return;

        const delta =
            Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        if (delta > 0) navigate(effectiveIndex + 1);
        else navigate(effectiveIndex - 1);
    };

    const handleKey = (e: KeyboardEvent) => {
        if (isNavigating || showLoader) return;
        if (e.key === "ArrowRight" || e.key === "ArrowDown")
            navigate(effectiveIndex + 1);
        if (e.key === "ArrowLeft" || e.key === "ArrowUp")
            navigate(effectiveIndex - 1);
    };
</script>

<svelte:window
    on:wheel|nonpassive={handleWheel}
    on:keydown={handleKey}
    bind:innerWidth
/>

<div class="page-container">
    <header class="logo-header">
        <div class="logo-wrapper">
            <SwardyLogo scale={logoScale} />
        </div>
    </header>

    <div class="viewport">
        <!-- 
            LOADER CURTAIN
            - 'in': Slides IN when scrolling away (Departure).
            - 'out': None. It just disappears/fades when data is ready (Arrival).
        -->
        {#if showLoader}
            <div
                class="scene-wrapper loader-wrapper"
                in:fly={{
                    x: direction * 1000,
                    duration: 800,
                    easing: quartInOut,
                }}
            >
                <div class="system-loader">
                    <span class="loading-text">LOADING EXPERIENCE...</span>
                </div>
            </div>
        {:else}
            <!-- 
                STATIC CONTENT (Arrival) / SCROLL AWAY (Departure)
                - 'out': Slides AWAY when we leave.
            -->
            <div
                class="scene-wrapper"
                out:fly={{
                    x: direction * -1000,
                    duration: 800,
                    easing: quartInOut,
                }}
            >
                <div class="content-limit">
                    <slot />
                </div>
            </div>
        {/if}

        <!-- NAV DOTS -->
        <nav class="nav-dots">
            {#each ROUTES as route, i}
                <button
                    class="dot"
                    class:active={i === effectiveIndex}
                    on:click={() => !isNavigating && navigate(i)}
                ></button>
            {/each}
        </nav>
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        overflow: hidden;
        background: var(--module-grey);
        color: #fff;
    }

    .page-container {
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .logo-header {
        height: 25vh;
        width: 100%;
        background: var(--module-grey);
        /* border-bottom: 1px solid #333; REMOVED */
        z-index: 20;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .logo-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .viewport {
        height: 75vh;
        width: 100vw;
        position: relative;
        overflow: hidden;
        background: var(--module-grey);
    }

    .scene-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .content-limit {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* LOADER STYLE */
    .loader-wrapper {
        background: var(
            --module-grey
        ); /* Ensure opaque background to hide url change */
        z-index: 10;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px dashed #333;
        box-sizing: border-box;
    }

    .loading-text {
        font-family: monospace;
        color: #333;
        animation: blink 1s infinite;
        text-transform: uppercase;
    }

    @keyframes blink {
        50% {
            opacity: 0.5;
        }
    }

    .nav-dots {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 15px;
        z-index: 50;
    }

    .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #333;
        border: 1px solid #555;
        cursor: pointer;
        transition: all 0.3s;
    }

    .dot.active {
        background: #fff;
        transform: scale(1.2);
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    }
</style>
