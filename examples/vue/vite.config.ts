import { nodePolyfills } from 'vite-plugin-node-polyfills';
import veauryVitePlugins from 'veaury/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    veauryVitePlugins({
      type: 'vue',
    }),
    nodePolyfills(),
  ],
  esbuild: {
    target: 'esnext',
  },
});
