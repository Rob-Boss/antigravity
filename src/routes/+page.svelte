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
			<LetterR
				path="M 50 250 L 80 50 L 180 50 L 150 150 L 80 150 M 150 150 L 200 250"
				numLayers={20}
				layerSpread={60}
				refractionSpeed={0.02}
				damping={0.05}
			/>
			<LetterD
				path="M 120 240 C 80 240, 60 210, 60 180 C 60 150, 80 120, 120 120 C 140 120, 150 130, 150 130 L 150 40 C 150 20, 170 10, 180 30 L 170 240 C 170 250, 160 260, 140 250"
				holePath="M 120 210 C 140 210, 140 180, 140 160 C 140 140, 130 130, 120 130 C 100 130, 90 150, 90 180 C 90 200, 100 210, 120 210 Z"
				eyePosition={{ x: 115, y: 170 }}
				eyeScale={0.7}
				squashFactor={0.2}
				color="#ff69b4"
				blurStrength={0.7}
				blurColor="#87ceeb"
			/>
			<LetterY
				shapeMode="thick"
				color="#ffd700"
				secondaryColor="#ffff00"
			/>
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
