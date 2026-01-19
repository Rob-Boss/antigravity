<script lang="ts">
    import { page } from "$app/stores";
    import SwardyLogo from "$lib/components/SwardyLogo.svelte";
    import { fly, fade } from "svelte/transition";
    import { quartInOut } from "svelte/easing";
    import { onMount } from "svelte";
    import SignalStatic from "$lib/components/visuals/SignalStatic.svelte";
    import BreadcrumbNav from "$lib/components/navigation/BreadcrumbNav.svelte";

    const ROUTES = [
        { id: "swardy", path: "/scroll-5" },
        { id: "sequencer", path: "/scroll-5/sequencer" },
        { id: "console", path: "/scroll-5/console" },
        { id: "fridge", path: "/scroll-5/fridge" },
        { id: "vending", path: "/scroll-5/vending" },
    ];

    $: currentIndex = ROUTES.findIndex((r) => r.path === $page.url.pathname);
    $: effectiveIndex = currentIndex === -1 ? 0 : currentIndex;

    let isNavigating = false;
    let showLoader = true;
    let direction = 1;
    let transitionAxis: "x" | "y" = "y";
    let innerWidth = 1000;
    let innerHeight = 800;

    function getAxis(a: number, b: number): "x" | "y" {
        const low = Math.min(a, b);
        const high = Math.max(a, b);
        // 0-1 (Swardy-Seq) -> Y
        // 1-2 (Seq-Console) -> X
        // 2-3 (Console-Fridge) -> Y
        // 3-4 (Fridge-Vending) -> X
        if ((low === 0 && high === 1) || (low === 2 && high === 3)) {
            return "y";
        }
        return "x";
    }

    $: logoScale = Math.max(0.3, Math.min(0.8, innerWidth / 1200));

    onMount(async () => {
        const savedDir = sessionStorage.getItem("nav-direction");
        if (savedDir) direction = parseInt(savedDir);

        const fromIndexStr = sessionStorage.getItem("nav-from-index");
        if (fromIndexStr !== null) {
            const fromIndex = parseInt(fromIndexStr);
            transitionAxis = getAxis(fromIndex, effectiveIndex);
        } else {
            // Default load (from Intro or direct link)
            transitionAxis = "y";
        }

        await new Promise((r) => setTimeout(r, 600));
        showLoader = false;
    });

    const navigate = async (newIndex: number) => {
        if (newIndex < 0 || newIndex >= ROUTES.length) return;
        isNavigating = true;
        direction = newIndex > effectiveIndex ? 1 : -1;

        // Set the axis for the outgoing animation
        transitionAxis = getAxis(effectiveIndex, newIndex);

        sessionStorage.setItem("nav-direction", direction.toString());
        sessionStorage.setItem("nav-from-index", effectiveIndex.toString());

        showLoader = true;
        await new Promise((r) => setTimeout(r, 800));
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
    bind:innerHeight
/>

<div class="page-container">
    <!-- GLOBAL STATIC LAYER (BOTTOM) -->
    <div class="global-static-layer">
        <SignalStatic
            resolution={1.0}
            blackPoint={0.3}
            whitePoint={0.49}
            speed={20.0}
        />
    </div>

    <!-- LOGO HEADER (TOP) -->
    <!-- <header class="logo-header">
        <div class="logo-wrapper">
            <SwardyLogo scale={logoScale} />
        </div>
    </header> -->

    <div class="viewport">
        <BreadcrumbNav
            currentIndex={effectiveIndex}
            routes={ROUTES}
            onNavigate={navigate}
        />

        {#if showLoader}
            <div
                class="scene-wrapper loader-wrapper"
                in:fly={{
                    x: transitionAxis === "x" ? direction * innerWidth : 0,
                    y: transitionAxis === "y" ? direction * innerHeight : 0,
                    duration: 800,
                    easing: quartInOut,
                }}
                out:fade={{ duration: 400 }}
            >
                <div class="static-layer-loader">
                    <SignalStatic
                        resolution={1.0}
                        blackPoint={0.3}
                        whitePoint={0.49}
                        speed={20.0}
                    />
                </div>
                <div class="system-loader">
                    <span class="loading-text">LOADING EXPERIENCE...</span>
                </div>
            </div>
        {:else}
            <div
                class="scene-wrapper content-wrapper"
                out:fly={{
                    x: transitionAxis === "x" ? direction * -innerWidth : 0,
                    y: transitionAxis === "y" ? direction * -innerHeight : 0,
                    duration: 800,
                    easing: quartInOut,
                }}
            >
                <div class="content-limit">
                    <slot />
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        overflow: hidden;
        background: #000;
        color: #fff;
    }

    .page-container {
        width: 100vw;
        height: 100vh;
        position: relative;
        overflow: hidden;
        background: #000;
    }

    .global-static-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 5; /* Lowest background */
        pointer-events: none;
    }

    .logo-header {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 25vh;
        z-index: 400;
        display: flex;
        justify-content: center;
        align-items: center;
        background: transparent;
        pointer-events: none;
    }

    .logo-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: auto;
    }

    .viewport {
        width: 100vw;
        height: 100vh;
        position: relative;
    }

    .scene-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    /* Content Wrapper (Sequencer, Fridge, etc.) */
    .content-wrapper {
        z-index: 50; /* Above global static (5), Below Logo (400) */
    }

    .content-limit {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .loader-wrapper {
        background: transparent;
        z-index: 200;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .static-layer-loader {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
    }

    .system-loader {
        position: relative;
        z-index: 1;
    }

    .loading-text {
        font-family: monospace;
        color: #fff;
        animation: blink 1s infinite;
        text-transform: uppercase;
        text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }

    @keyframes blink {
        50% {
            opacity: 0.5;
        }
    }
</style>
