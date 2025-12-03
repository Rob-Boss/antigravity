<script lang="ts">
    import { onMount } from "svelte";

    let stars: { x: number; y: number; z: number }[] = [];

    onMount(() => {
        // Init stars
        for (let i = 0; i < 100; i++) {
            stars.push({
                x: Math.random() * 800 - 400,
                y: Math.random() * 600 - 300,
                z: Math.random() * 1000,
            });
        }

        let frame: number;
        const loop = () => {
            stars = stars.map((s) => {
                let nz = s.z - 5;
                if (nz <= 0) nz = 1000;
                return { ...s, z: nz };
            });
            frame = requestAnimationFrame(loop);
        };
        loop();
        return () => cancelAnimationFrame(frame);
    });
</script>

<div class="hud-star">
    <div class="starfield">
        {#each stars as s}
            <div
                class="star"
                style="
					transform: translate3d({s.x / (s.z / 500)}px, {s.y / (s.z / 500)}px, 0);
					opacity: {1 - s.z / 1000};
					width: {Math.max(1, 4 - s.z / 250)}px;
					height: {Math.max(1, 4 - s.z / 250)}px;
				"
            ></div>
        {/each}
    </div>

    <div class="overlay-ui">
        <div class="logo">AFTER DARK</div>
    </div>
</div>

<style>
    .hud-star {
        width: 100%;
        height: 100%;
        background: #000;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .starfield {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
    }

    .star {
        position: absolute;
        background: #fff;
        border-radius: 50%;
    }

    .overlay-ui {
        position: absolute;
        bottom: 20px;
        right: 20px;
        color: #fff;
        font-family: "Times New Roman", serif;
        font-style: italic;
        font-size: 24px;
        opacity: 0.5;
    }
</style>
