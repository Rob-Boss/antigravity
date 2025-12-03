<script lang="ts">
    import BentoGrid from "$lib/components/bento/BentoGrid.svelte";
    import BentoItem from "$lib/components/bento/BentoItem.svelte";

    // Sample data for the bento grid
    const items = [
        {
            id: "fridge",
            title: "Fridge Magnets",
            type: "large",
            color: "#FF6B6B",
        },
        {
            id: "sequencer",
            title: "Sequencer",
            type: "large",
            color: "#4ECDC4",
        },
        {
            id: "guestbook",
            title: "Guestbook",
            type: "medium",
            color: "#1A535C",
        },
        {
            id: "letters",
            title: "Interactive Letters",
            type: "xl",
            color: "#FFE66D",
        },
        { id: "lab", title: "Experiments", type: "medium", color: "#FF9F1C" },
        { id: "about", title: "About", type: "large", color: "#F7FFF7" },
        { id: "contact", title: "Contact", type: "large", color: "#292F36" },
    ];
</script>

<div class="lab-container">
    <div class="header">
        <h1>Bento Lab: Magnetic Focus</h1>
        <p>Move your cursor to see the magnetic proximity effect.</p>
    </div>

    <BentoGrid>
        {#each items as item (item.id)}
            <BentoItem {item}>
                <div class="content">
                    <h2>{item.title}</h2>
                    <div class="badge">{item.type}</div>
                </div>
            </BentoItem>
        {/each}
    </BentoGrid>
</div>

<style>
    .lab-container {
        min-height: 100vh;
        background-color: #111;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
        font-family: "Inter", sans-serif;
    }

    .header {
        margin-bottom: 3rem;
        text-align: center;
    }

    h1 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
        font-weight: 700;
    }

    p {
        opacity: 0.6;
    }

    .content {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 1.5rem;
    }

    h2 {
        font-size: 1.5rem;
        font-weight: 700;
        margin: 0;
    }

    .badge {
        align-self: flex-start;
        background: rgba(0, 0, 0, 0.2);
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
    }
</style>
