<script lang="ts">
    let tool = "pencil";
</script>

<div class="hud-paint">
    <div class="toolbar">
        {#each ["pencil", "brush", "bucket", "spray", "text", "eraser"] as t}
            <button
                class="tool-btn"
                class:active={tool === t}
                on:click={() => (tool = t)}
            >
                <div class="icon {t}"></div>
            </button>
        {/each}

        <div class="pattern-box"></div>
    </div>

    <div class="canvas-area" class:cursor-pencil={tool === "pencil"}>
        <div class="drawing">
            <svg width="100%" height="100%">
                <path
                    d="M50,150 Q150,50 250,150 T450,150"
                    fill="none"
                    stroke="#000"
                    stroke-width="2"
                />
                <circle
                    cx="150"
                    cy="100"
                    r="20"
                    fill="none"
                    stroke="#000"
                    stroke-width="2"
                />
                <rect
                    x="300"
                    y="80"
                    width="40"
                    height="40"
                    fill="url(#pattern)"
                    stroke="#000"
                />

                <defs>
                    <pattern
                        id="pattern"
                        width="4"
                        height="4"
                        patternUnits="userSpaceOnUse"
                    >
                        <rect width="2" height="2" fill="#000" />
                    </pattern>
                </defs>
            </svg>
        </div>
    </div>
</div>

<style>
    .hud-paint {
        width: 100%;
        height: 100%;
        background: #fff;
        display: flex;
        font-family: sans-serif;
    }

    .toolbar {
        width: 60px;
        border-right: 2px solid #000;
        padding: 5px;
        display: flex;
        flex-direction: column;
        gap: 5px;
        background: repeating-linear-gradient(
            45deg,
            #fff,
            #fff 2px,
            #eee 2px,
            #eee 4px
        );
    }

    .tool-btn {
        width: 46px;
        height: 46px;
        border: 2px solid #000;
        background: #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .tool-btn.active {
        background: #000;
        color: #fff;
    }
    .tool-btn.active .icon {
        filter: invert(1);
    }

    .icon {
        width: 24px;
        height: 24px;
        background: #000;
        mask-size: contain;
        mask-repeat: no-repeat;
        mask-position: center;
    }
    /* Simple CSS shapes for icons */
    .pencil {
        clip-path: polygon(0 100%, 20% 80%, 100% 0, 80% 0, 0 80%);
    }
    .brush {
        border-radius: 50% 50% 0 50%;
        transform: rotate(45deg);
    }
    .bucket {
        clip-path: polygon(20% 0, 80% 0, 100% 100%, 0 100%);
    }
    .spray {
        clip-path: polygon(20% 0, 80% 0, 80% 30%, 100% 100%, 0 100%, 20% 30%);
    }
    .text::after {
        content: "A";
        color: #fff;
        font-weight: bold;
        font-size: 20px;
    }
    .text {
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .eraser {
        transform: skew(-20deg);
    }

    .pattern-box {
        margin-top: auto;
        width: 46px;
        height: 46px;
        border: 2px solid #000;
        background-image: radial-gradient(#000 1px, transparent 1px);
        background-size: 4px 4px;
    }

    .canvas-area {
        flex: 1;
        position: relative;
        cursor: crosshair;
    }

    .drawing {
        width: 100%;
        height: 100%;
    }
</style>
