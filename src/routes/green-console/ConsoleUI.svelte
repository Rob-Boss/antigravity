<script lang="ts">
    import { onMount, tick } from "svelte";

    // Exposed state for the parent to control
    export let messages: string[] = [
        "Initializing Green Console...",
        "Connection established.",
        "System ready.",
    ];
    export let inputValue = "";

    // Auto-scroll logic
    let contentWrapper: HTMLElement;

    // Scroll to bottom whenever messages change
    $: if (messages && contentWrapper) {
        tick().then(() => {
            contentWrapper.scrollTop = contentWrapper.scrollHeight;
        });
    }

    // Cursor blinking effect
    let cursorVisible = true;
    onMount(() => {
        const interval = setInterval(() => {
            cursorVisible = !cursorVisible;
        }, 500);
        return () => clearInterval(interval);
    });
</script>

<div class="console-screen">
    <div class="scanlines"></div>
    <div class="content-wrapper" bind:this={contentWrapper}>
        {#each messages as msg}
            <div class="line">
                <span class="prefix">&gt;</span>
                <span class="text">{msg}</span>
            </div>
        {/each}

        <!-- Active Input Line -->
        <div class="line input-line">
            <span class="prefix">&gt;</span>
            <span class="text">{inputValue}</span>
            <span class="cursor" style:opacity={cursorVisible ? 1 : 0}>_</span>
        </div>
    </div>
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=VT323&display=swap");

    .monitor-screen {
        width: 800px;
        height: 600px; /* 4:3 Aspect Ratio */
        background-color: #000; /* Black background */
        color: #ffb000; /* Amber/Orange */
        font-family: "VT323", monospace;
        font-size: 32px;
        padding: 40px;
        box-sizing: border-box;
        overflow: hidden;
        position: relative;
        text-shadow:
            0 0 5px #ffb000,
            0 0 10px #ffb000; /* Bloom Effect */
    }

    .content-wrapper {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end; /* Bottom-up */
    }

    .previous-messages {
        display: flex;
        flex-direction: column;
        gap: 8px;
        overflow: hidden; /* Hide old messages off top */
    }

    .line {
        display: flex;
        gap: 12px;
        opacity: 0.9;
    }

    .active-line {
        display: flex;
        gap: 12px;
        margin-top: 8px;
    }

    .prefix {
        opacity: 0.7;
    }

    .cursor {
        animation: blink 1s step-end infinite;
    }

    @keyframes blink {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
    }

    /* Subtle scanline overlay */
    .monitor-screen::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            rgba(18, 16, 16, 0) 50%,
            rgba(0, 0, 0, 0.25) 50%
        );
        background-size: 100% 4px;
        pointer-events: none;
        opacity: 0.3;
        z-index: 10;
    }
</style>
