/*
 * This configuration is for vite example.
 * When building these examples, we need to link our packages manually.
 * This setup excludes those linked packages from Vite's pre-bundling process.
 */
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { lstatSync, readdirSync } from 'fs';
const SCOPE = '@rango-dev';
const CUSTOM_PKGS = ['rango-sdk'];

const NODE_MODULES_PATH = `node_modules`;
export default defineConfig(() => {
  const excludedPackages = getSymlinkedPackages();

  return {
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    plugins: [
      nodePolyfills({
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
      }),
    ],
    server: {
      host: 'localhost',
      port: 3000,
    },
    optimizeDeps: {
      exclude: excludedPackages,
      force: excludedPackages.length > 0 ? true : false,
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
      },
    },
  };
});

function getSymlinkedPackages() {
  const symlinkedPackages: string[] = [];

  // Check custom packages
  CUSTOM_PKGS.forEach((pkgName) => {
    try {
      const pkg = lstatSync(`${NODE_MODULES_PATH}/${pkgName}`);
      if (pkg.isSymbolicLink()) {
        symlinkedPackages.push(`${SCOPE}/${pkgName}`);
      }
    } catch {
      // skip by ignoring errors.
    }
  });

  // Check scoped packages
  const scopedPackages = readdirSync(`${NODE_MODULES_PATH}/${SCOPE}`, {
    withFileTypes: true,
  });

  scopedPackages.forEach((pkg) => {
    if (pkg.isSymbolicLink()) {
      symlinkedPackages.push(`${SCOPE}/${pkg.name}`);
    }
  });

  if (symlinkedPackages.length > 0) {
    console.log(
      `${symlinkedPackages} linked package detected. we will exclude them.`
    );
  }

  return symlinkedPackages;
}
