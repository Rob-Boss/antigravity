import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		csp: {
			mode: 'auto',
			directives: {
				'script-src': ['self', 'unsafe-inline', 'unsafe-eval'],
				'style-src': ['self', 'unsafe-inline', 'https://fonts.googleapis.com'],
				'font-src': ['self', 'https://fonts.gstatic.com'],
				'img-src': ['self', 'data:', 'blob:', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com'],
				'connect-src': ['self', 'ws:', 'wss:', 'data:', 'blob:', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com']
			}
		}
	}
};

export default config;
