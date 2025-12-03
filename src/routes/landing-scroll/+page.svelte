<script lang="ts">
    import { onMount } from "svelte";
    import SwardyLogo from "$lib/components/SwardyLogo.svelte";
    import Fridge from "$lib/components/Fridge.svelte";
    import Sequencer from "$lib/components/Sequencer.svelte";
    import TealTrapezoid from "$lib/components/cool-car-skins/TealTrapezoid.svelte";
    import LazyLoader from "$lib/components/utils/LazyLoader.svelte";

    let scrollContainer: HTMLElement;

    onMount(() => {
        const handleWheel = (e: WheelEvent) => {
            if (scrollContainer) {
                // Map vertical scroll to horizontal scroll
                // We use a multiplier to make it feel natural or faster
                scrollContainer.scrollLeft += e.deltaY;
            }
        };

        window.addEventListener("wheel", handleWheel, { passive: true });

        return () => {
            window.removeEventListener("wheel", handleWheel);
        };
    });
</script>

<div class="page-container">
    <header class="logo-header">
        <div class="logo-wrapper">
            <!-- Scale down the logo to fit the 25vh header -->
            <SwardyLogo scale={0.5} />
        </div>
    </header>

    <main class="scroll-track" bind:this={scrollContainer}>
        <!-- Section 1: Fridge -->
        <section class="experience-section">
            <LazyLoader>
                <div class="content-wrapper fridge-wrapper">
                    <Fridge />
                </div>
            </LazyLoader>
        </section>

        <!-- Section 2: Sequencer -->
        <section class="experience-section">
            <LazyLoader>
                <div class="content-wrapper sequencer-wrapper">
                    <Sequencer />
                </div>
            </LazyLoader>
        </section>

        <!-- Section 3: Cool Car Viewer (Teal Trapezoid) -->
        <section class="experience-section">
            <LazyLoader>
                <div class="content-wrapper car-wrapper">
                    <TealTrapezoid />
                </div>
            </LazyLoader>
        </section>
    </main>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        overflow: hidden; /* Prevent body scroll */
        background: #111;
        color: #fff;
    }

    .page-container {
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
    }

    .logo-header {
        height: 25vh;
        width: 100%;
        background: #000;
        border-bottom: 1px solid #333;
        position: relative;
        z-index: 10;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }

    .logo-wrapper {
        transform: scale(0.6); /* Adjust as needed */
    }

    .scroll-track {
        height: 75vh;
        width: 100%;
        display: flex;
        overflow-x: auto; /* Allow horizontal scroll */
        overflow-y: hidden;
        scroll-snap-type: x mandatory; /* Snap to sections */
        scroll-behavior: smooth;
        /* Hide scrollbar */
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE/Edge */
    }

    .scroll-track::-webkit-scrollbar {
        display: none; /* Chrome/Safari */
    }

    .experience-section {
        flex: 0 0 100vw; /* Each section takes full width */
        height: 100%;
        scroll-snap-align: start;
        display: flex;
        justify-content: center;
        align-items: center;
        border-right: 1px solid #222;
        position: relative;
    }

    .content-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* Specific adjustments for components to fit in 75vh */
    .fridge-wrapper {
        /* Fridge usually takes full screen, might need clipping or scaling */
        overflow: hidden;
        position: relative;
    }

    .sequencer-wrapper {
        /* Sequencer scales itself, but let's ensure it has room */
        padding: 20px;
        box-sizing: border-box;
    }

    .car-wrapper {
        /* Teal Trapezoid scales itself */
        transform: scale(0.8); /* Scale down slightly to fit nicely */
    }
</style>
