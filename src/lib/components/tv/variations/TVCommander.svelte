<script lang="ts">
    import BubbleScreen from "./BubbleScreen.svelte";
</script>

<div class="tv-pop">
    <div class="pop-body">
        <div class="screen-flat">
            <BubbleScreen variant="flat" color="#ff0" />
        </div>
        <div class="zigzag"></div>
        <div class="shadow-block"></div>
    </div>
</div>

<style>
    .tv-pop {
        width: 320px;
        height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .pop-body {
        width: 280px;
        height: 240px;
        background: #00f; /* Electric Blue */
        border: 4px solid #000;
        box-shadow: 10px 10px 0 #000;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .screen-flat {
        width: 200px;
        height: 160px;
        background: #fff;
        border: 4px solid #000;
        z-index: 2;
    }

    .zigzag {
        position: absolute;
        top: -20px;
        right: -20px;
        width: 60px;
        height: 60px;
        background: #ff0; /* Yellow */
        border: 4px solid #000;
        border-radius: 50%;
        z-index: 3;
    }

    .shadow-block {
        position: absolute;
        bottom: 10px;
        left: 10px;
        width: 100%;
        height: 20px;
        background: repeating-linear-gradient(
            45deg,
            #000,
            #000 2px,
            transparent 2px,
            transparent 6px
        );
        opacity: 0.2;
        pointer-events: none;
    }
</style>
