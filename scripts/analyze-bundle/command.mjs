import * as esbuild from 'esbuild';
import fs from 'node:fs/promises';
import process from 'process';

async function run() {
  const result = await esbuild.build({
    bundle: true,
    minify: true,
    keepNames: true,
    sourcemap: true,
    platform: 'node',
    metafile: true,
    format: 'esm',
    outdir: 'out',
    entryPoints: ['src/containers/Widget/Widget.tsx'],
  });

  await fs.writeFile('out/meta.json', JSON.stringify(result.metafile));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
