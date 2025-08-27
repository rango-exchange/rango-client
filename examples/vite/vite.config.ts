// vite.config.js
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default () => {
  return defineConfig({
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    plugins: [nodePolyfills()],
    server: {
      host: 'localhost',
      port: 3000,
    },
  });
};
