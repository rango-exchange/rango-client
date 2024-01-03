import { DefaultEvmSigner } from '@yeager-dev/signer-evm';
import { DefaultSolanaSigner } from '@yeager-dev/signer-solana';
import { Networks, getNetworkInstance } from '@yeager-dev/wallets-shared';
import {
  DefaultSignerFactory,
  SignerFactory,
  TransactionType as TxType,
} from 'rango-types';
import { CustomCosmosSigner } from './cosmos-signer';
import { CustomTransferSigner } from './utxo-signer';

export default function getSigners(provider: any): SignerFactory {
  const ethProvider = getNetworkInstance(provider, Networks.ETHEREUM);
  const solProvider = getNetworkInstance(provider, Networks.SOLANA);
  const binanceProvider = getNetworkInstance(provider, Networks.BINANCE);
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  signers.registerSigner(TxType.SOLANA, new DefaultSolanaSigner(solProvider));
  signers.registerSigner(
    TxType.COSMOS,
    new CustomCosmosSigner(binanceProvider)
  );
  // passed provider for transfer as it comprises several signers
  signers.registerSigner(TxType.TRANSFER, new CustomTransferSigner(provider));
  return signers;
}
