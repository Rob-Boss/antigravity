<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    export let resolution = 1.0; // 0.1 to 1.0
    export let blackPoint = 0.0; // 0.0 to 1.0
    export let whitePoint = 1.0; // 0.0 to 1.0
    export let speed = 1.0;
    export let isFrozen = false;

    let canvas: HTMLCanvasElement;
    let gl: WebGLRenderingContext | null;
    let program: WebGLProgram | null;
    let animationFrameId: number;
    let startTime: number;

    const vs = `
        attribute vec2 position;
        void main() {
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;

    const fs = `
        precision mediump float;
        uniform vec2 uResolution;
        uniform float uTime;
        uniform float uBlackPoint;
        uniform float uWhitePoint;

        float random(vec2 co) {
            return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
        }

        void main() {
            vec2 uv = gl_FragCoord.xy / uResolution.xy;
            // Use time as a seed for the random function to ensure frame-rate independence
            float n = random(uv + uTime);
            
            // Map the random 0-1 value to our black/white point range
            float color = mix(uBlackPoint, uWhitePoint, n);
            
            gl_FragColor = vec4(vec3(color), 1.0);
        }
    `;

    function createShader(
        gl: WebGLRenderingContext,
        type: number,
        source: string,
    ) {
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    function initWebGL() {
        gl = canvas.getContext("webgl");
        if (!gl) return;

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vs);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fs);
        if (!vertexShader || !fragmentShader) return;

        program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
            return;
        }

        gl.useProgram(program);

        // Debug: Set a clear color so we know WebGL is at least clearing
        gl.clearColor(0.1, 0.1, 0.1, 1.0);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = new Float32Array([
            -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        resize();
        startTime = performance.now();
        render(startTime);
    }

    function resize() {
        if (!canvas || !gl) return;
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;

        // Apply resolution scaling
        const width = Math.floor(displayWidth * resolution);
        const height = Math.floor(displayHeight * resolution);

        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
            gl.viewport(0, 0, width, height);
        }
    }

    function render(now: number) {
        if (!gl || !program) return;

        const time = isFrozen ? 0 : (now - startTime) * 0.001 * speed;

        const uResolution = gl.getUniformLocation(program, "uResolution");
        const uTime = gl.getUniformLocation(program, "uTime");
        const uBlackPoint = gl.getUniformLocation(program, "uBlackPoint");
        const uWhitePoint = gl.getUniformLocation(program, "uWhitePoint");

        gl.uniform2f(uResolution, canvas.width, canvas.height);
        gl.uniform1f(uTime, time);
        gl.uniform1f(uBlackPoint, blackPoint);
        gl.uniform1f(uWhitePoint, whitePoint);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        animationFrameId = requestAnimationFrame(render);
    }

    onMount(() => {
        initWebGL();
        window.addEventListener("resize", resize);
    });

    onDestroy(() => {
        if (typeof window !== "undefined") {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        }
    });

    // Reactive updates for resolution
    $: if (resolution && canvas && gl) {
        resize();
    }
</script>

<canvas bind:this={canvas} class="static-shader"></canvas>

<style>
    .static-shader {
        width: 100%;
        height: 100%;
        display: block;
        image-rendering: pixelated;
        pointer-events: none;
    }
</style>
