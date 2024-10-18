import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  base: '/cohere-integration/',  // Replace 'repository-name' with your actual repository name
//   server: {
//     port: 5173, // No HTTPS configuration needed
//   },
});
