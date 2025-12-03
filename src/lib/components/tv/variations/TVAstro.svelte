<script lang="ts">
    import BubbleScreen from "./BubbleScreen.svelte";
</script>

<div class="tv-glass">
    <div class="frosted-pane">
        <div class="screen-float">
            <BubbleScreen variant="glass" color="#aaccff" />
        </div>
        <div class="ui-dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
    </div>
</div>

<style>
    .tv-glass {
        width: 320px;
        height: 300px;
        background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")
            #f0f4f8;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .frosted-pane {
        width: 280px;
        height: 220px;
        background: rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(15px);
        -webkit-backdrop-filter: blur(15px);
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.5);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
        padding: 20px;
    }

    .screen-float {
        width: 200px;
        height: 140px;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }

    .ui-dots {
        display: flex;
        gap: 10px;
    }

    .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.8);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    }
</style>
