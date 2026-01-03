<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { audio } from "$lib/audio";

  let svgElement: SVGSVGElement;
  let isHovered = false;
  let animationFrameId: number;

  // Configuration Props
  export let segments: { start: Point; end: Point }[] = [
    { start: { x: 40, y: 50 }, end: { x: 70, y: 250 } },
    { start: { x: 70, y: 250 }, end: { x: 100, y: 100 } },
    { start: { x: 100, y: 100 }, end: { x: 130, y: 250 } },
    { start: { x: 130, y: 250 }, end: { x: 160, y: 50 } },
    { start: { x: 50, y: 60 }, end: { x: 80, y: 260 } },
    { start: { x: 80, y: 260 }, end: { x: 110, y: 110 } },
    { start: { x: 110, y: 110 }, end: { x: 140, y: 260 } },
    { start: { x: 140, y: 260 }, end: { x: 170, y: 60 } },
    { start: { x: 60, y: 70 }, end: { x: 90, y: 270 } },
    { start: { x: 90, y: 270 }, end: { x: 120, y: 120 } },
    { start: { x: 120, y: 120 }, end: { x: 150, y: 270 } },
    { start: { x: 150, y: 270 }, end: { x: 180, y: 70 } },
  ];
  export let tension = 0.1;
  export let damping = 0.9;
  export let strokeWidth = 2;
  export let color = "#e3dac9";
  export let glowColor = "#ffffff";
  export let showGlow = true;
  export let audioVariant = 3;

  interface Point {
    x: number;
    y: number;
  }

  const confettiPalette = [
    "#00ffff",
    "#ff69b4",
    "#ffff00",
    "#32cd32",
    "#9370db",
    "#ff4500",
  ];

  class StringPhysics {
    start: Point;
    end: Point;
    control: Point;
    velocity: Point;
    target: Point;
    isPlucked: boolean;
    tension: number;
    damping: number;
    pluckT: number;
    waveDist: number;
    pulseActive: boolean;
    pulseColor: string;

    constructor(start: Point, end: Point, tension: number, damping: number) {
      this.start = start;
      this.end = end;
      this.tension = tension;
      this.damping = damping;
      this.target = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
      this.control = { ...this.target };
      this.velocity = { x: 0, y: 0 };
      this.isPlucked = false;
      this.pluckT = 0.5;
      this.waveDist = 0;
      this.pulseActive = false;
      this.pulseColor = "#00ffff";
    }

    update(dt: number) {
      const forceX = (this.target.x - this.control.x) * this.tension;
      const forceY = (this.target.y - this.control.y) * this.tension;
      this.velocity.x += forceX * dt;
      this.velocity.y += forceY * dt;
      this.velocity.x *= Math.pow(this.damping, dt);
      this.velocity.y *= Math.pow(this.damping, dt);
      this.control.x += this.velocity.x * dt;
      this.control.y += this.velocity.y * dt;
      if (this.pulseActive) {
        this.waveDist += 0.03 * dt;
        if (this.waveDist > 1.5) {
          this.pulseActive = false;
          this.waveDist = 0;
        }
      }
    }

    pluck(
      mouseX: number,
      mouseY: number,
      velocityX: number,
      velocityY: number,
    ) {
      const dist = distToSegment(
        { x: mouseX, y: mouseY },
        this.start,
        this.end,
      );
      if (dist < 20) {
        this.velocity.x += Math.max(Math.min(velocityX * 0.5, 20), -20);
        this.velocity.y += Math.max(Math.min(velocityY * 0.5, 20), -20);
        this.velocity.x += (Math.random() - 0.5) * 5;
        this.velocity.y += (Math.random() - 0.5) * 5;
        const dx = this.end.x - this.start.x,
          dy = this.end.y - this.start.y;
        const len2 = dx * dx + dy * dy;
        const mx = mouseX - this.start.x,
          my = mouseY - this.start.y;
        let t = (mx * dx + my * dy) / len2;
        t = Math.max(0, Math.min(1, t));
        this.pulseActive = true;
        this.pluckT = t;
        this.waveDist = 0;
        this.pulseColor =
          confettiPalette[Math.floor(Math.random() * confettiPalette.length)];
        audio.resume();
        const len = Math.sqrt(dx * dx + dy * dy);
        const baseFreq = 80000 / len;
        const pluckSpeed = Math.sqrt(
          velocityX * velocityX + velocityY * velocityY,
        );
        audio.playWVariant(audioVariant, baseFreq, pluckSpeed);
      }
    }

    getPath() {
      return `M ${this.start.x} ${this.start.y} Q ${this.control.x} ${this.control.y} ${this.end.x} ${this.end.y}`;
    }
  }

  function distToSegment(p: Point, v: Point, w: Point) {
    const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
    if (l2 == 0) return Math.hypot(p.x - v.x, p.y - v.y);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(
      p.x - (v.x + t * (w.x - v.x)),
      p.y - (v.y + t * (w.y - v.y)),
    );
  }

  let strings: StringPhysics[] = [];
  let lastTime = 0;
  let lastFrameMouseX = -1000;
  let lastFrameMouseY = -1000;
  let mouseVx = 0;
  let mouseVy = 0;
  let lastMouseX = 0;
  let lastMouseY = 0;

  function loop(currentTime: number) {
    if (lastTime === 0) lastTime = currentTime;
    const deltaTime = Math.min(currentTime - lastTime, 50);
    const dt = deltaTime / 16.667;
    lastTime = currentTime;

    if (lastFrameMouseX !== -1000) {
      mouseVx = lastMouseX - lastFrameMouseX;
      mouseVy = lastMouseY - lastFrameMouseY;
    }
    lastFrameMouseX = lastMouseX;
    lastFrameMouseY = lastMouseY;

    strings.forEach((s) => {
      s.pluck(lastMouseX, lastMouseY, mouseVx, mouseVy);
      s.update(dt);
    });

    strings = strings;
    animationFrameId = requestAnimationFrame(loop);
  }

  onMount(() => {
    strings = segments.map(
      (s) => new StringPhysics(s.start, s.end, tension, damping),
    );
    loop(performance.now());
  });

  onDestroy(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  });

  function handleMouseMove(e: MouseEvent) {
    if (!svgElement) return;
    const rect = svgElement.getBoundingClientRect();
    lastMouseX = (e.clientX - rect.left) * (200 / rect.width);
    lastMouseY = (e.clientY - rect.top) * (300 / rect.height);
    if (lastFrameMouseX === -1000) {
      lastFrameMouseX = lastMouseX;
      lastFrameMouseY = lastMouseY;
    }
    isHovered = true;
  }

  function handleTouchMove(e: TouchEvent) {
    if (!svgElement) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = svgElement.getBoundingClientRect();
    lastMouseX = (touch.clientX - rect.left) * (200 / rect.width);
    lastMouseY = (touch.clientY - rect.top) * (300 / rect.height);
    if (lastFrameMouseX === -1000) {
      lastFrameMouseX = lastMouseX;
      lastFrameMouseY = lastMouseY;
    }
  }

  function handleMouseLeave() {
    isHovered = false;
  }
