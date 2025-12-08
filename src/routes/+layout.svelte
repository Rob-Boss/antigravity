<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import { onMount } from "svelte";
	import { audio } from "$lib/audio";

	let { children } = $props();

	function handleInteraction() {
		audio.resume();
	}
</script>

<svelte:window on:click={handleInteraction} on:keydown={handleInteraction} />

<svelte:head>
	<title>Swardy Landing Page</title>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
