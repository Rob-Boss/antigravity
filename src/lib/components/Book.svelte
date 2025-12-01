<script lang="ts">
    import { guestbookEntries, type GuestbookEntry } from "../stores";
    import BookSheet from "./BookSheet.svelte";
    import { onMount } from "svelte";

    let entries: GuestbookEntry[] = [];

    // Subscribe to store
    guestbookEntries.subscribe((value) => {
        entries = value;
    });

    // State
    let currentSheetIndex = 0; // The sheet currently on top of the right stack (or the one just flipped)
    // Actually, let's define it as: how many sheets are flipped?
    // 0 = Cover is closed (0 sheets flipped).
    // 1 = Cover is open (1 sheet flipped).
    let sortBy: "newest" | "popular" = "newest";

    // Derived sheets
    // Sheet 0: Front=Cover, Back=Input
    // Sheet 1: Front=Entry[0], Back=Entry[1]
    // Sheet 2: Front=Entry[2], Back=Entry[3]
    // ...

    // Derived
    $: sortedEntries = [...entries].sort((a, b) => {
        if (sortBy === "popular") {
            const scoreA = (a.upvotes || 0) - (a.downvotes || 0);
            const scoreB = (b.upvotes || 0) - (b.downvotes || 0);
            return scoreB - scoreA;
        } else {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
    });

    $: totalSheets = 1 + Math.ceil(sortedEntries.length / 2);

    function flipForward() {
        if (currentSheetIndex < totalSheets) {
            currentSheetIndex++;
        }
    }

    function flipBackward() {
        if (currentSheetIndex > 0) {
            currentSheetIndex--;
        }
    }

    function goToStart() {
        currentSheetIndex = 1; // Go to Input/First Entry
    }

    // Input Form State
    let newName = "";
    let newMessage = "";

    function handleSubmit() {
        if (!newName || !newMessage) return;

        const newEntry: GuestbookEntry = {
            id: crypto.randomUUID(),
            name: newName,
            message: newMessage,
            date: new Date(),
            upvotes: 0,
            downvotes: 0,
        };

        guestbookEntries.update((e) => [newEntry, ...e]);
        newName = "";
        newMessage = "";

        // Ensure we are looking at the first page of entries (Sheet 1)
        // If we are at Sheet 0 (Input), we flip to Sheet 1 to see the new entry.
        // Wait a tick for the store to update and re-render?
        // Actually, the new entry will be on Sheet 1 Front.
        // If we are at Sheet 0, the user sees the Input (Back of Sheet 0) and Entry 1 (Front of Sheet 1).
        // Wait, if we are at Sheet 0 (1 sheet flipped? No).
        // Let's clarify index.
        // currentSheetIndex = number of sheets flipped to the left.
        // If 0: All on right. Visible: Sheet 0 Front (Cover).
        // If 1: Sheet 0 on left. Visible: Sheet 0 Back (Input) | Sheet 1 Front (Entry 1).
        // So if we are at state 1 (Input visible), and we add an entry:
        // The new entry becomes Entry 1. It appears on Sheet 1 Front.
        // So the user sees it immediately on the right page.
        // No need to change index, unless we want to animate something.
    }

    function handleVote(id: string, type: "up" | "down") {
        guestbookEntries.update((items) => {
            return items.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        upvotes:
                            type === "up"
                                ? (item.upvotes || 0) + 1
                                : item.upvotes || 0,
                        downvotes:
                            type === "down"
                                ? (item.downvotes || 0) + 1
                                : item.downvotes || 0,
                    };
                }
                return item;
            });
        });
    }

    function formatDate(date: Date) {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        }).format(date);
    }
</script>

