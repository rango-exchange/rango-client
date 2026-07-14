import { getTrezorModule } from './legacy/helpers.js';
import { getTrezorManifest } from './provider.js';

let isTrezorInitialized = false;

/*
 * `TrezorConnect.init` throws if called twice, so initialization is shared across every
 * namespace (EVM, UTXO). `lazyLoad` defers iframe injection until the first method call.
 */
export async function initTrezor() {
  if (isTrezorInitialized) {
    return;
  }
  const TrezorConnect = await getTrezorModule();
  await TrezorConnect.init({
    lazyLoad: true,
    manifest: getTrezorManifest(),
  });
  isTrezorInitialized = true;
}
