<script lang="ts">
    let health = 3;
    let score = 0;

    function addScore() {
        score += 100;
    }

    function toggleHealth() {
        health = health > 0 ? health - 1 : 3;
    }
</script>

<div class="hud-pixel" on:click={addScore}>
    <div class="game-view">
        <!-- Pixel Art Clouds -->
        <div class="cloud c1"></div>
        <div class="cloud c2"></div>

        <!-- Ground -->
        <div class="ground-blocks">
            {#each Array(20) as _}
                <div class="block"></div>
            {/each}
        </div>
    </div>

    <!-- HUD Layer -->
    <div class="ui-layer">
        <div class="top-bar">
            <div class="score">SCORE: {score.toString().padStart(6, "0")}</div>
            <div class="health" on:click|stopPropagation={toggleHealth}>
                {#each Array(3) as _, i}
                    <div class="heart" class:empty={i >= health}></div>
                {/each}
            </div>
        </div>

        <div class="dialog-box">
            <div class="avatar"></div>
            <div class="text">IT'S DANGEROUS TO GO ALONE! TAKE THIS.</div>
            <div class="next-arrow">▼</div>
        </div>
    </div>
</div>

<style>
    .hud-pixel {
        width: 100%;
        height: 100%;
        background: #5c94fc; /* Sky Blue */
        font-family: "Press Start 2P", monospace; /* Fallback to monospace if font not loaded */
        image-rendering: pixelated;
        position: relative;
        overflow: hidden;
        cursor: pointer;
    }

    .game-view {
        position: absolute;
        inset: 0;
    }

    .cloud {
        position: absolute;
        background: #fff;
        width: 60px;
        height: 20px;
        box-shadow:
            20px 0 0 #fff,
            -20px 0 0 #fff,
            0 -20px 0 #fff;
    }
    .c1 {
        top: 50px;
        left: 100px;
        animation: float 20s linear infinite;
    }
    .c2 {
        top: 100px;
        left: 400px;
        animation: float 30s linear infinite;
    }

    .ground-blocks {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 40px;
        display: flex;
    }

    .block {
        width: 40px;
        height: 40px;
        background: #c84c0c; /* Brick Red */
        border: 4px solid #000;
        box-sizing: border-box;
        box-shadow: inset 4px 4px 0 #f0bc3c;
    }

    .ui-layer {
        position: absolute;
        inset: 0;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .top-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-shadow: 4px 4px 0 #000;
        color: #fff;
        font-size: 20px;
    }

    .health {
        display: flex;
        gap: 10px;
        cursor: pointer;
    }

    .heart {
        width: 20px;
        height: 20px;
        background: #f00;
        box-shadow: 4px 4px 0 #000;
    }
    .heart.empty {
        background: #ccc;
    }

    .dialog-box {
        background: #000;
        border: 4px solid #fff;
        padding: 20px;
        color: #fff;
        display: flex;
        gap: 20px;
        align-items: center;
        font-size: 14px;
        line-height: 1.5;
    }

    .avatar {
        width: 60px;
        height: 60px;
        background: #f0bc3c;
        border: 4px solid #fff;
    }

    .next-arrow {
        margin-left: auto;
        animation: bounce 0.5s infinite;
    }

    @keyframes float {
        from {
            transform: translateX(100vw);
        }
        to {
            transform: translateX(-200px);
        }
    }

    @keyframes bounce {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(5px);
        }
    }
</style>
