<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { audio } from "$lib/audio";

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let animationFrameId: number;
	let mouseX = -1000;
	let mouseY = -1000;
	let lastMouseX = -1000;
	let lastMouseY = -1000;
	let mouseVx = 0;
	let mouseVy = 0;

	// Configuration Props
	export let palette: string[] = []; // If empty, will use computed styles
	export let hairLength = 25;
	export let hairSpacing = 2;
	export let hairThickness = 0.6;
	export let hairVariance = 5;
	export let audioVariant = 3; // Water

	// Internal
	const LOGICAL_WIDTH = 200;
	const LOGICAL_HEIGHT = 300;

	interface Hair {
		x: number; // Root X (Logical)
		y: number; // Root Y (Logical)
		tipX: number;
		tipY: number;
		vx: number;
		vy: number;
		length: number;
		thickness: number;
		baseH: number;
		baseS: number;
		baseL: number;
		// New fields for alignment coloring
		neighbors: number[];
		randomHue: number;
		nx: number;
		ny: number;
	}

	function hexToRgb(hex: string) {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16),
				}
			: null;
	}

	function rgbToHsl(r: number, g: number, b: number) {
		(r /= 255), (g /= 255), (b /= 255);
		const max = Math.max(r, g, b),
			min = Math.min(r, g, b);
		let h = 0,
			s,
			l = (max + min) / 2;

		if (max == min) {
			h = s = 0; // achromatic
		} else {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}
			h /= 6;
		}

		return { h: h * 360, s: s * 100, l: l * 100 };
	}

	function parseColor(color: string) {
		// Handle hex
		if (color.startsWith("#")) {
			const rgb = hexToRgb(color);
			if (rgb) return rgbToHsl(rgb.r, rgb.g, rgb.b);
		}
		// Handle rgb/rgba
		if (color.startsWith("rgb")) {
			const parts = color.match(/\d+/g);
			if (parts && parts.length >= 3) {
				return rgbToHsl(
					parseInt(parts[0]),
					parseInt(parts[1]),
					parseInt(parts[2]),
				);
			}
		}
		// Fallback (return a default gray)
		return { h: 0, s: 0, l: 50 };
	}

	let hairs: Hair[] = [];

	// The S path definition
	export let pathString =
		"M 150 50 Q 50 50 50 100 Q 50 150 150 150 Q 250 150 250 200 Q 250 250 150 250";

	function initHairs() {
		hairs = [];

		const offscreen = document.createElement("canvas");
		offscreen.width = LOGICAL_WIDTH;
		offscreen.height = LOGICAL_HEIGHT;
		const offCtx = offscreen.getContext("2d");
		if (!offCtx) return;

		offCtx.lineWidth = 40;
		offCtx.lineCap = "round";
		offCtx.lineJoin = "round";
		offCtx.strokeStyle = "#000";

		// Scale and Center the path to fit nicely in 200x300
		const scale = 0.7;
		offCtx.translate(LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2);
		offCtx.rotate((10 * Math.PI) / 180); // 10 degrees clockwise
		offCtx.translate(-150 * scale, -150 * scale);
		offCtx.scale(scale, scale);

		const p = new Path2D(pathString);
		offCtx.stroke(p);

		const imageData = offCtx.getImageData(
			0,
			0,
			LOGICAL_WIDTH,
			LOGICAL_HEIGHT,
		).data;

		let colors = palette;
		if (colors.length === 0) {
			const style = getComputedStyle(canvas);
			colors = [
				style.getPropertyValue("--dry-sage").trim() || "#8ba59e",
				style.getPropertyValue("--frosted-mint").trim() || "#f0ffce",
				style.getPropertyValue("--text-primary").trim() || "#ffffff",
			];
		}

		for (let y = 0; y < LOGICAL_HEIGHT; y += hairSpacing) {
			for (let x = 0; x < LOGICAL_WIDTH; x += hairSpacing) {
				const index = (y * LOGICAL_WIDTH + x) * 4;
				const rx = x + (Math.random() - 0.5) * hairSpacing;
				const ry = y + (Math.random() - 0.5) * hairSpacing;

				if (imageData[index + 3] > 0) {
					const length = hairLength * (0.7 + Math.random() * 0.6);
					const thickness =
						hairThickness * (0.5 + Math.random() * 1.0);
					const angle = Math.random() * Math.PI * 2;

					const colorStr =
						colors[Math.floor(Math.random() * colors.length)];
					const hsl = parseColor(colorStr);

					hairs.push({
						x: rx,
						y: ry,
						tipX: rx + Math.cos(angle) * length * 0.5,
						tipY: ry + Math.sin(angle) * length * 0.5,
						vx: 0,
						vy: 0,
						length,
						thickness,
						baseH: hsl.h,
						baseS: hsl.s,
						baseL: hsl.l,
						neighbors: [],
						randomHue: Math.random() * 360,
						nx: 0,
						ny: 0,
					});
				}
			}
		}

		// Build Spatial Grid for Neighbor Search
		const cellSize = 15;
		const grid: Record<string, number[]> = {};

		hairs.forEach((h, i) => {
			const cx = Math.floor(h.x / cellSize);
			const cy = Math.floor(h.y / cellSize);
			const key = `${cx},${cy}`;
			if (!grid[key]) grid[key] = [];
			grid[key].push(i);
		});

		// Find Neighbors
		hairs.forEach((h, i) => {
			const cx = Math.floor(h.x / cellSize);
			const cy = Math.floor(h.y / cellSize);
			const neighbors: number[] = [];

			for (let dx = -1; dx <= 1; dx++) {
				for (let dy = -1; dy <= 1; dy++) {
					const key = `${cx + dx},${cy + dy}`;
					const cellHairs = grid[key];
					if (cellHairs) {
						cellHairs.forEach((ni) => {
							if (ni !== i) {
								const nh = hairs[ni];
								const dist = Math.sqrt(
									(h.x - nh.x) ** 2 + (h.y - nh.y) ** 2,
								);
								if (dist <= cellSize) {
									neighbors.push(ni);
								}
							}
						});
					}
				}
			}
			h.neighbors = neighbors;
		});
	}

	let currentScale = 1;

	let lastFrameMouseX = -1000;
	let lastFrameMouseY = -1000;
	let lastTime = 0;

	function update(currentTime: number) {
		if (!ctx || !canvas) return;

		// Initialize lastTime if it's the first frame
		if (lastTime === 0) lastTime = currentTime;

		// Calculate delta time factor (1.0 at 60fps)
		const deltaTime = Math.min(currentTime - lastTime, 50);
		const dt = deltaTime / 16.667;
		lastTime = currentTime;

		// Calculate mouse velocity as displacement since last frame
		if (lastFrameMouseX !== -1000) {
			mouseVx = mouseX - lastFrameMouseX;
			mouseVy = mouseY - lastFrameMouseY;
		}
		lastFrameMouseX = mouseX;
		lastFrameMouseY = mouseY;

		// Clear using logical dimensions...
		ctx.clearRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

		// Physics constants
		const FRICTION = Math.pow(0.8, dt);
		const REPULSION_RADIUS = 40;
		const FORCE_MULTIPLIER = 1.6 * dt;

		// Calculate line width to be at least 1px on screen
		const minLineWidth = 1.5 / currentScale;
		const lineWidth = Math.max(1, minLineWidth);

		// Pass 1: Physics & Direction Calculation
		hairs.forEach((hair) => {
			// Mouse interaction
			const mdx = mouseX - hair.x;
			const mdy = mouseY - hair.y;
			const dist = Math.sqrt(mdx * mdx + mdy * mdy);

			if (dist < REPULSION_RADIUS) {
				const force = (1 - dist / REPULSION_RADIUS) * FORCE_MULTIPLIER;

				hair.vx += mouseVx * force;
				hair.vy += mouseVy * force;

				hair.vx -= (mdx / dist) * force * 2;
			}

			hair.vx *= FRICTION;
			hair.vy *= FRICTION;

			hair.tipX += hair.vx * dt; // Apply velocity scaled by time
			hair.tipY += hair.vy * dt;

			const tipDx = hair.tipX - hair.x;
			const tipDy = hair.tipY - hair.y;
			const tipDist = Math.sqrt(tipDx * tipDx + tipDy * tipDy);

			if (tipDist > hair.length) {
				const scale = hair.length / tipDist;
				hair.tipX = hair.x + tipDx * scale;
				hair.tipY = hair.y + tipDy * scale;
				hair.vx *= 0.1;
				hair.vy *= 0.1;
			}

			// Calculate normalized direction for alignment
			const finalDx = hair.tipX - hair.x;
			const finalDy = hair.tipY - hair.y;
			const len = Math.sqrt(finalDx * finalDx + finalDy * finalDy);
			if (len > 0) {
				hair.nx = finalDx / len;
				hair.ny = finalDy / len;
			}
		});

		// Pass 2: Alignment Calculation & Drawing
		hairs.forEach((hair) => {
			// Calculate Alignment
			let sumNx = hair.nx;
			let sumNy = hair.ny;

			hair.neighbors.forEach((ni) => {
				const nh = hairs[ni];
				sumNx += nh.nx;
				sumNy += nh.ny;
			});

			const count = hair.neighbors.length + 1;
			const avgNx = sumNx / count;
			const avgNy = sumNy / count;

			const alignment = Math.sqrt(avgNx * avgNx + avgNy * avgNy);
			const saturation = Math.pow(alignment, 15) * 100;

			const dy = hair.ny;
			const lighting = -dy * 15;
			const lightness = Math.max(0, Math.min(100, 50 + lighting));

			ctx!.beginPath();
			ctx!.moveTo(hair.x, hair.y);
			const cx = (hair.x + hair.tipX) / 2;
			const cy = (hair.y + hair.tipY) / 2;
			ctx!.quadraticCurveTo(cx, cy, hair.tipX, hair.tipY);

			ctx!.strokeStyle = `hsl(${hair.randomHue}, ${saturation}%, ${lightness}%)`;
			ctx!.lineWidth = lineWidth * hair.thickness;
			ctx!.globalAlpha = 0.8;
			ctx!.stroke();
			ctx!.globalAlpha = 1.0;
		});

		mouseVx *= 0.5;
		mouseVy *= 0.5;

		animationFrameId = requestAnimationFrame(update);
	}

	function handleMouseMove(e: MouseEvent) {
		const rect = canvas.getBoundingClientRect();
		// Map mouse to logical coordinates
		const x = (e.clientX - rect.left) * (LOGICAL_WIDTH / rect.width);
		const y = (e.clientY - rect.top) * (LOGICAL_HEIGHT / rect.height);

		mouseVx = x - mouseX;
		mouseVy = y - mouseY;
		mouseX = x;
		mouseY = y;

		const speed = Math.sqrt(mouseVx * mouseVx + mouseVy * mouseVy);
		if (speed > 5) {
			audio.resume();
			audio.playSVariant(audioVariant, speed);
		}
	}

	function handleTouchMove(e: TouchEvent) {
		e.preventDefault();
		const rect = canvas.getBoundingClientRect();
		const touch = e.touches[0];
		const x = (touch.clientX - rect.left) * (LOGICAL_WIDTH / rect.width);
		const y = (touch.clientY - rect.top) * (LOGICAL_HEIGHT / rect.height);

		mouseVx = x - mouseX;
		mouseVy = y - mouseY;
		mouseX = x;
		mouseY = y;
	}

	onMount(() => {
		ctx = canvas.getContext("2d");

		// Initialize hairs ONCE using logical size
		initHairs();

		const resizeObserver = new ResizeObserver(() => {
			const dpr = window.devicePixelRatio || 1;
			const rect = canvas.getBoundingClientRect();

			if (rect.width > 0 && rect.height > 0) {
				canvas.width = rect.width * dpr;
				canvas.height = rect.height * dpr;

				// Set the scale so that drawing operations in LOGICAL coordinates
				// map to the full physical canvas size
				const scaleX = (rect.width * dpr) / LOGICAL_WIDTH;
				const scaleY = (rect.height * dpr) / LOGICAL_HEIGHT;

				currentScale = scaleX; // Store for update loop

				ctx?.setTransform(1, 0, 0, 1, 0, 0);
				ctx?.scale(scaleX, scaleY);
			}
		});

		resizeObserver.observe(canvas);
		update(performance.now());

		return () => {
			resizeObserver.disconnect();
		};
	});

	onDestroy(() => {
		if (animationFrameId) cancelAnimationFrame(animationFrameId);
	});
</script>

<div
	class="letter-container"
	on:mousemove={handleMouseMove}
	on:touchmove={handleTouchMove}
	on:touchstart={handleTouchMove}
	role="presentation"
>
	<canvas bind:this={canvas} class="letter-s-canvas"></canvas>
</div>

<style>
	.letter-container {
		display: inline-block;
		padding: 2rem;
		cursor: crosshair;
		touch-action: none;
	}

	.letter-s-canvas {
		width: 200px;
		height: 300px;
	}

	@media (max-width: 768px) {
		.letter-s-canvas {
			width: 150px;
			height: 225px;
		}

		.letter-container {
			padding: 1rem;
		}
	}
</style>
