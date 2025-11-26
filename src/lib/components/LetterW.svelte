<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  let svgElement: SVGSVGElement;
  let isHovered = false;
  let animationFrameId: number;

  // Configuration Props
  export let segments: { start: Point; end: Point }[] = [
    // Standard W
    { start: { x: 40, y: 50 }, end: { x: 70, y: 250 } },
    { start: { x: 70, y: 250 }, end: { x: 100, y: 100 } },
    { start: { x: 100, y: 100 }, end: { x: 130, y: 250 } },
    { start: { x: 130, y: 250 }, end: { x: 160, y: 50 } },
    // Double Vision Offset
    { start: { x: 50, y: 60 }, end: { x: 80, y: 260 } },
    { start: { x: 80, y: 260 }, end: { x: 110, y: 110 } },
    { start: { x: 110, y: 110 }, end: { x: 140, y: 260 } },
    { start: { x: 140, y: 260 }, end: { x: 170, y: 60 } },
  ];
  export let tension = 0.1;
  export let damping = 0.9;
  export let strokeWidth = 2;
  export let color = "#ffd700";
  export let glowColor = "#ffffff";
  export let showGlow = true;

  interface Point {
    x: number;
    y: number;
  }

  class StringPhysics {
    start: Point;
    end: Point;
    control: Point; // The control point for the quadratic bezier
    velocity: Point;
    target: Point; // The resting position of the control point (midpoint)
    isPlucked: boolean;
    tension: number;
    damping: number;

    constructor(start: Point, end: Point, tension: number, damping: number) {
      this.start = start;
      this.end = end;
      this.tension = tension;
      this.damping = damping;
      // Midpoint is the resting position
      this.target = {
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2,
      };
      this.control = { ...this.target };
      this.velocity = { x: 0, y: 0 };
      this.isPlucked = false;
    }

    update() {
      // Spring force towards target
      const forceX = (this.target.x - this.control.x) * this.tension;
      const forceY = (this.target.y - this.control.y) * this.tension;

      this.velocity.x += forceX;
      this.velocity.y += forceY;

      this.velocity.x *= this.damping;
      this.velocity.y *= this.damping;

      this.control.x += this.velocity.x;
      this.control.y += this.velocity.y;
    }

    pluck(
      mouseX: number,
      mouseY: number,
      velocityX: number,
      velocityY: number,
    ) {
      // Simple distance check to see if we should pluck
      // We check distance to the line segment
      const dist = distToSegment(
        { x: mouseX, y: mouseY },
        this.start,
        this.end,
      );

      if (dist < 20) {
        // Add velocity based on mouse movement, clamped
        this.velocity.x += Math.max(Math.min(velocityX * 0.5, 20), -20);
        this.velocity.y += Math.max(Math.min(velocityY * 0.5, 20), -20);

        // Add a little random noise to make it feel organic
        this.velocity.x += (Math.random() - 0.5) * 5;
        this.velocity.y += (Math.random() - 0.5) * 5;
      }
    }

    getPath() {
      return `M ${this.start.x} ${this.start.y} Q ${this.control.x} ${this.control.y} ${this.end.x} ${this.end.y}`;
    }
  }

  // Helper: Distance from point p to line segment v-w
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

  onMount(() => {
    strings = segments.map(
      (s) => new StringPhysics(s.start, s.end, tension, damping),
    );

    loop();
  });

  onDestroy(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  });

  function loop() {
    strings.forEach((s) => s.update());
    strings = strings; // Trigger reactivity
    animationFrameId = requestAnimationFrame(loop);
  }

  let lastMouseX = 0;
  let lastMouseY = 0;

  function handleMouseMove(e: MouseEvent) {
    if (!svgElement) return;

    const rect = svgElement.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (200 / rect.width);
    const y = (e.clientY - rect.top) * (300 / rect.height);

    const vx = x - lastMouseX;
    const vy = y - lastMouseY;

    strings.forEach((s) => s.pluck(x, y, vx, vy));

    lastMouseX = x;
    lastMouseY = y;
    isHovered = true;
  }

  function handleTouchMove(e: TouchEvent) {
    if (!svgElement) return;
    e.preventDefault(); // Prevent scrolling while interacting

    const touch = e.touches[0];
    const rect = svgElement.getBoundingClientRect();
    const x = (touch.clientX - rect.left) * (200 / rect.width);
    const y = (touch.clientY - rect.top) * (300 / rect.height);

    // Calculate velocity roughly
    const vx = x - lastMouseX;
    const vy = y - lastMouseY;

    strings.forEach((s) => s.pluck(x, y, vx, vy));

    lastMouseX = x;
    lastMouseY = y;
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
    {#each strings as s}
      <path
        d={s.getPath()}
        fill="none"
        stroke={color}
        stroke-width={strokeWidth}
        stroke-linecap="round"
        class="string"
      />
      {#if showGlow}
        <!-- Glow string (duplicated for effect) -->
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
    {/each}
  </svg>
</div>

<style>
  .letter-container {
    display: inline-block;
    cursor: pointer;
    padding: 2rem;
    touch-action: none; /* Important for mobile touch handling */
  }

  .letter-w {
    width: 200px;
    height: 300px;
    overflow: visible;
  }

  .string {
    transition: stroke 0.3s ease;
  }

  .letter-w:hover .string {
    stroke: var(--text-primary);
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
