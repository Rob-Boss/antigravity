<script lang="ts">
	import LetterS from "$lib/components/LetterS.svelte";
	import LetterW from "$lib/components/LetterW.svelte";
	import LetterA from "$lib/components/LetterA.svelte";
	import LetterR from "$lib/components/LetterR.svelte";
	import LetterD from "$lib/components/LetterD.svelte";
	import LetterY from "$lib/components/LetterY.svelte";
	let innerWidth = 1000;
	$: scale = Math.min(1, (innerWidth - 40) / 1100);
</script>

<svelte:window bind:innerWidth />

<main>
	<section class="letters-section">
		<div class="letters-container" style="transform: scale({scale});">
			<!-- S -->
			<div
				class="letter-wrapper"
				style="transform: translate(-394px, 0px) scale(1); z-index: 1;"
			>
				<LetterS />
			</div>
			<!-- W -->
			<div
				class="letter-wrapper"
				style="transform: translate(-214px, 0px) scale(1); z-index: 1;"
			>
				<LetterW />
			</div>
			<!-- A -->
			<div
				class="letter-wrapper"
				style="transform: translate(-34px, 0px) scale(1); z-index: 1;"
			>
				<LetterA />
			</div>
			<!-- R -->
			<div
				class="letter-wrapper"
				style="transform: translate(126px, 11px) scale(1); z-index: 1;"
			>
				<LetterR
					path="M 50 250 L 80 50 L 180 50 L 150 150 L 80 150 M 150 150 L 200 250"
					numLayers={20}
					layerSpread={60}
					refractionSpeed={0.02}
					damping={0.05}
				/>
			</div>
			<!-- D -->
			<div
				class="letter-wrapper"
				style="transform: translate(267px, 0px) scale(0.9); z-index: 10;"
			>
				<LetterD
					path="M 120 240 C 80 240, 60 210, 60 180 C 60 150, 80 120, 120 120 C 140 120, 150 130, 150 130 L 150 40 C 150 20, 170 10, 180 30 L 170 240 C 170 250, 160 260, 140 250 Z"
					holePath="M 120 210 C 140 210, 140 180, 140 160 C 140 140, 130 130, 120 130 C 100 130, 90 150, 90 180 C 90 200, 100 210, 120 210 Z"
					eyePosition={{ x: 115, y: 170 }}
					eyeScale={0.7}
					squashFactor={0.2}
					blurStrength={0.7}
					blurColor="#87ceeb"
				/>
			</div>
			<!-- Y -->
			<div
				class="letter-wrapper"
				style="transform: translate(438px, 50px) scale(1.1); z-index: 1;"
			>
				<LetterY
					shapeMode="rounded"
					color="#ffd700"
					secondaryColor="#ffff00"
				/>
			</div>
		</div>
	</section>
</main>

<style>
	main {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		overflow: hidden;
		background: #111; /* Match arrangement tool background */
	}

	.letters-section {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		position: relative;
		padding-top: max(20vh, 180px);
	}

	.letters-container {
		position: relative;
		width: 0; /* Center point */
		height: 0;
		/* No flex, no gap - using absolute positioning */
	}

	.letter-wrapper {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		/* Transform originates from center */
		/* 
           Origin Correction: -100px (half width), -150px (half height) 
           Group Centering: -22px (to balance S:-394 and Y:438)
           Total Margin Left: -122px
        */
		margin-left: -122px;
		margin-top: -150px;
	}

	/* Global overrides for letter components */
	:global(.letter-container) {
		padding: 0 !important;
		display: flex !important;
		justify-content: center;
	}

	:global(.letter-container canvas),
	:global(.letter-container svg),
	:global(.letter-container > div) {
		width: 200px !important; /* Fixed base size */
		height: 300px !important;
	}

	/* Media query removed for smooth scaling */
</style>
