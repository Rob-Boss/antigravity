<script lang="ts">
    import { Canvas } from "@threlte/core";
    import Scene from "$lib/components/threlte/Scene.svelte";
    import { guestbookEntries } from "$lib/stores";

    let newName = "";
    let newMessage = "";

    function handleSubmit() {
        if (!newName || !newMessage) return;

        guestbookEntries.update((e) => [
            {
                id: crypto.randomUUID(),
                name: newName,
                message: newMessage,
                date: new Date(),
                upvotes: 0,
                downvotes: 0,
            },
            ...e,
        ]);

        newName = "";
        newMessage = "";
    }
</script>

<div class="threlte-container">
    <div class="canvas-wrapper">
        <Canvas>
            <Scene />
        </Canvas>
    </div>

    <div class="ui-overlay">
        <div class="terminal-input">
            <div class="header">:: UPLINK_ESTABLISHED ::</div>
            <div class="input-group">
                <span class="prompt">ID:</span>
                <input
                    type="text"
                    bind:value={newName}
                    placeholder="Enter Name..."
                />
            </div>
            <div class="input-group">
                <span class="prompt">DATA:</span>
                <input
                    type="text"
                    bind:value={newMessage}
                    placeholder="Enter Message..."
                />
            </div>
            <button on:click={handleSubmit} disabled={!newName || !newMessage}>
                [ TRANSMIT ]
            </button>
        </div>

        <div class="controls-hint">
            LEFT CLICK + DRAG to Rotate<br />
            SCROLL to Zoom
        </div>
    </div>
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=VT323&display=swap");

    .threlte-container {
        width: 100vw;
        height: 100vh;
        background: #000;
        position: relative;
        font-family: "VT323", monospace;
        overflow: hidden;
    }

    .canvas-wrapper {
        width: 100%;
        height: 100%;
    }

    .ui-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 20px;
        box-sizing: border-box;
    }

    .terminal-input {
        pointer-events: auto;
        background: rgba(0, 20, 0, 0.8);
        border: 1px solid #00ff00;
        padding: 20px;
        width: 300px;
        border-radius: 5px;
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.2);
        backdrop-filter: blur(5px);
    }

    .header {
        color: #00ff00;
        text-align: center;
        margin-bottom: 15px;
        font-size: 1.2rem;
        text-shadow: 0 0 5px #00ff00;
    }

    .input-group {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        gap: 10px;
    }

    .prompt {
        color: #00ff00;
        width: 40px;
    }

    input {
        flex: 1;
        background: rgba(0, 50, 0, 0.5);
        border: 1px solid #005500;
        color: #00ff00;
        font-family: inherit;
        font-size: 1.1rem;
        padding: 5px;
        outline: none;
    }

    input:focus {
        border-color: #00ff00;
        box-shadow: 0 0 10px rgba(0, 255, 0, 0.2);
    }

    button {
        width: 100%;
        background: #003300;
        color: #00ff00;
        border: 1px solid #00ff00;
        padding: 10px;
        font-family: inherit;
        font-size: 1.2rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    button:hover:not(:disabled) {
        background: #00ff00;
        color: #000;
        box-shadow: 0 0 20px #00ff00;
    }

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .controls-hint {
        color: #005500;
        text-align: right;
        font-size: 1.2rem;
    }
</style>
