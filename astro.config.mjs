// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
	site: 'https://mattkibbler.github.io',
	base: '/dumbell-weight-calculator',
	integrations: [tailwind(), svelte()],
});
