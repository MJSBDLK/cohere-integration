import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter({
      fallback: 'index.html',  // Fallback for dynamic routes (SPA behavior)
      strict: false            // Allow dynamic routes
    }),
    paths: {
      base: '/cohere-integration',   // Keep base path empty for relative routing
    },
    prerender: {
      entries: ['*'],  // Prerender all pages
    }
  }
};


