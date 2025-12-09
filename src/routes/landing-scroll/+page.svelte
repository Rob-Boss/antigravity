<script lang="ts">
    import { onMount } from "svelte";
    import SwardyLogo from "$lib/components/SwardyLogo.svelte";
    import Fridge from "$lib/components/Fridge.svelte";
    import Sequencer from "$lib/components/Sequencer.svelte";
    import TealTrapezoid from "$lib/components/cool-car-skins/TealTrapezoid.svelte";
    import LazyLoader from "$lib/components/utils/LazyLoader.svelte";

    let scrollContainer: HTMLElement;
    let currentScroll = 0;
    let targetScroll = 0;
    let maxScroll = 0;
    let isDragging = false;
    let snapTimeout: ReturnType<typeof setTimeout>;
    let animationFrame: number;
    let snappedIndex = 0;
    let hasBeenVisited = [true, false, false]; // First section visited by default

    // Configuration
    const SCROLL_SPEED = 2.5;
    const DAMPING = 0.1; // Lower = smoother/slower catchup
    const SNAP_DELAY = 150; // ms to wait before snapping

    onMount(() => {
        // Calculate max scroll based on content
        const updateDimensions = () => {
            if (scrollContainer) {
                // Total width - viewport width
                maxScroll = scrollContainer.scrollWidth - window.innerWidth;
            }
        };

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

        window.addEventListener("resize", () => {
            updateDimensions();
            startAnimation();
        });
        updateDimensions();

        const handleWheel = (e: WheelEvent) => {
            startAnimation();

            // Check for pinch-zoom gesture (usually accompanied by ctrlKey)
            if (e.ctrlKey) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            // Clear any pending snap
            clearTimeout(snapTimeout);

            // Update target
            targetScroll += e.deltaY * SCROLL_SPEED;

            // Calculate strict bounds based on current snapped index
            // Can only move to adjacent sections (prev or next)
            const sectionWidth = window.innerWidth;
            const minBound = Math.max(0, (snappedIndex - 1) * sectionWidth);
            const maxBound = Math.min(
                maxScroll,
                (snappedIndex + 1) * sectionWidth,
            );

            // Clamp target to strict bounds
            targetScroll = Math.max(minBound, Math.min(targetScroll, maxBound));

            // Snap logic
            snapTimeout = setTimeout(() => {
                const sectionWidth = window.innerWidth;
                const snapIndex = Math.round(targetScroll / sectionWidth);
                targetScroll = snapIndex * sectionWidth;

                // Update snapped state
                snappedIndex = snapIndex;
                hasBeenVisited[snapIndex] = true;

                // Wake up animation to scroll to the snapped position
                startAnimation();
            }, SNAP_DELAY);
        };

        window.addEventListener("wheel", handleWheel, {
            capture: true,
            passive: false,
        });

        return () => {
            window.removeEventListener("resize", updateDimensions);
            window.removeEventListener("wheel", handleWheel, {
                capture: true,
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

            <!-- Section 2: Fridge -->
            <section class="experience-section">
                <LazyLoader trigger={hasBeenVisited[1]}>
                    <div class="content-wrapper fridge-wrapper">
                        <Fridge isActive={snappedIndex === 1} />
                    </div>
                </LazyLoader>
            </section>

            <!-- Section 3: Cool Car Viewer -->
            <section class="experience-section">
                <LazyLoader trigger={hasBeenVisited[2]}>
                    <div class="content-wrapper car-wrapper">
                        <TealTrapezoid isActive={snappedIndex === 2} />
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

    .car-wrapper {
        /* Teal Trapezoid scales itself */
        transform: scale(0.8); /* Scale down slightly to fit nicely */
    }
</style>
