<script lang="ts">
    let bombs = [1];

    function addBomb() {
        if (bombs.length < 20) bombs = [...bombs, 1];
    }
</script>

<div class="hud-error" on:click={addBomb}>
    <div class="stripes"></div>

    <div class="dialog-box">
        <div class="icon-area">
            <div class="bomb-icon">
                <div class="fuse"></div>
                <div class="body"></div>
            </div>
        </div>

        <div class="message-area">
            <h2>SORRY, A SYSTEM ERROR OCCURRED.</h2>
            <p>ERROR TYPE 11</p>
            <button class="restart-btn">RESTART</button>
        </div>
    </div>

    <div class="bomb-field">
        {#each bombs as _, i}
            <div
                class="mini-bomb"
                style="left: {i * 20}px; top: {Math.sin(i) * 20}px"
            >
                💣
            </div>
        {/each}
    </div>
</div>

<style>
    .hud-error {
        width: 100%;
        height: 100%;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        font-family: "Chicago", "Impact", sans-serif;
    }

    .stripes {
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
            45deg,
            #000,
            #000 10px,
            #fff 10px,
            #fff 20px
        );
        opacity: 0.1;
    }

    .dialog-box {
        width: 400px;
        background: #fff;
        border: 2px solid #000;
        box-shadow: 10px 10px 0 rgba(0, 0, 0, 0.5);
        padding: 20px;
        display: flex;
        gap: 20px;
        z-index: 10;
    }

    .icon-area {
        width: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .bomb-icon {
        width: 60px;
        height: 60px;
        position: relative;
    }
    .body {
        width: 50px;
        height: 50px;
        background: #000;
        border-radius: 50%;
        position: absolute;
        bottom: 0;
        left: 5px;
    }
    .fuse {
        width: 20px;
        height: 20px;
        border-top: 4px solid #000;
        border-right: 4px solid #000;
        border-radius: 0 10px 0 0;
        position: absolute;
        top: 0;
        right: 10px;
    }

    .message-area {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    h2 {
        font-size: 18px;
        margin: 0;
    }

    .restart-btn {
        align-self: flex-end;
        background: #fff;
        border: 2px solid #000;
        border-radius: 20px;
        padding: 5px 20px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 2px 2px 0 #000;
    }
    .restart-btn:active {
        background: #000;
        color: #fff;
        box-shadow: none;
        transform: translate(2px, 2px);
    }

    .bomb-field {
        position: absolute;
        bottom: 20px;
        left: 20px;
        display: flex;
    }
    .mini-bomb {
        position: absolute;
        font-size: 20px;
    }
</style>
