<script lang="ts">
    export let currentProgram: number;
    export let programs: { id: number; solved: boolean; locked: boolean }[];
    export let onSelect: (id: number) => void;
</script>

<div class="program-selector">
    <div class="label">PROGRAM SELECT</div>
    <div class="switches">
        {#each programs as prog}
            <button
                class="switch"
                class:active={currentProgram === prog.id}
                class:locked={prog.locked}
                class:solved={prog.solved}
                disabled={prog.locked}
                on:click={() => onSelect(prog.id)}
            >
                {prog.id}
                {#if prog.locked}
                    <span class="lock-icon">🔒</span>
                {/if}
                {#if prog.solved}
                    <span class="solved-indicator"></span>
                {/if}
            </button>
        {/each}
    </div>
</div>

<style>
    .program-selector {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .label {
        font-size: 0.8rem;
        color: #ffb000;
        opacity: 0.7;
        letter-spacing: 1px;
    }

    .switches {
        display: flex;
        gap: 0.5rem;
        background: rgba(255, 176, 0, 0.1);
        padding: 0.5rem;
        border-radius: 4px;
        border: 1px solid rgba(255, 176, 0, 0.3);
    }

    .switch {
        width: 40px;
        height: 40px;
        background: #0a0500;
        border: 1px solid #ffb000;
        color: #ffb000;
        font-family: inherit;
        font-size: 1.2rem;
        cursor: pointer;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.1s;
    }

    .switch:hover:not(:disabled) {
        background: rgba(255, 176, 0, 0.2);
        box-shadow: 0 0 10px rgba(255, 176, 0, 0.3);
    }

    .switch.active {
        background: #ffb000;
        color: #000;
        box-shadow: 0 0 15px #ffb000;
        z-index: 2;
    }

    .switch.locked {
        opacity: 0.3;
        cursor: not-allowed;
        border-style: dashed;
    }

    .switch.solved {
        border-color: #fff;
    }

    .solved-indicator {
        position: absolute;
        top: 2px;
        right: 2px;
        width: 6px;
        height: 6px;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 0 5px #fff;
    }

    .lock-icon {
        font-size: 0.8rem;
        position: absolute;
        bottom: 2px;
    }
</style>
