<script lang="ts">
    import { spring } from "svelte/motion";

    let isHovered = false;

    // Spring for the turbulence baseFrequency
    // x = baseFrequencyX, y = baseFrequencyY
    const turbulence = spring(
        { x: 0.01, y: 0.01 },
        {
            stiffness: 0.1,
            damping: 0.2,
        },
    );

    // Spring for the displacement scale
    const displacement = spring(0, {
        stiffness: 0.1,
        damping: 0.15,
    });

    function handleMouseMove(e: MouseEvent) {
        isHovered = true;

        // Map mouse position to turbulence frequency
        // This creates a "disturbance" that changes as you move across the letter
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        // Randomize slightly to feel organic
        turbulence.set({
            x: 0.02 + Math.abs(x - 0.5) * 0.1,
            y: 0.02 + Math.abs(y - 0.5) * 0.1,
        });

        // Increase displacement when moving
        displacement.set(30);
    }

    function handleMouseLeave() {
        isHovered = false;
        // Return to calm state
        turbulence.set({ x: 0.01, y: 0.01 });
        displacement.set(0);
    }

    function handleTouchMove(e: TouchEvent) {
        e.preventDefault();
        isHovered = true;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const touch = e.touches[0];
        const x = (touch.clientX - rect.left) / rect.width;
        const y = (touch.clientY - rect.top) / rect.height;

        turbulence.set({
            x: 0.02 + Math.abs(x - 0.5) * 0.1,
            y: 0.02 + Math.abs(y - 0.5) * 0.1,
        });
        displacement.set(30);
    }
</script>

<div
    class="letter-container"
    on:mousemove={handleMouseMove}
    on:mouseleave={handleMouseLeave}
    on:touchmove={handleTouchMove}
    on:touchstart={handleTouchMove}
    on:touchend={handleMouseLeave}
    role="presentation"
>
    <svg viewBox="0 0 200 300" class="letter-r">
        <defs>
            <filter id="ripple-filter">
                <feTurbulence
                    type="fractalNoise"
                    baseFrequency="{$turbulence.x} {$turbulence.y}"
                    numOctaves="2"
                    result="turbulence"
                />
                <feDisplacementMap
                    in2="turbulence"
                    in="SourceGraphic"
                    scale={$displacement}
                    xChannelSelector="R"
                    yChannelSelector="G"
                />
            </filter>
        </defs>

        <g style="filter: url(#ripple-filter)">
            <!-- The R Path -->
            <path
                d="M 60 250 L 60 50 L 120 50 Q 160 50 160 100 Q 160 150 120 150 L 60 150 M 100 150 L 150 250"
                fill="none"
                stroke="var(--text-primary)"
                stroke-width="15"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="r-shape"
            />

            <!-- Inner highlight for liquid feel -->
            <path
                d="M 60 250 L 60 50 L 120 50 Q 160 50 160 100 Q 160 150 120 150 L 60 150 M 100 150 L 150 250"
                fill="none"
                stroke="var(--accent-glow)"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
                opacity="0.5"
                class="r-highlight"
            />
        </g>
    </svg>
</div>

<style>
    .letter-container {
        display: inline-block;
        padding: 2rem;
        cursor: pointer;
        touch-action: none;
    }

    .letter-r {
        width: 200px;
        height: 300px;
        overflow: visible;
    }

    .r-shape {
        transition: stroke 0.3s ease;
    }

    .letter-container:hover .r-shape {
        stroke: var(--accent-glow);
    }

    @media (max-width: 768px) {
        .letter-r {
            width: 150px;
            height: 225px;
        }

        .letter-container {
            padding: 1rem;
        }
    }
</style>
