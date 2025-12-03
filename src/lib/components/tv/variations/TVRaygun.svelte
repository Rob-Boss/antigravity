<script lang="ts">
    import BubbleScreen from "./BubbleScreen.svelte";
</script>

<div class="tv-braun">
    <div class="clean-case">
        <div class="screen-matte">
            <BubbleScreen variant="matte" color="#e0e0e0" />
        </div>
        <div class="control-grid">
            <div class="orange-btn"></div>
            <div class="knob-minimal"></div>
            <div class="label">TV 1</div>
        </div>
    </div>
</div>

<style>
    .tv-braun {
        width: 320px;
        height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .clean-case {
        width: 300px;
        height: 240px;
        background: #f4f4f4; /* Off-white matte */
        border-radius: 4px;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05); /* Very subtle shadow */
        display: flex;
        padding: 20px;
        gap: 20px;
        align-items: center;
    }

    .screen-matte {
        width: 180px;
        height: 180px;
        background: #333;
        border-radius: 4px;
        overflow: hidden;
    }

    .control-grid {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 20px;
        padding-top: 10px;
    }

    .orange-btn {
        width: 12px;
        height: 12px;
        background: #ff4400; /* Braun Orange */
        border-radius: 50%;
    }

    .knob-minimal {
        width: 40px;
        height: 40px;
        background: #ddd;
        border-radius: 50%;
        position: relative;
    }
    .knob-minimal::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 2px;
        height: 15px;
        background: #333;
        transform: translate(-50%, -50%) rotate(45deg);
    }

    .label {
        font-family: "Helvetica", sans-serif;
        font-size: 10px;
        color: #666;
        margin-top: auto;
    }
</style>
