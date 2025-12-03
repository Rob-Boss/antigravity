<script lang="ts">
    let icons = [
        { id: 1, name: "System", x: 20, y: 20 },
        { id: 2, name: "Trash", x: 20, y: 300 },
        { id: 3, name: "Files", x: 100, y: 20 },
    ];

    let dragging: number | null = null;

    function startDrag(id: number) {
        dragging = id;
    }

    function endDrag() {
        dragging = null;
    }

    function handleMouseMove(e: MouseEvent) {
        if (dragging) {
            const idx = icons.findIndex((i) => i.id === dragging);
            if (idx !== -1) {
                const rect = (
                    e.currentTarget as HTMLElement
                ).getBoundingClientRect();
                icons[idx].x = e.clientX - rect.left - 25;
                icons[idx].y = e.clientY - rect.top - 25;
            }
        }
    }
</script>

<div class="hud-icon" on:mousemove={handleMouseMove} on:mouseup={endDrag}>
    <div class="desktop-pattern"></div>

    {#each icons as icon}
        <div
            class="icon-container"
            style="top: {icon.y}px; left: {icon.x}px"
            on:mousedown={() => startDrag(icon.id)}
        >
            <div class="icon-graphic">
                {#if icon.name === "Trash"}
                    <div class="trash-can"></div>
                {:else}
                    <div class="folder"></div>
                {/if}
            </div>
            <div class="icon-label">{icon.name}</div>
        </div>
    {/each}

    <div class="window-frame">
        <div class="win-header">
            <div class="win-title">C:\> COMMAND</div>
            <div class="win-btns">
                <div class="btn min">_</div>
                <div class="btn max">□</div>
                <div class="btn close">x</div>
            </div>
        </div>
        <div class="win-body">
            C:\> DIR /W<br />
            VOLUME IN DRIVE C IS SYSTEM<br />
            <br />
            [SYSTEM] [TRASH] [FILES]<br />
            <br />
            C:\> _
        </div>
    </div>
</div>

<style>
    .hud-icon {
        width: 100%;
        height: 100%;
        background: #008080; /* Windows Teal */
        position: relative;
        overflow: hidden;
        font-family: "Tahoma", sans-serif;
        user-select: none;
    }

    .icon-container {
        position: absolute;
        width: 60px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        cursor: pointer;
    }

    .icon-graphic {
        width: 32px;
        height: 32px;
    }

    .folder {
        width: 100%;
        height: 100%;
        background: #ffd700;
        border: 2px solid #000;
        border-radius: 2px 10px 2px 2px;
        box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
    }

    .trash-can {
        width: 100%;
        height: 100%;
        background: #ccc;
        border: 2px solid #000;
        background-image: linear-gradient(#000 1px, transparent 1px);
        background-size: 100% 4px;
    }

    .icon-label {
        color: #fff;
        font-size: 12px;
        text-shadow: 1px 1px 0 #000;
        background: rgba(0, 0, 0, 0.2);
        padding: 2px 4px;
    }

    .window-frame {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        height: 250px;
        background: #c0c0c0;
        border: 2px solid #fff;
        border-right-color: #000;
        border-bottom-color: #000;
        box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
    }

    .win-header {
        background: #000080;
        color: #fff;
        padding: 2px 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: bold;
        font-size: 12px;
    }

    .win-btns {
        display: flex;
        gap: 2px;
    }

    .btn {
        width: 16px;
        height: 14px;
        background: #c0c0c0;
        border: 1px solid #fff;
        border-right-color: #000;
        border-bottom-color: #000;
        color: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        cursor: pointer;
    }
    .btn:active {
        border: 1px solid #000;
        border-right-color: #fff;
        border-bottom-color: #fff;
    }

    .win-body {
        flex: 1;
        background: #000;
        color: #c0c0c0;
        font-family: "Courier New", monospace;
        padding: 10px;
        font-size: 14px;
    }
</style>
