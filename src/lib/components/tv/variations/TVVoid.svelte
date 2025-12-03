<script lang="ts">
    import BubbleScreen from "./BubbleScreen.svelte";
</script>

<div class="tv-bio">
    <div class="blob-form">
        <div class="screen-membrane">
            <BubbleScreen variant="glass" color="#00ffaa" />
        </div>
    </div>
</div>

<style>
    .tv-bio {
        width: 320px;
        height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .blob-form {
        width: 300px;
        height: 260px;
        background: radial-gradient(circle at 30% 30%, #aaffdd, #00cc99);
        border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
        box-shadow:
            inset -10px -10px 20px rgba(0, 100, 50, 0.5),
            inset 10px 10px 20px rgba(255, 255, 255, 0.8),
            0 15px 30px rgba(0, 200, 150, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: breathe 4s infinite ease-in-out;
    }

    .screen-membrane {
        width: 180px;
        height: 160px;
        background: #000;
        border-radius: 50% 50% 40% 60% / 50% 60% 40% 50%;
        box-shadow: inset 0 0 20px rgba(0, 255, 150, 0.5);
        overflow: hidden;
    }

    @keyframes breathe {
        0%,
        100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
        }
        50% {
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
        }
    }
</style>
