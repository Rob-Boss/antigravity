<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { spring } from "svelte/motion";

    const dispatch = createEventDispatcher<{ channelChange: number }>();

    let currentChannel = 1;
    let isDragging = false;
    let startAngle = 0;
    let dialRotation = spring(0, { stiffness: 0.3, damping: 0.6 });

    const totalChannels = 13;
    const degreesPerChannel = 360 / totalChannels;

    function getAngleFromEvent(
        event: MouseEvent | Touch,
        element: HTMLElement,
    ): number {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const x = event.clientX - centerX;
        const y = event.clientY - centerY;
        return Math.atan2(y, x) * (180 / Math.PI);
    }

    function handleMouseDown(event: MouseEvent) {
        isDragging = true;
        const dial = event.currentTarget as HTMLElement;
        startAngle = getAngleFromEvent(event, dial) - $dialRotation;
    }

    function handleClick(event: MouseEvent) {
        // Only advance if we didn't drag
        if (isDragging) return;

        // Advance to next channel
        const nextChannel =
            currentChannel >= totalChannels ? 1 : currentChannel + 1;
        currentChannel = nextChannel;
        dispatch("channelChange", currentChannel);

        // Snap to new channel
        const nearestChannelAngle = (currentChannel - 1) * degreesPerChannel;
        dialRotation.set(nearestChannelAngle);
    }

    function handleGlobalMouseMove(event: MouseEvent) {
        if (!isDragging) return;
        const dial = document.querySelector(".dial") as HTMLElement;
        if (!dial) return;

        const currentAngle = getAngleFromEvent(event, dial);
        let targetRotation = currentAngle - startAngle;

        // Normalize to 0-360
        targetRotation = ((targetRotation % 360) + 360) % 360;

        dialRotation.set(targetRotation);

        // Calculate channel based on rotation
        const channel = Math.floor(targetRotation / degreesPerChannel) + 1;

        if (
            channel !== currentChannel &&
            channel >= 1 &&
            channel <= totalChannels
        ) {
            currentChannel = channel;
            dispatch("channelChange", currentChannel);
        }
    }

    function handleGlobalMouseUp() {
        if (!isDragging) return;
        isDragging = false;

        // Snap to nearest channel
        const nearestChannelAngle = (currentChannel - 1) * degreesPerChannel;
        dialRotation.set(nearestChannelAngle);
    }

    // Touch support
    function handleTouchStart(event: TouchEvent) {
        const touch = event.touches[0];
        const mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY,
        });
        handleMouseDown(mouseEvent as any);
    }

    function handleTouchMove(event: TouchEvent) {
        event.preventDefault();
        const touch = event.touches[0];
        const mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY,
        });
        handleGlobalMouseMove(mouseEvent);
    }
</script>

<svelte:window
    on:mousemove={handleGlobalMouseMove}
    on:mouseup={handleGlobalMouseUp}
    on:touchmove={handleTouchMove}
    on:touchend={handleGlobalMouseUp}
/>

<div class="dial-wrapper">
    <div class="channel-display">CH {currentChannel}</div>
    <div
        class="dial"
        class:dragging={isDragging}
        style="transform: rotate({$dialRotation}deg)"
        on:mousedown={handleMouseDown}
        on:click={handleClick}
        on:touchstart={handleTouchStart}
        role="slider"
        aria-label="Channel dial"
        aria-valuenow={currentChannel}
        aria-valuemin={1}
        aria-valuemax={totalChannels}
        tabindex="0"
    >
        <!-- Dial notches -->
        {#each Array(totalChannels) as _, i}
            <div
                class="notch"
                style="transform: rotate({i *
                    degreesPerChannel}deg) translateY(-35px)"
            >
                <div class="notch-number">{i + 1}</div>
            </div>
        {/each}

        <!-- Center knob -->
        <div class="knob"></div>
    </div>

    <!-- Pointer -->
    <div class="pointer"></div>
</div>

<style>
    .dial-wrapper {
        position: relative;
        width: 100px;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .channel-display {
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 100, 100, 0.9);
        color: #000;
        padding: 0.25rem 0.75rem;
        border-radius: 4px;
        font-size: 0.9rem;
        font-weight: 700;
        font-family: "Courier New", monospace;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .dial {
        position: relative;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, #444, #1a1a1a);
        cursor: grab;
        user-select: none;
        box-shadow:
            0 4px 12px rgba(0, 0, 0, 0.6),
            inset 0 -2px 8px rgba(0, 0, 0, 0.5),
            inset 0 2px 4px rgba(255, 255, 255, 0.1);
        transition: box-shadow 0.2s;
    }

    .dial:hover {
        box-shadow:
            0 6px 16px rgba(0, 0, 0, 0.7),
            inset 0 -2px 8px rgba(0, 0, 0, 0.5),
            inset 0 2px 4px rgba(255, 255, 255, 0.15);
    }

    .dial.dragging {
        cursor: grabbing;
        box-shadow:
            0 2px 8px rgba(0, 0, 0, 0.8),
            inset 0 -2px 8px rgba(0, 0, 0, 0.6);
    }

    .knob {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 35%, #666, #222);
        box-shadow:
            inset 0 2px 4px rgba(0, 0, 0, 0.5),
            0 1px 2px rgba(255, 255, 255, 0.1);
    }

    .notch {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 3px;
        height: 8px;
        background: #888;
        transform-origin: 0 0;
        border-radius: 2px;
    }

    .notch-number {
        position: absolute;
        top: -18px;
        left: 50%;
        transform: translateX(-50%) rotate(calc(var(--rotation) * -1deg));
        font-size: 0.7rem;
        color: #999;
        font-weight: 600;
        white-space: nowrap;
        pointer-events: none;
    }

    .pointer {
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 10px solid #ff6464;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    }
</style>
