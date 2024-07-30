import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import ViteNodePolyfills from 'vite-plugin-node-stdlib-browser';
import react from '@vitejs/plugin-react';
import chokidar from 'chokidar' ;
import fs from 'fs';
import path from 'path';

const root = fileURLToPath(new URL('.', import.meta.url))
const __dirname = fileURLToPath(new URL('../../', import.meta.url))

console.log('root', root);

const server = await createServer({
  // any valid user config options, plus `mode` and `configFile`
  configFile: false,
  root: root,
  server: {
    port: 1337,
    watch:chokidar.watch(__dirname)
    .on('add', watchPath => {
        fs.appendFileSync(path.join(root,'output_add.log'), watchPath+'\n');
      })
      .on('unlink', watchPath => {
        fs.appendFileSync(path.join(root,'output_unlink.log'), watchPath+'\n');
      })  
      .on('change', watchPath => {
        fs.appendFileSync(path.join(root,'output_change.log'), watchPath+'\n');
      })  
      .on('error', watchPath => {
        fs.appendFileSync(path.join(root,'output_error.log'), watchPath+'\n');
      })  
    },
  plugins: [
    react(),
    ViteNodePolyfills(),
    // pluginWatchNodeModules(['@rango-dev/widget-embedded']),
  ],
  resolve: {
    preserveSymlinks: true,
  },
})
await server.listen()

server.printUrls()
server.bindCLIShortcuts({ print: true })