</script>

<div
  class="letter-container"
  on:mousemove={handleMouseMove}
  on:touchmove={handleTouchMove}
  on:touchstart={(e) => {
    const t = e.touches[0];
    const r = e.currentTarget.getBoundingClientRect();
    lastMouseX = (t.clientX - r.left) * (200 / r.width);
    lastMouseY = (t.clientY - r.top) * (300 / r.height);
  }}
  on:mouseenter={(e) => {
    const r = e.currentTarget.getBoundingClientRect();
    lastMouseX = (e.clientX - r.left) * (200 / r.width);
    lastMouseY = (e.clientY - r.top) * (300 / r.height);
  }}
  on:mouseleave={handleMouseLeave}
  role="presentation"
>
  <svg
    bind:this={svgElement}
    viewBox="0 0 200 300"
    class="letter-w"
    class:hovered={isHovered}
  >
    {#each strings as s, i}
      <defs>
        <linearGradient
          id="grad-{i}"
          gradientUnits="userSpaceOnUse"
          x1={s.start.x}
          y1={s.start.y}
          x2={s.end.x}
          y2={s.end.y}
        >
          <stop offset="0%" stop-color={color} />
          <stop
            offset="{Math.max(0, (s.pluckT - s.waveDist) * 100 - 10)}%"
            stop-color={color}
          />
          <stop
            offset="{Math.max(0, (s.pluckT - s.waveDist) * 100)}%"
            stop-color={s.pulseColor}
          />
          <stop
            offset="{Math.max(0, (s.pluckT - s.waveDist) * 100 + 10)}%"
            stop-color={color}
          />
          <stop
            offset="{Math.min(100, (s.pluckT + s.waveDist) * 100 - 10)}%"
            stop-color={color}
          />
          <stop
            offset="{Math.min(100, (s.pluckT + s.waveDist) * 100)}%"
            stop-color={s.pulseColor}
          />
          <stop
            offset="{Math.min(100, (s.pluckT + s.waveDist) * 100 + 10)}%"
            stop-color={color}
          />
          <stop offset="100%" stop-color={color} />
        </linearGradient>
      </defs>
      <path
        d={s.getPath()}
        fill="none"
        stroke={s.pulseActive ? `url(#grad-${i})` : color}
        stroke-width={strokeWidth}
        stroke-linecap="round"
        class="string"
      />
      {#if showGlow}
        <path
          d={s.getPath()}
          fill="none"
          stroke={glowColor}
          stroke-width={strokeWidth * 0.3}
          stroke-linecap="round"
          class="string-core"
          opacity="0.6"
        />
      {/if}
      <circle cx={s.start.x} cy={s.start.y} r="2" fill="#888" />
      <circle cx={s.end.x} cy={s.end.y} r="2" fill="#888" />
    {/each}
  </svg>
</div>

<style>
  .letter-container {
    display: inline-block;
    cursor: pointer;
    padding: 2rem;
    touch-action: none;
  }
  .letter-w {
    width: 200px;
    height: 300px;
    overflow: visible;
  }
  .string {
    transition: stroke 0.3s ease;
  }
  .string-core {
    filter: drop-shadow(0 0 5px var(--accent-glow));
  }
  @media (max-width: 768px) {
    .letter-w {
      width: 150px;
      height: 225px;
    }
    .letter-container {
      padding: 1rem;
    }
  }
</style>
