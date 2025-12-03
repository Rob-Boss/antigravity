<script lang="ts">
    let cards = [
        { title: "Index A", color: "#ffcccc" },
        { title: "Index B", color: "#ccffcc" },
        { title: "Index C", color: "#ccccff" },
    ];
    let activeIndex = 0;

    function flip() {
        activeIndex = (activeIndex + 1) % cards.length;
    }
</script>

<div class="hud-card" on:click={flip}>
    <div class="rolodex">
        {#each cards as card, i}
            <div
                class="index-card"
                style="
					background: {card.color};
					z-index: {cards.length - i};
					transform: 
						translateY({i * 10}px) 
						scale({1 - i * 0.05})
						rotateX({i === activeIndex ? 0 : -10}deg);
					opacity: {i === activeIndex ? 1 : 0.5};
				"
            >
                <div class="card-header">{card.title}</div>
                <div class="card-body">
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                </div>
            </div>
        {/each}
    </div>

    <div class="knob-control">
        <div class="knob"></div>
    </div>
</div>

<style>
    .hud-card {
        width: 100%;
        height: 100%;
        background: #333;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        perspective: 1000px;
    }

    .rolodex {
        position: relative;
        width: 300px;
        height: 200px;
        transform-style: preserve-3d;
    }

    .index-card {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 1px solid #000;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        transform-origin: bottom center;
    }

    .card-header {
        font-family: "Courier New", monospace;
        font-weight: bold;
        font-size: 24px;
        border-bottom: 2px solid #000;
        padding-bottom: 10px;
        margin-bottom: 20px;
    }

    .line {
        height: 2px;
        background: #000;
        margin-bottom: 20px;
        opacity: 0.2;
    }

    .knob-control {
        margin-top: 50px;
        width: 100px;
        height: 100px;
        background: #222;
        border-radius: 50%;
        border: 4px solid #111;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
    }

    .knob {
        width: 80px;
        height: 80px;
        background: #444;
        border-radius: 50%;
        border: 2px solid #555;
        position: relative;
    }
    .knob::after {
        content: "";
        position: absolute;
        top: 10px;
        left: 50%;
        width: 10px;
        height: 10px;
        background: #000;
        border-radius: 50%;
        transform: translateX(-50%);
    }
</style>
