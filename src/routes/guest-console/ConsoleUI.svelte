<script lang="ts">
    import { afterUpdate } from "svelte";

    export let entries: {
        id: string;
        name: string;
        date: string;
        message: string;
    }[] = [];
    export let scrollOffset = 0;

    // We can rely on flex-end from CSS to keep it bottom-anchored if parent height is fixed.
</script>

<div class="console-screen">
    <div class="scanlines"></div>

    <!-- ABSOLUTE BOTTOM ANCHOR -->
    <!-- scrollOffset > 0 means moving the list DOWN to reveal older messages at the top -->
    <div class="bottom-anchor" style="bottom: -{scrollOffset}px;">
        {#each entries as entry (entry.id)}
            <div class="entry">
                <div class="meta">
                    <span class="date">[{entry.date}]</span>
                    <span class="name">&lt; {entry.name} &gt;</span>
                </div>
                <div class="message">
                    {entry.message}
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=VT323&display=swap");

    .console-screen {
        width: 800px;
        height: 600px;
        background-color: #000;
        color: #ffb000;
        font-family: "VT323", monospace;
        font-size: 28px;
        position: relative; /* Context for absolute positioning */
        overflow: hidden;
        /* text-shadow: 0 0 5px #ffb000; */ /* Removed shadow for sharper text? User said clean. */
        text-shadow: 0 0 2px #ffb000;
        box-sizing: border-box;
    }

    .bottom-anchor {
        position: absolute;
        bottom: 0px;
        left: 0px;
        width: 100%;
        padding: 40px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        /* No fixed height, grows upwards */
    }

    .entry {
        display: block;
        margin-bottom: 30px;
        opacity: 0.9;
        position: relative;
    }

    .meta {
        font-size: 0.8em;
        opacity: 0.7;
        margin-bottom: 5px;
        white-space: nowrap;
    }

    .name {
        font-weight: bold;
        margin-left: 10px;
    }

    .date {
        opacity: 0.8;
    }

    .message {
        display: block;
        line-height: 1.3;
        word-wrap: break-word;
    }

    .input-entry {
        margin-top: 10px;
        color: #fff;
        opacity: 1;
        margin-bottom: 0; /* Last item */
    }

    .cursor {
        display: inline-block;
        width: 10px;
        height: 1em;
        background: #ffb000;
        animation: blink 1s step-end infinite;
        vertical-align: text-bottom;
        margin-left: 5px;
    }

    .scanlines {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0) 50%,
            rgba(0, 0, 0, 0.2) 50%,
            rgba(0, 0, 0, 0.2)
        );
        background-size: 100% 4px;
        pointer-events: none;
        z-index: 10;
        opacity: 0.15;
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
</style>
