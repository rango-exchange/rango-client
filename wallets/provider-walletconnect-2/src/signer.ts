// import { DefaultEvmSigner } from '@rango-dev/signer-evm';
// import { Networks, getNetworkInstance } from '@rango-dev/wallets-shared';
// import {
//   DefaultSignerFactory,
//   SignerFactory,
//   TransactionType as TxType,
// } from 'rango-types';

// export default function getSigners(provider: any): SignerFactory {
//   const ethProvider = getNetworkInstance(provider, Networks.ETHEREUM);
//   const signers = new DefaultSignerFactory();
//   signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
//   return signers;
// }

import { DefaultCosmosSigner } from '@rango-dev/signer-cosmos';
import { Networks, getNetworkInstance } from '@rango-dev/wallets-shared';
import {
  DefaultSignerFactory,
  SignerFactory,
  TransactionType as TxType,
} from 'rango-types';

export default function getSigners(provider: any): SignerFactory {
  const cosmosProvider = getNetworkInstance(provider, Networks.COSMOS);
  const signers = new DefaultSignerFactory();
  signers.registerSigner(
    TxType.COSMOS,
    new DefaultCosmosSigner(cosmosProvider)
  );
  return signers;
}