<div class="book-scene">
    <div class="external-controls">
        <div class="sort-controls">
            <label>Sort by:</label>
            <button
                class:active={sortBy === "newest"}
                on:click={() => (sortBy = "newest")}>Newest</button
            >
            <button
                class:active={sortBy === "popular"}
                on:click={() => (sortBy = "popular")}>Popular</button
            >
        </div>
        {#if currentSheetIndex > 1}
            <button class="back-btn" on:click={goToStart}>Back to Start</button>
        {/if}
    </div>

    <div class="book" class:centered={currentSheetIndex > 0}>
        <!-- Render Sheets in reverse order so lower sheets are behind? 
             Actually, z-index handles stacking. Order in DOM matters for default stacking context.
             Let's render 0 to N.
        -->
        {#each Array(totalSheets) as _, i}
            <BookSheet
                flipped={i < currentSheetIndex}
                zIndex={i < currentSheetIndex ? i : totalSheets - i}
            >
                <div
                    slot="front"
                    class="page-content front-page"
                    on:click={() => {
                        if (i === currentSheetIndex) flipForward();
                    }}
                >
                    {#if i === 0}
                        <!-- Cover -->
                        <div class="cover">
                            <h1>Guestbook</h1>
                            <p>Sign our book!</p>
                            <span class="hint">(Click to Open)</span>
                        </div>
                    {:else}
                        <!-- Entry (Odd index in array: 0, 2, 4...) -->
                        <!-- i=1 -> entry[0] -->
                        <!-- i=2 -> entry[2] -->
                        {@const entry = sortedEntries[(i - 1) * 2]}
                        {#if entry}
                            <div class="entry">
                                <div class="entry-header">
                                    <span class="date"
                                        >{formatDate(entry.date)}</span
                                    >
                                </div>
                                <p class="message">"{entry.message}"</p>
                                <p class="author">- {entry.name}</p>
                                <div
                                    class="vote-controls"
                                    on:click|stopPropagation
                                >
                                    <button
                                        on:click={() =>
                                            handleVote(entry.id, "up")}
                                        >▲ {entry.upvotes || 0}</button
                                    >
                                    <button
                                        on:click={() =>
                                            handleVote(entry.id, "down")}
                                        >▼ {entry.downvotes || 0}</button
                                    >
                                </div>
                            </div>
                        {:else}
                            <div class="empty-page">
                                <!-- Empty page at the end -->
                            </div>
                        {/if}
                        <div class="page-number">{i * 2 - 1}</div>
                    {/if}
                </div>

                <div
                    slot="back"
                    class="page-content back-page"
                    on:click={() => {
                        if (i === currentSheetIndex - 1) flipBackward();
                    }}
                >
                    {#if i === 0}
                        <!-- Inside Front Cover: Input Form -->
                        <div class="input-form" on:click|stopPropagation>
                            <h2>New Entry</h2>
                            <input
                                type="text"
                                placeholder="Name"
                                bind:value={newName}
                            />
                            <textarea
                                placeholder="Message"
                                bind:value={newMessage}
                            ></textarea>
                            <button on:click={handleSubmit}>Sign</button>
                        </div>
                    {:else}
                        <!-- Entry (Even index in array: 1, 3, 5...) -->
                        <!-- i=1 -> entry[1] -->
                        <!-- i=2 -> entry[3] -->
                        {@const entry = sortedEntries[(i - 1) * 2 + 1]}
                        {#if entry}
                            <div class="entry">
                                <div class="entry-header">
                                    <span class="date"
                                        >{formatDate(entry.date)}</span
                                    >
                                </div>
                                <p class="message">"{entry.message}"</p>
                                <p class="author">- {entry.name}</p>
                                <div
                                    class="vote-controls"
                                    on:click|stopPropagation
                                >
                                    <button
                                        on:click={() =>
                                            handleVote(entry.id, "up")}
                                        >▲ {entry.upvotes || 0}</button
                                    >
                                    <button
                                        on:click={() =>
                                            handleVote(entry.id, "down")}
                                        >▼ {entry.downvotes || 0}</button
                                    >
                                </div>
                            </div>
                        {:else}
                            <div class="empty-page"></div>
                        {/if}
                        <div class="page-number">{i * 2}</div>
                    {/if}
                </div>
            </BookSheet>
        {/each}
    </div>
</div>

<style>
    .book-scene {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: #f0f0f0;
        perspective: 2000px;
        overflow: hidden;
        color: #333 !important; /* Force override global text color */
    }

    .external-controls {
        margin-bottom: 2rem;
        display: flex;
        gap: 2rem;
        align-items: center;
        z-index: 100;
    }

    .back-btn {
        padding: 0.5rem 1rem;
        background: #333;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
    }

    .book {
        position: relative;
        width: 400px; /* Width of a single page */
        height: 600px;
        transform-style: preserve-3d;
        transition: transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
    }

    .book.centered {
        transform: translateX(
            50%
        ); /* Shift right by half width (200px) to center the spine */
    }

    .page-content {
        width: 100%;
        height: 100%;
        padding: 2rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        background: #fdfbf7; /* Paper color */
        border: 1px solid #e0e0e0;
        cursor: pointer;
        position: relative;
    }

    .cover {
        background: #2c3e50;
        color: white;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        border: 4px solid #1a252f;
    }

    .cover h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
        font-family: serif;
    }

    .hint {
        margin-top: 2rem;
        opacity: 0.7;
        font-size: 0.9rem;
    }

    .input-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        height: 100%;
        justify-content: center;
    }

    .input-form h2 {
        color: #333;
    }

    .input-form input,
    .input-form textarea {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-family: inherit;
    }

    .input-form textarea {
        height: 100px;
        resize: none;
    }

    .input-form button {
        padding: 0.5rem 1rem;
        background: #333;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
    }

    .sort-controls {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        font-size: 0.9rem;
    }

    .texture-selector {
        display: none;
    }

    .sort-controls button {
        background: transparent;
        color: #555;
        border: 1px solid #ccc;
        padding: 0.2rem 0.5rem;
        font-size: 0.8rem;
        cursor: pointer;
    }

    .sort-controls button.active {
        background: #333;
        color: white;
        border-color: #333;
    }

    .vote-controls {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
        justify-content: flex-end;
    }

    .vote-controls button {
        background: transparent;
        border: 1px solid #ddd;
        border-radius: 12px;
        padding: 0.2rem 0.6rem;
        font-size: 0.8rem;
        cursor: pointer;
        color: #555;
        transition: all 0.2s;
    }

    .vote-controls button:hover {
        background: #f0f0f0;
        border-color: #ccc;
    }

    .entry {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .entry-header {
        margin-bottom: 1rem;
        border-bottom: 1px solid #eee;
        padding-bottom: 0.5rem;
    }

    .date {
        font-size: 0.8rem;
        color: #888;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .message {
        font-size: 1.2rem;
        line-height: 1.6;
        font-family: serif;
        font-style: italic;
        margin-bottom: 1.5rem;
        color: black;
    }

    .author {
        text-align: right;
        font-weight: bold;
        color: #555;
    }

    .page-number {
        position: absolute;
        bottom: 1rem;
        width: 100%;
        text-align: center;
        left: 0;
        font-size: 0.8rem;
        color: #ccc;
    }

    .controls {
        margin-top: 2rem;
        display: flex;
        gap: 1rem;
        align-items: center;
        z-index: 100;
    }

    .controls button {
        padding: 0.5rem 1rem;
        cursor: pointer;
    }
</style>
