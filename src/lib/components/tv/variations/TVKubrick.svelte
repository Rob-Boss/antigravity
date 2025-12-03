<script lang="ts">
    import BubbleScreen from "./BubbleScreen.svelte";
</script>

<div class="tv-brutalist">
    <div class="concrete-block">
        <div class="deep-recess">
            <BubbleScreen variant="matte" color="#333" />
        </div>
        <div class="vent-slots">
            <div class="slot"></div>
            <div class="slot"></div>
            <div class="slot"></div>
        </div>
    </div>
</div>

<style>
    .tv-brutalist {
        width: 300px;
        height: 340px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .concrete-block {
        width: 280px;
        height: 300px;
        background: #888;
        /* Concrete Noise Texture */
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.2'/%3E%3C/svg%3E");
        box-shadow:
            15px 15px 0 #444,
            /* Hard shadow */ 15px 15px 30px rgba(0, 0, 0, 0.5);
        padding: 30px;
        display: flex;
        flex-direction: column;
        gap: 30px;
    }

    .deep-recess {
        width: 100%;
        height: 180px;
        background: #222;
        box-shadow: inset 5px 5px 15px #000;
        padding: 10px;
    }

    .vent-slots {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .slot {
        width: 100%;
        height: 15px;
        background: #333;
        box-shadow: inset 2px 2px 5px #000;
    }
</style>
