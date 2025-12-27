<script lang="ts">
    import { fly } from "svelte/transition";
    import { sineInOut } from "svelte/easing";

    // COMPONENTS
    import SwardyLogo from "$lib/components/SwardyLogo.svelte";
    // Note: Scenes are now dynamically imported to ensure isolation

    // CONFIG
    const SCENE_DEFS = [
        { id: "sequencer", bg: "#111" },
        { id: "console", bg: "#0d0d0d" }, // Slight var to feel change
        { id: "fridge", bg: "#1a1a1a" },
        { id: "vending", bg: "#111" },
    ];

    let activeIndex = 0;
    let isTransitioning = false;
    let direction = 1; // 1 = right (next), -1 = left (prev)

    // Dynamic Loader
    const loadSceneComponent = async (index: number) => {
        const id = SCENE_DEFS[index].id;
        // No artificial delay - load as fast as possible
        switch (id) {
            case "sequencer":
                return (await import("$lib/components/Sequencer.svelte"))
                    .default;
            case "console":
                return (
                    await import(
                        "$lib/components/guest-console/GuestConsole.svelte"
                    )
                ).default;
            case "fridge":
                return (await import("$lib/components/Fridge.svelte")).default;
            case "vending":
                return (
                    await import(
                        "$lib/components/merch-lab/VendingMachine2D.svelte"
                    )
                ).default;
        }
    };

    const handleWheel = async (e: WheelEvent) => {
        // Prevent default scrolling
        e.preventDefault();

        // If locked (animating), ignore
        if (isTransitioning) return;

        // Check threshold to avoid tiny incidental trackpad jitters
        if (Math.abs(e.deltaY) < 20 && Math.abs(e.deltaX) < 20) return;

        // Determine direction
        // Prioritize horizontal since it's a "timeline", but vertical wheel works too
        const delta =
            Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

        if (delta > 0 && activeIndex < SCENE_DEFS.length - 1) {
            // NEXT
            triggerChange(activeIndex + 1);
        } else if (delta < 0 && activeIndex > 0) {
            // PREV
            triggerChange(activeIndex - 1);
        }
    };

    const triggerChange = async (newIndex: number) => {
        isTransitioning = true;
        direction = newIndex > activeIndex ? 1 : -1;
        activeIndex = newIndex;

        // Lock period (Wait for transition to settle mostly)
        // Adjust this to match css transition duration + buffer
        setTimeout(() => {
            isTransitioning = false;
        }, 1200);
    };

    // Keyboard nav
    const handleKey = (e: KeyboardEvent) => {
        if (isTransitioning) return;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            if (activeIndex < SCENE_DEFS.length - 1)
                triggerChange(activeIndex + 1);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            if (activeIndex > 0) triggerChange(activeIndex - 1);
        }
    };
</script>

<svelte:window on:wheel|nonpassive={handleWheel} on:keydown={handleKey} />

<div class="page-container">
    <header class="logo-header">
        <div class="logo-wrapper">
            <SwardyLogo scale={0.8} />
        </div>
    </header>

    <div class="viewport">
        <!--
            KEYED BLOCK RE-RENDERS ON activeIndex CHANGE
        -->
        {#key activeIndex}
            <div
                class="scene-wrapper"
                in:fly={{
                    x: direction * 1000,
                    duration: 1000,
                    easing: sineInOut,
                    opacity: 1,
                }}
                out:fly={{
                    x: direction * -1000,
                    duration: 1000,
                    easing: sineInOut,
                    opacity: 1,
                }}
                style="background: {SCENE_DEFS[activeIndex].bg}"
            >
                <div class="content-limit">
                    {#await loadSceneComponent(activeIndex)}
                        <div class="system-loader">
                            <span class="loading-text"
                                >LOADING EXPERIENCE...</span
                            >
                        </div>
                    {:then component}
                        <svelte:component this={component} isActive={true} />
                    {/await}
                </div>
            </div>
        {/key}

        <!-- NAV DOTS for visual context -->
        <nav class="nav-dots">
            {#each SCENE_DEFS as scene, i}
                <button
                    class="dot"
                    class:active={i === activeIndex}
                    on:click={() => !isTransitioning && triggerChange(i)}
                ></button>
            {/each}
        </nav>
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        overflow: hidden; /* Force no native scroll */
        background: #000;
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
        background: #000;
        border-bottom: 1px solid #333;
        z-index: 20;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .logo-wrapper {
        transform: scale(0.6);
    }

    .viewport {
        height: 75vh;
        width: 100vw;
        position: relative;
        overflow: hidden;
    }

    .scene-wrapper {
        position: absolute; /* Stack on top of each other for transition */
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }

    .content-limit {
        width: 100%;
        height: 100%;
        /* Ensure components don't overflow vertically if they are weird */
        display: flex;
        justify-content: center;
        align-items: center;
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

    /* LOADER STYLE */
    .system-loader {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #111;
        border: 1px dashed #333;
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
</style>
