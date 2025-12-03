<script lang="ts">
    let activeCard = 1;
    const totalCards = 3;

    function nextCard() {
        activeCard = activeCard < totalCards ? activeCard + 1 : 1;
    }

    function prevCard() {
        activeCard = activeCard > 1 ? activeCard - 1 : totalCards;
    }
</script>

<div class="hud-hyper">
    <div class="mac-window">
        <div class="title-bar">
            <div class="close-box"></div>
            <div class="title-text">HyperStack 1.0</div>
            <div class="lines"></div>
        </div>

        <div class="card-content">
            {#if activeCard === 1}
                <div class="card c1">
                    <h1>WELCOME</h1>
                    <div class="dither-box"></div>
                    <p>Welcome to the Stack.</p>
                    <button class="mac-btn">Click Me</button>
                </div>
            {:else if activeCard === 2}
                <div class="card c2">
                    <h1>DATA</h1>
                    <div class="field">Name: User</div>
                    <div class="field">Status: Online</div>
                    <div class="check-group">
                        <label><input type="checkbox" checked /> Audio</label>
                        <label><input type="checkbox" /> Video</label>
                    </div>
                </div>
            {:else}
                <div class="card c3">
                    <h1>TOOLS</h1>
                    <div class="tool-grid">
                        {#each Array(9) as _}
                            <div class="tool-icon"></div>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>

        <div class="nav-bar">
            <button class="nav-btn" on:click={prevCard}>←</button>
            <div class="page-num">{activeCard} / {totalCards}</div>
            <button class="nav-btn" on:click={nextCard}>→</button>
        </div>
    </div>
</div>

<style>
    .hud-hyper {
        width: 100%;
        height: 100%;
        background: #888;
        /* Desktop Pattern */
        background-image: linear-gradient(
                45deg,
                #000 25%,
                transparent 25%,
                transparent 75%,
                #000 75%,
                #000
            ),
            linear-gradient(
                45deg,
                #000 25%,
                transparent 25%,
                transparent 75%,
                #000 75%,
                #000
            );
        background-size: 4px 4px;
        background-position:
            0 0,
            2px 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "Geneva", "Verdana", sans-serif;
    }

    .mac-window {
        width: 400px;
        height: 300px;
        background: #fff;
        border: 2px solid #000;
        box-shadow: 4px 4px 0 #000;
        display: flex;
        flex-direction: column;
    }

    .title-bar {
        height: 24px;
        border-bottom: 2px solid #000;
        display: flex;
        align-items: center;
        padding: 0 4px;
        gap: 10px;
        background: repeating-linear-gradient(
            0deg,
            #fff,
            #fff 2px,
            #000 2px,
            #000 4px
        );
    }

    .close-box {
        width: 16px;
        height: 16px;
        background: #fff;
        border: 2px solid #000;
        box-shadow: inset 2px 2px 0 #000;
    }

    .title-text {
        background: #fff;
        padding: 0 10px;
        font-weight: bold;
        font-size: 14px;
    }

    .lines {
        flex: 1;
    }

    .card-content {
        flex: 1;
        padding: 20px;
        position: relative;
    }

    .card {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
    }

    h1 {
        font-size: 24px;
        text-decoration: underline;
    }

    .dither-box {
        width: 100px;
        height: 100px;
        border: 2px solid #000;
        background-image: radial-gradient(#000 1px, transparent 1px);
        background-size: 4px 4px;
    }

    .mac-btn {
        background: #fff;
        border: 2px solid #000;
        border-radius: 10px;
        padding: 5px 20px;
        font-family: inherit;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 2px 2px 0 #000;
    }
    .mac-btn:active {
        background: #000;
        color: #fff;
        box-shadow: none;
        transform: translate(2px, 2px);
    }

    .field {
        width: 200px;
        border: 1px solid #000;
        padding: 5px;
        box-shadow: 2px 2px 0 #ccc;
        font-family: "Courier New", monospace;
    }

    .check-group {
        display: flex;
        gap: 20px;
    }

    .tool-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 5px;
    }

    .tool-icon {
        width: 32px;
        height: 32px;
        border: 2px solid #000;
        background: repeating-linear-gradient(
            45deg,
            #fff,
            #fff 2px,
            #ccc 2px,
            #ccc 4px
        );
    }

    .nav-bar {
        height: 40px;
        border-top: 2px solid #000;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
        background: #eee;
    }

    .nav-btn {
        background: #fff;
        border: 1px solid #000;
        width: 30px;
        height: 24px;
        cursor: pointer;
        box-shadow: 2px 2px 0 #000;
    }
    .nav-btn:active {
        transform: translate(2px, 2px);
        box-shadow: none;
    }
</style>
