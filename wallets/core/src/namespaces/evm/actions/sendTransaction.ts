import type { Context } from '../../../hub/namespaces/mod.js';
import type { FunctionWithContext } from '../../../types/actions.js';
import type { EvmActions, ProviderAPI } from '../types.js';

import { BrowserProvider, type TransactionRequest } from 'ethers';
import { SignerError, SignerErrorCode } from 'rango-types';

export function sendTransaction(
  instance: () => ProviderAPI | undefined
): FunctionWithContext<EvmActions['sendTransaction'], Context> {
  return async (
    _context,
    transaction: TransactionRequest,
    address,
    chainId
  ) => {
    const evmInstance = instance();
    if (!evmInstance) {
      throw new Error(
        'Do your wallet injected correctly and is evm compatible?'
      );
    }

    const provider = new BrowserProvider(evmInstance);
    const signer = await provider.getSigner();

    const signerChainId = (await provider.getNetwork()).chainId;
    const signerAddress = await signer.getAddress();

    if (
      !!chainId &&
      !!signerChainId &&
      signerChainId.toString() !== Number(chainId).toString()
    ) {
      throw new SignerError(
        SignerErrorCode.UNEXPECTED_BEHAVIOUR,
        undefined,
        `Signer chainId: '${signerChainId}' doesn't match with required chainId: '${chainId}' for tx.`
      );
    }
    if (
      !!signerAddress &&
      !!address &&
      signerAddress.toLowerCase() !== address.toLowerCase()
    ) {
      throw new SignerError(
        SignerErrorCode.UNEXPECTED_BEHAVIOUR,
        undefined,
        `Signer address: '${signerAddress.toLowerCase()}' doesn't match with required address: '${address.toLowerCase()}' for tx.`
      );
    }

    const response = await signer.sendTransaction(transaction);
    return response;
  };
}
