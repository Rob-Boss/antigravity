<script lang="ts">
    export let flipped = false;
    export let zIndex = 0;

    let flipping = false;

    // Trigger droop animation on flip change
    $: if (flipped !== undefined) {
        triggerFlip();
    }

    function triggerFlip() {
        flipping = false;
        setTimeout(() => (flipping = true), 10); // Reset animation
    }
</script>

<div class="sheet-container" style="z-index: {zIndex};">
    <div class="sheet-y" class:flipped>
        <div class="sheet-z" class:animate-droop={flipping}>
            <div class="back">
                <slot name="back" />
                <div class="stitching-back"></div>
                <div class="shadow-back"></div>
            </div>
            <div class="front">
                <slot name="front" />
                <div class="stitching-front"></div>
                <div class="shadow-front"></div>
            </div>
        </div>
    </div>
</div>

<style>
    .sheet-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        perspective: 1500px;
        pointer-events: none; /* Let clicks pass through container */
    }

    .sheet-y {
        position: relative;
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
        transition: transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
        transform-origin: left center;
        pointer-events: auto;
    }

    .sheet-y.flipped {
        transform: rotateY(-180deg);
    }

    .sheet-z {
        position: relative;
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
        transform-origin: left center;
    }

    .sheet-z.animate-droop {
        animation: droop 0.6s ease-in-out;
    }

    @keyframes droop {
        0% {
            transform: rotateZ(0deg);
        }
        50% {
            transform: rotateZ(-3deg);
        } /* Subtle droop */
        100% {
            transform: rotateZ(0deg);
        }
    }

    .front,
    .back {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        background: white;
        box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .front {
        z-index: 2;
        /* Front faces right initially */
    }

    .back {
        transform: rotateY(180deg);
        z-index: 1;
        /* Back faces left initially */
    }

    /* Shadows */
    .shadow-front,
    .shadow-back {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        transition: opacity 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
        opacity: 0;
    }

    /* 
       When flipping:
       - Front face goes from 0 to -180. At -90 it's perpendicular.
       - Back face goes from 180 to 0. At 90 it's perpendicular.
       
       We want a shadow that appears when the page is lifting/curving.
       A simple gradient on the spine side can help.
    */

    .shadow-front {
        background: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.2),
            transparent 20%
        );
    }

    .shadow-back {
        background: linear-gradient(
            to left,
            rgba(0, 0, 0, 0.2),
            transparent 20%
        );
    }

    /* 
       To animate shadows based on flip state is tricky with just CSS class toggling.
       However, we can use the fact that when 'flipped' is true, the front is hidden and back is shown.
       But the transition happens over time.
       
       Ideally, we'd want opacity to peak at 50% rotation.
       CSS transitions go from A to B.
       
       Let's try a simpler "spine shadow" that is always there but subtle, 
       and maybe a dynamic shadow on the page below?
       
       Actually, the user asked for "bend / curve".
       A static gradient on the spine edge (left for front, right for back) simulates curvature near the binding.
    */

    .shadow-front {
        background: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.1) 0%,
            rgba(0, 0, 0, 0.05) 5%,
            transparent 15%
        );
        opacity: 1; /* Always visible to simulate spine curve */
    }

    .shadow-back {
        background: linear-gradient(
            to left,
            rgba(0, 0, 0, 0.1) 0%,
            rgba(0, 0, 0, 0.05) 5%,
            transparent 15%
        );
        opacity: 1;
    }
</style>
