<script lang="ts">
    import { onMount } from "svelte";
    import SwardyLogo from "$lib/components/SwardyLogo.svelte";
    import Fridge from "$lib/components/Fridge.svelte";
    import Sequencer from "$lib/components/Sequencer.svelte";
    import VendingMachine from "$lib/components/merch-lab/VendingMachine2D.svelte";
    import GuestConsole from "$lib/components/guest-console/GuestConsole.svelte";
    import LazyLoader from "$lib/components/utils/LazyLoader.svelte";

    let scrollContainer: HTMLElement;
    let currentScroll = 0;
    let targetScroll = 0;
    let maxScroll = 0;
    let isDragging = false;
    let snapTimeout: ReturnType<typeof setTimeout>;
    let animationFrame: number;
    let snappedIndex = 0;
    let hasBeenVisited = [true, false, false, false]; // SEQUENCER, CONSOLE, FRIDGE, VENDING

    // Configuration
    const SCROLL_SPEED = 2.5;
    const DAMPING = 0.1; // Lower = smoother/slower catchup
    const SNAP_DELAY = 150; // ms to wait before snapping

    onMount(() => {
        // Robust dimension updates using ResizeObserver
        const updateDimensions = () => {
            if (scrollContainer) {
                maxScroll = scrollContainer.scrollWidth - window.innerWidth;
            }
        };

        const resizeObserver = new ResizeObserver(() => {
            updateDimensions();
        });

        if (scrollContainer) resizeObserver.observe(scrollContainer);
        window.addEventListener("resize", updateDimensions);
        updateDimensions();

        // Animation Loop
        let lastScroll = -1;
        let isRunning = false;

        const startAnimation = () => {
            if (!isRunning) {
                isRunning = true;
                animate();
            }
        };

        const animate = () => {
            try {
                // Lerp current to target
                currentScroll += (targetScroll - currentScroll) * DAMPING;

                // Optimization: Only update DOM if value changed significantly
                if (Math.abs(currentScroll - lastScroll) > 0.01) {
                    if (scrollContainer) {
                        scrollContainer.style.transform = `translateX(${-currentScroll}px)`;
                    }
                    lastScroll = currentScroll;
                } else if (Math.abs(targetScroll - currentScroll) < 0.1) {
                    // If we are close to target AND haven't moved much, sleep
                    isRunning = false;
                    return;
                }

                animationFrame = requestAnimationFrame(animate);
            } catch (e) {
                console.error("Scroll animation error:", e);
                isRunning = false; // Reset state so loop can be restarted
            }
        };
        startAnimation();

        // State for Gesture Lock
        let isScrolling = false;
        let gestureOriginIndex = 0;

        const handleWheel = (e: WheelEvent) => {
            startAnimation(); // Wake up loop

            // Check for pinch-zoom gesture (system)
            if (e.ctrlKey) return;

            e.preventDefault();
            e.stopPropagation();

            // Clear any pending snap
            clearTimeout(snapTimeout);

            // GESTURE START DETECTION
            // If we weren't just scrolling, this is the start of a new gesture
            if (!isScrolling) {
                isScrolling = true;
                gestureOriginIndex = snappedIndex; // Anchor to where we started
            }

            // Update target with delta
            targetScroll += e.deltaY * SCROLL_SPEED;

            // GLOBAL BOUNDS (Absolute safety)
            targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));

            // GESTURE CLAPMING (One Scene at a Time)
            // Limit targetScroll to be within adjacent neighbors of the ORIGIN of this gesture.
            // This prevents flinging past neighbor + 1.
            const sectionWidth = window.innerWidth;
            const minBound = Math.max(
                0,
                (gestureOriginIndex - 1) * sectionWidth,
            );
            const maxBound = Math.min(
                maxScroll,
                (gestureOriginIndex + 1) * sectionWidth,
            );

            targetScroll = Math.max(minBound, Math.min(targetScroll, maxBound));

            // Snap logic (End of Gesture)
            snapTimeout = setTimeout(() => {
                isScrolling = false; // Reset gesture state

                const sectionWidth = window.innerWidth;
                // Clamp snapIndex to valid range
                const maxIndex = Math.round(maxScroll / sectionWidth);
                const snapIndex = Math.max(
                    0,
                    Math.min(Math.round(targetScroll / sectionWidth), maxIndex),
                );

                console.log(
                    `SNAP: target=${targetScroll.toFixed(0)} index=${snapIndex} (prev=${snappedIndex})`,
                );

                targetScroll = snapIndex * sectionWidth;

                // Update snapped state
                snappedIndex = snapIndex;
                hasBeenVisited[snapIndex] = true;

                // Wake up animation to scroll to the snapped position
                startAnimation();
            }, SNAP_DELAY);
        };

        window.addEventListener("wheel", handleWheel, {
            capture: false,
            passive: false,
        });

        return () => {
            window.removeEventListener("resize", updateDimensions);
            resizeObserver.disconnect();
            window.removeEventListener("wheel", handleWheel, {
                capture: false,
            } as any);
            cancelAnimationFrame(animationFrame);
            clearTimeout(snapTimeout);
        };
    });
</script>

<div class="page-container">
    <header class="logo-header">
        <div class="logo-wrapper">
            <SwardyLogo scale={0.8} />
        </div>
    </header>

    <div class="viewport">
        <main class="scroll-track" bind:this={scrollContainer}>
            <!-- Section 1: Sequencer -->
            <section class="experience-section">
                <LazyLoader trigger={hasBeenVisited[0]}>
                    <div class="content-wrapper sequencer-wrapper">
                        <Sequencer isActive={snappedIndex === 0} />
                    </div>
                </LazyLoader>
            </section>

            <!-- Section 2: Guest Console -->
            <section class="experience-section">
                <LazyLoader trigger={hasBeenVisited[1]}>
                    <div class="content-wrapper console-wrapper">
                        <GuestConsole isActive={snappedIndex === 1} />
                    </div>
                </LazyLoader>
            </section>

            <!-- Section 3: Fridge -->
            <section class="experience-section">
                {#if snappedIndex === 2}
                    <div class="content-wrapper fridge-wrapper">
                        <Fridge isActive={true} />
                    </div>
                {/if}
            </section>

            <!-- Section 4: Vending Machine -->
            <section class="experience-section">
                <LazyLoader trigger={hasBeenVisited[3]}>
                    <div class="content-wrapper vending-wrapper">
                        <VendingMachine />
                    </div>
                </LazyLoader>
            </section>
        </main>
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        overflow: hidden;
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
        transform: scale(0.6);
    }

    .viewport {
        height: 75vh;
        width: 100vw;
        overflow: hidden; /* Hide overflow, we move track manually */
        position: relative;
    }

    .scroll-track {
        height: 100%;
        display: flex;
        width: max-content; /* Fit content width */
        will-change: transform; /* Optimize for movement */
    }

    .experience-section {
        width: 100vw; /* Exact viewport width */
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-right: 1px solid #222;
        position: relative;
        flex-shrink: 0; /* Don't shrink */
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

    .vending-wrapper {
        transform: scale(0.9); /* Scale to fit comfortably */
    }
</style>
