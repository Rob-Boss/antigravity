<script lang="ts">
    import { onMount } from "svelte";

    export let name = "";
    export let message = "";
    export let activeField: "name" | "message" | null = null;

    onMount(() => {
        console.log("KeyboardUI Mounted");
    });
</script>

<div class="keyboard-screen">
    <!-- SIMPLE DEBUG BLOCK -->
    <div
        style="width: 100%; height: 100%; background: red; display: flex; align-items: center; justify-content: center; font-size: 50px; font-weight: bold; color: white;"
    >
        TEST IMAGE
    </div>
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=VT323&display=swap");

    .keyboard-screen {
        width: 800px; /* Horizontal */
        height: 200px;
        background-color: #444; /* DEBUG: Visible Grey */
        color: #ffb000;
        /* font-family: "VT323", monospace; */
        font-family: Arial, sans-serif; /* DEBUG: Fallback Font */
        font-size: 28px;
        box-sizing: border-box;
        display: flex;
        align-items: stretch;
        padding: 10px;
        gap: 15px;
        border: 20px solid red; /* DEBUG: MASSIVE BORDER */
    }

    .field {
        display: flex;
        flex-direction: column;
        border: 2px solid #553300;
        padding: 10px;
        background: #110900;
        transition:
            border-color 0.2s,
            box-shadow 0.2s;
    }

    .field.active {
        border-color: #ffb000;
        box-shadow: 0 0 10px #ffb000;
        background: #221100;
    }

    .name-field {
        flex: 3; /* 30% roughly */
    }

    .message-field {
        flex: 5; /* 50% roughly */
    }

    .submit-btn {
        flex: 2; /* 20% roughly */
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #ffb000;
        background: #331a00;
        cursor: pointer; /* Visual cue, though mouse is in 3D */
        font-weight: bold;
        transition: background 0.2s;
    }

    .label {
        font-size: 0.8em;
        opacity: 0.7;
        margin-bottom: 5px;
    }

    .input-box {
        flex: 1;
        word-wrap: break-word;
        line-height: 1.1;
        overflow: hidden;
    }
</style>
