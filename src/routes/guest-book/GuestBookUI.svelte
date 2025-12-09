<script>
    let entries = [
        { name: "Alice", message: "First!" },
        { name: "System", message: "Welcome to the guest book." },
    ];
    let newName = "";
    let newMessage = "";

    function sign() {
        if (newName && newMessage) {
            entries = [...entries, { name: newName, message: newMessage }];
            newName = "";
            newMessage = "";
        }
    }
</script>

<div class="guest-book-container" on:pointerdown|stopPropagation>
    <div class="header">
        <h3>GUEST BOOK</h3>
        <div class="status">ONLINE</div>
    </div>

    <div class="entries-list">
        {#each entries as entry}
            <div class="entry">
                <span class="name">&gt; {entry.name}</span>
                <span class="message">{entry.message}</span>
            </div>
        {/each}
    </div>

    <div class="input-area">
        <input class="retro-input" bind:value={newName} placeholder="NAME" />
        <input
            class="retro-input"
            bind:value={newMessage}
            placeholder="MESSAGE"
        />
        <button class="retro-btn" on:click={sign}>SUBMIT</button>
    </div>
</div>

<style>
    .guest-book-container {
        width: 400px;
        height: 300px;
        background-color: rgba(0, 0, 0, 0.9);
        border: none;
        border-radius: 40px; /* CRT rounded corners */
        padding: 30px;
        font-family: "Courier New", Courier, monospace;
        color: #33ff00;
        display: flex;
        flex-direction: column;
        gap: 15px;
        box-shadow:
            inset 0 0 30px rgba(0, 0, 0, 0.8),
            0 0 10px rgba(51, 255, 0, 0.1);
        overflow: hidden;
        position: relative;
    }

    /* CRT Scanline Effect */
    .guest-book-container::before {
        content: " ";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: linear-gradient(
                rgba(18, 16, 16, 0) 50%,
                rgba(0, 0, 0, 0.25) 50%
            ),
            linear-gradient(
                90deg,
                rgba(255, 0, 0, 0.06),
                rgba(0, 255, 0, 0.02),
                rgba(0, 0, 255, 0.06)
            );
        z-index: 2;
        background-size:
            100% 2px,
            3px 100%;
        pointer-events: none;
        border-radius: 40px;
    }

    /* Screen curvature reflection/glare simulation */
    .guest-book-container::after {
        content: " ";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: radial-gradient(
            circle at 50% 50%,
            rgba(255, 255, 255, 0) 60%,
            rgba(0, 0, 0, 0.4) 100%
        );
        z-index: 3;
        pointer-events: none;
        border-radius: 40px;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #333;
        padding-bottom: 10px;
        position: relative;
        z-index: 4;
    }

    h3 {
        margin: 0;
        font-size: 1.5rem;
        text-shadow: 0 0 5px #33ff00;
    }

    .status {
        font-size: 0.8rem;
        animation: blink 2s infinite;
    }

    .entries-list {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding-right: 5px;
        position: relative;
        z-index: 4;
    }

    .entry {
        display: flex;
        flex-direction: column;
        gap: 2px;
        border-bottom: 1px dashed #1a1a1a;
        padding-bottom: 4px;
    }

    .name {
        font-weight: bold;
        opacity: 0.8;
    }

    .message {
        padding-left: 15px;
        opacity: 0.9;
    }

    .input-area {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        position: relative;
        z-index: 4;
    }

    .retro-input {
        background: #111;
        border: 1px solid #33ff00;
        color: #33ff00;
        padding: 8px;
        font-family: inherit;
        flex: 1;
        min-width: 120px;
        border-radius: 4px;
    }

    .retro-input::placeholder {
        color: rgba(51, 255, 0, 0.5);
    }

    .retro-btn {
        background: #33ff00;
        color: #000;
        border: none;
        padding: 8px 16px;
        font-family: inherit;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s;
        border-radius: 4px;
    }

    .retro-btn:hover {
        background: #fff;
        box-shadow: 0 0 10px #fff;
    }

    /* Scrollbar styling */
    .entries-list::-webkit-scrollbar {
        width: 8px;
    }
    .entries-list::-webkit-scrollbar-track {
        background: #111;
    }
    .entries-list::-webkit-scrollbar-thumb {
        background: #333;
        border-radius: 4px;
    }
    .entries-list::-webkit-scrollbar-thumb:hover {
        background: #444;
    }

    @keyframes blink {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }
</style>
