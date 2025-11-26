<script lang="ts">
    import { spring } from "svelte/motion";

    let isHovered = false;
    let lastMouseX = 0;

    // Spring for the rotation angle (degrees)
    const angle = spring(0, {
        stiffness: 0.05, // Low stiffness for loose, vine-like feel
        damping: 0.1, // Low damping for prolonged swaying
    });

    // Secondary spring for the arms to add "lag" or "whip" effect
    const armAngle = spring(0, {
        stiffness: 0.03,
        damping: 0.15,
    });

    function handleMouseMove(e: MouseEvent) {
        const currentMouseX = e.clientX;
        const deltaX = currentMouseX - lastMouseX;
        lastMouseX = currentMouseX;

        isHovered = true;

        // Calculate "wind force"
        // Only apply if moving significantly
        if (Math.abs(deltaX) > 1) {
            // Add to the angle based on movement speed
            // Limit the force so it doesn't spin 360
            const force = Math.max(Math.min(deltaX * 0.5, 15), -15);

            // Update springs
            // We use .update to add to current value rather than .set
            angle.update((n) => {
                const newVal = n + force;
                // Clamp max rotation
                return Math.max(Math.min(newVal, 60), -60);
            });

            // Arms react slightly differently/later
            armAngle.update((n) => {
                const newVal = n + force * 1.2;
                return Math.max(Math.min(newVal, 80), -80);
            });
        }
    }

    function handleMouseEnter(e: MouseEvent) {
        isHovered = true;
        lastMouseX = e.clientX;
    }

    function handleMouseLeave() {
        isHovered = false;
        // Return to upright
        angle.set(0);
        armAngle.set(0);
    }

    function handleTouchMove(e: TouchEvent) {
        e.preventDefault();
        const touch = e.touches[0];
        const currentMouseX = touch.clientX;

        if (!isHovered) {
            lastMouseX = currentMouseX;
            isHovered = true;
            return;
        }

        const deltaX = currentMouseX - lastMouseX;
        lastMouseX = currentMouseX;

        if (Math.abs(deltaX) > 1) {
            const force = Math.max(Math.min(deltaX * 0.5, 15), -15);
            angle.update((n) => Math.max(Math.min(n + force, 60), -60));
            armAngle.update((n) =>
                Math.max(Math.min(n + force * 1.2, 80), -80),
            );
        }
    }
</script>

<div
    class="letter-container"
    on:mousemove={handleMouseMove}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    on:touchmove={handleTouchMove}
    on:touchstart={(e) => {
        isHovered = true;
        lastMouseX = e.touches[0].clientX;
    }}
    on:touchend={handleMouseLeave}
    role="presentation"
>
    <svg viewBox="0 0 200 300" class="letter-y">
        <!-- 
			Pivot point is bottom center (100, 250).
			We rotate the whole group around this point.
		-->
        <g transform="rotate({$angle}, 100, 250)">
            <!-- Stem -->
            <line
                x1="100"
                y1="250"
                x2="100"
                y2="150"
                stroke="var(--text-primary)"
                stroke-width="12"
                stroke-linecap="round"
                class="y-stem"
            />

            <!-- Arms Group - Rotates slightly more for "whip" effect -->
            <g transform="rotate({$armAngle - $angle}, 100, 150)">
                <!-- Left Arm -->
                <line
                    x1="100"
                    y1="150"
                    x2="50"
                    y2="50"
                    stroke="var(--text-primary)"
                    stroke-width="12"
                    stroke-linecap="round"
                    class="y-arm"
                />
                <!-- Right Arm -->
                <line
                    x1="100"
                    y1="150"
                    x2="150"
                    y2="50"
                    stroke="var(--text-primary)"
                    stroke-width="12"
                    stroke-linecap="round"
                    class="y-arm"
                />

                <!-- Highlights -->
                <line
                    x1="100"
                    y1="150"
                    x2="50"
                    y2="50"
                    stroke="var(--accent-glow)"
                    stroke-width="4"
                    stroke-linecap="round"
                    opacity="0.5"
                    transform="translate(0, 5)"
                />
                <line
                    x1="100"
                    y1="150"
                    x2="150"
                    y2="50"
                    stroke="var(--accent-glow)"
                    stroke-width="4"
                    stroke-linecap="round"
                    opacity="0.5"
                    transform="translate(0, 5)"
                />
            </g>

            <!-- Stem Highlight -->
            <line
                x1="100"
                y1="250"
                x2="100"
                y2="150"
                stroke="var(--accent-glow)"
                stroke-width="4"
                stroke-linecap="round"
                opacity="0.5"
                transform="translate(3, 0)"
            />
        </g>
    </svg>
</div>

<style>
    .letter-container {
        display: inline-block;
        padding: 2rem;
        cursor: grab;
        touch-action: none;
    }

    .letter-container:active {
        cursor: grabbing;
    }

    .letter-y {
        width: 200px;
        height: 300px;
        overflow: visible;
    }

    .y-stem,
    .y-arm {
        transition: stroke 0.3s ease;
    }

    .letter-container:hover .y-stem,
    .letter-container:hover .y-arm {
        stroke: var(--accent-glow);
    }

    @media (max-width: 768px) {
        .letter-y {
            width: 150px;
            height: 225px;
        }

        .letter-container {
            padding: 1rem;
        }
    }
</style>
