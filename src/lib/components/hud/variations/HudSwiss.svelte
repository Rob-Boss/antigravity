<script lang="ts">
    let gridVisible = true;
</script>

<div class="hud-swiss" on:click={() => (gridVisible = !gridVisible)}>
    {#if gridVisible}
        <div class="grid-overlay"></div>
    {/if}

    <div class="layout">
        <div class="header">
            <h1>HELVETICA</h1>
            <div class="meta">FIG. 01</div>
        </div>

        <div class="content-block">
            <div class="stat-row">
                <span class="label">VELOCITY</span>
                <span class="value">045.2</span>
            </div>
            <div class="stat-row">
                <span class="label">ALTITUDE</span>
                <span class="value">12,400</span>
            </div>
            <div class="stat-row">
                <span class="label">HEADING</span>
                <span class="value">NW 320</span>
            </div>
        </div>

        <div class="footer">
            <div class="circle-indicator"></div>
            <div class="fine-print">
                DESIGN SYSTEM 2025<br />
                INTERNATIONAL STYLE
            </div>
        </div>
    </div>
</div>

<style>
    .hud-swiss {
        width: 100%;
        height: 100%;
        background: #f0f0f0;
        color: #000;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .grid-overlay {
        position: absolute;
        inset: 0;
        background-image: linear-gradient(#e0e0e0 1px, transparent 1px),
            linear-gradient(90deg, #e0e0e0 1px, transparent 1px);
        background-size: 50px 50px;
        pointer-events: none;
    }

    .layout {
        width: 400px;
        height: 500px;
        border: 4px solid #000;
        background: #fff;
        padding: 40px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        z-index: 10;
        box-shadow: 20px 20px 0 rgba(0, 0, 0, 0.1);
    }

    h1 {
        font-size: 48px;
        font-weight: 900;
        letter-spacing: -2px;
        margin: 0;
        line-height: 1;
    }

    .meta {
        font-size: 12px;
        font-weight: bold;
        margin-top: 10px;
        border-top: 2px solid #000;
        padding-top: 5px;
        display: inline-block;
    }

    .content-block {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .stat-row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        border-bottom: 1px solid #000;
        padding-bottom: 5px;
    }

    .label {
        font-weight: bold;
        font-size: 14px;
    }

    .value {
        font-family: "Courier New", monospace;
        font-size: 18px;
    }

    .footer {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }

    .circle-indicator {
        width: 40px;
        height: 40px;
        background: #000;
        border-radius: 50%;
    }

    .fine-print {
        font-size: 10px;
        text-align: right;
        line-height: 1.4;
    }
</style>
