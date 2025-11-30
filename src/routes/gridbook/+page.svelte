<script lang="ts">
    import { onMount, tick } from "svelte";

    type Message = {
        id: string;
        text: string;
        font: string;
        x: number;
        y: number;
        timestamp: number;
    };

    const FONTS = [
        { name: "Sans Serif", value: "'Inter', -apple-system, sans-serif" },
        { name: "Serif", value: "'Georgia', 'Times New Roman', serif" },
        { name: "Mono", value: "'Courier New', 'Consolas', monospace" },
        { name: "Cursive", value: "'Brush Script MT', cursive" },
        { name: "Fantasy", value: "'Impact', 'Arial Black', sans-serif" },
    ];

    let messages: Message[] = [];
    let view = { x: 0, y: 0 };
    let isPanning = false;
    let lastMouse = { x: 0, y: 0 };
    let containerEl: HTMLElement;
    let editingId: string | null = null;
    let newMessage = "";
    let selectedFont = FONTS[0].value;

    function handleMouseDown(e: MouseEvent) {
        // Don't pan if clicking on a message editor
        if ((e.target as HTMLElement).closest(".message-editor")) return;

        isPanning = true;
        lastMouse = { x: e.clientX, y: e.clientY };
        containerEl.style.cursor = "grabbing";
    }

    function handleMouseMove(e: MouseEvent) {
        if (isPanning) {
            const dx = e.clientX - lastMouse.x;
            const dy = e.clientY - lastMouse.y;
            view = { x: view.x + dx, y: view.y + dy };
            lastMouse = { x: e.clientX, y: e.clientY };
        }
    }

    function handleMouseUp() {
        isPanning = false;
        containerEl.style.cursor = "grab";
    }

    function handleDoubleClick(e: MouseEvent) {
        if ((e.target as HTMLElement).closest(".message-editor")) return;
        if ((e.target as HTMLElement).closest(".message-item")) return;

        const x = e.clientX - view.x;
        const y = e.clientY - view.y;

        const newId =
            Date.now().toString() + Math.random().toString(36).substring(2, 9);

        messages = [
            ...messages,
            {
                id: newId,
                text: "",
                font: selectedFont,
                x,
                y,
                timestamp: Date.now(),
            },
        ];

        editingId = newId;
    }

    function saveMessage(id: string) {
        const msg = messages.find((m) => m.id === id);
        if (msg && !msg.text.trim()) {
            // Delete empty message
            messages = messages.filter((m) => m.id !== id);
        }
        editingId = null;
    }

    onMount(() => {
        const stored = localStorage.getItem("gridbook-messages");
        if (stored) {
            try {
                messages = JSON.parse(stored);
            } catch (e) {
                console.error("Failed to parse messages:", e);
            }
        }

        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    });

    $: {
        if (typeof window !== "undefined") {
            localStorage.setItem("gridbook-messages", JSON.stringify(messages));
        }
    }

    function formatTime(timestamp: number): string {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    }
</script>

<div
    bind:this={containerEl}
    class="guestbook"
    on:mousedown={handleMouseDown}
    on:dblclick={handleDoubleClick}
>
    <!-- Messages Layer -->
    <div
        class="messages-layer"
        style="transform: translate({view.x}px, {view.y}px);"
    >
        {#each messages as message (message.id)}
            <div
                class="message-item"
                style="
                    font-family: {message.font};
                    left: {message.x}px;
                    top: {message.y}px;
                "
            >
                {#if editingId === message.id}
                    <div class="message-editor" on:mousedown|stopPropagation>
                        <div class="editor-controls">
                            <div class="font-picker">
                                {#each FONTS as font}
                                    <button
                                        class="font-btn"
                                        class:selected={message.font ===
                                            font.value}
                                        style="font-family: {font.value};"
                                        on:click={() => {
                                            messages = messages.map((m) =>
                                                m.id === message.id
                                                    ? { ...m, font: font.value }
                                                    : m,
                                            );
                                        }}
                                    >
                                        {font.name}
                                    </button>
                                {/each}
                            </div>
                        </div>
                        <textarea
                            bind:value={message.text}
                            placeholder="Type your message..."
                            maxlength="280"
                            rows="4"
                            class="textarea-field"
                            style="font-family: {message.font};"
                            autofocus
                        ></textarea>
                        <button
                            class="btn-done"
                            on:click={() => saveMessage(message.id)}
                        >
                            Done
                        </button>
                    </div>
                {:else}
                    <p class="message-text">{message.text}</p>
                    <span class="message-time"
                        >{formatTime(message.timestamp)}</span
                    >
                {/if}
            </div>
        {/each}
    </div>
</div>

<style>
    .guestbook {
        position: fixed;
        inset: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        cursor: grab;
        user-select: none;
        overflow: hidden;
    }

    .messages-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .message-item {
        position: absolute;
        pointer-events: auto;
        animation: fadeIn 0.4s ease;
    }

    .message-editor {
        background: white;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
        min-width: 320px;
        max-width: 400px;
    }

    .editor-controls {
        margin-bottom: 1rem;
    }

    .font-picker {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .font-btn {
        padding: 0.4rem 0.8rem;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        background: white;
        cursor: pointer;
        font-size: 0.85rem;
        transition: all 0.3s ease;
    }

    .font-btn:hover {
        border-color: #667eea;
        transform: translateY(-1px);
    }

    .font-btn.selected {
        border-color: #667eea;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-weight: 600;
    }

    .textarea-field {
        width: 100%;
        padding: 1rem;
        border: 2px solid #e0e0e0;
        border-radius: 12px;
        font-size: 1rem;
        font-family: inherit;
        margin-bottom: 1rem;
        transition: border-color 0.3s ease;
        box-sizing: border-box;
        resize: vertical;
        min-height: 100px;
    }

    .textarea-field:focus {
        outline: none;
        border-color: #667eea;
    }

    .btn-done {
        width: 100%;
        padding: 0.75rem;
        border: none;
        border-radius: 10px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        transition: all 0.3s ease;
    }

    .btn-done:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
    }

    .message-text {
        color: white;
        font-size: 2rem;
        line-height: 1.4;
        margin: 0 0 0.5rem 0;
        word-wrap: break-word;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        max-width: 600px;
    }

    .message-time {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.7);
        font-family: "Inter", sans-serif;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @media (max-width: 768px) {
        .message-editor {
            min-width: 280px;
            max-width: calc(100vw - 2rem);
        }

        .message-text {
            font-size: 1.5rem;
            max-width: calc(100vw - 2rem);
        }

        .font-picker {
            flex-direction: column;
        }

        .font-btn {
            width: 100%;
        }
    }
</style>
