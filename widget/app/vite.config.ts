import react from '@vitejs/plugin-react';
import { defineConfig, ViteDevServer } from 'vite';
import ViteNodePolyfills from 'vite-plugin-node-stdlib-browser';
import { workspacePackages } from '../../scripts/common/utils.mjs';
import tsconfigPaths from 'vite-tsconfig-paths';
import { fileURLToPath } from 'node:url';

const watchRoot = fileURLToPath(new URL('../../', import.meta.url));

console.log('watchRoot', watchRoot);

// This plugin will watch node_modules for changes and trigger a reload.
// Works only for build --watch mode.
// https://github.com/vitejs/vite/issues/8619
function pluginWatchNodeModules(modules: string[]) {
  // Merge module into pipe separated string for RegExp() below.
  const pattern = `/node_modules\\/(?!${modules.join('|')}).*/`;
  return {
    name: 'watch-node-modules',
    configureServer: (server: ViteDevServer): void => {
      server.watcher.options = {
        ...server.watcher.options,
        ignored: [new RegExp(pattern), '**/.git/**'],
      };
    },
  };
}

async function getAllLocalPackage() {
  const packages = await workspacePackages();
  return packages
    .filter(
      (packageItem) =>
        ![
          '@rango-dev/widget-app',
          '@rango-dev/widget-embedded',
          '@rango-dev/widget-iframe',
          '@rango-dev/provider-mytonwallet',
        ].includes(packageItem.name)
    )
    .map((packageItem) => packageItem.name);
}

async function createViteConfig() {
  const localPackages = await getAllLocalPackage();
  // console.log(localPackages.length);
  // console.log('localPackages', localPackages);

  return defineConfig({
    logLevel: 'info',
    clearScreen: false,
    build: {
      outDir: './dist', // Output directory for the build (relative to the root)
      // commonjsOptions: {
      //   include: [
      //     'ethers',
      //     'rango-sdk',
      //     '@lingui/core',
      //     '@radix-ui/react-portal',
      //     'react-virtuoso',
      //     'zustand',
      //     'eventemitter3',
      //     '@solana/web3.js',
      //   ],
      // },
    },
    plugins: [
      react(),
      ViteNodePolyfills(),
      tsconfigPaths(),
      // pluginWatchNodeModules(['@rango-dev/widget-embedded']),
    ],
    optimizeDeps: {
      noDiscovery: true,
      include: [
        ...localPackages,
        'react-dom/*',
        'react-router-dom',
        'rango-sdk',
        'zustand',
        '@lingui/core',
        'dayjs',
      ],
    },
    server: {
      hmr: true,
      watch: {
        // cwd: watchRoot,
        // ignored: localPackages,
        followSymlinks: true,
      },
    },
    resolve: {
      preserveSymlinks: true,
      alias: {
        // '@rango-dev/widget-embedded': 'widget/embedded/src/index.ts',
      },
    },
  });
}

export default createViteConfig();
