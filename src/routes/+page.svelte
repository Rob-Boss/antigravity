<script lang="ts">
	import LetterS from "$lib/components/LetterS.svelte";
	import LetterW from "$lib/components/LetterW.svelte";
	import LetterA from "$lib/components/LetterA.svelte";
	import LetterR from "$lib/components/LetterR.svelte";
	import LetterD from "$lib/components/LetterD.svelte";
	import LetterY from "$lib/components/LetterY.svelte";
</script>

<main>
	<section class="letters-section">
		<div class="letters-container">
			<LetterS />
			<LetterW />
			<LetterA />
			<LetterR />
			<LetterD />
			<LetterY />
			<!-- Other letters will go here -->
		</div>
	</section>
</main>

<style>
	main {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: hidden; /* Prevent scrollbars during resize */
	}

	.letters-section {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding: 1rem;
	}

	.letters-container {
		display: flex;
		flex-wrap: nowrap; /* Force single line */
		gap: 0.5rem; /* Small gap */
		justify-content: center;
		align-items: center;
		width: 100%;
		max-width: 1200px;
	}

	/* Global overrides for letter components to ensure they scale */
	:global(.letter-container) {
		padding: 0 !important; /* Remove individual padding */
		flex: 1 1 auto;
		display: flex !important;
		justify-content: center;
		min-width: 0; /* Allow shrinking */
	}

	:global(.letter-container canvas),
	:global(.letter-container svg),
	:global(.letter-container > div) {
		width: 100% !important;
		height: auto !important;
		max-width: 200px;
		aspect-ratio: 2/3;
	}

	@media (max-width: 768px) {
		.letters-container {
			gap: 0.2rem;
		}
	}
</style>
