import type { WalletEnvironment } from './wallet';
import type { ActionContext, SdkMeta } from '../../context';
import type { StepBlock, SwapExecution } from '../../types';
import type { NamespacesProperty, Provider } from '@hub3js/core';
import type { DefaultNamespaces } from '@hub3js/namespaces';
import type { BlockchainMeta, EvmBlockchainMeta } from 'rango-types';

import { CAIP_NAMESPACE as EVM_CAIP_NAMESPACE } from '@hub3js/evm';
import { isEvmBlockchain } from 'rango-types';

import { ActionBlockedError, ActionError } from '../../../errors';
import { findBlockchain, isSameChainId, toEvmChain } from '../meta';

import { ensureWalletConnected } from './wallet';

export type EvmEnvironment = WalletEnvironment<'evm'> & {
  blockchain: EvmBlockchainMeta;
  chainId: string;
};

type EvmNamespace = EvmEnvironment['namespace'];

/**
 * The EVM guard: on top of the wallet being connected with the right account,
 * it has to be on the chain the transaction is for. A wallet on another chain
 * is asked to switch when it says it can; the step parks with `wrong_network`
 * when it cannot (`switch: null`, the user switches by hand) or when the
 * switch was refused or did not take (`switch: 'failed'`).
 *
 * `blockChain` names the wallet in the swap's wallets, and by default the
 * chain to be on. `options.network` names another chain to be on instead,
 * for actions signed on an EVM chain other than the one they are stored
 * under, such as Hyperliquid's.
 */
export async function ensureEvmEnvironment(
  exec: SwapExecution,
  context: ActionContext,
  blockChain: string,
  options: { network?: string } = {}
): Promise<EvmEnvironment> {
  const network = options.network ?? blockChain;
  const environment = ensureWalletConnected(exec, context, {
    blockChain,
    namespaceKey: 'evm',
  });
  const { wallet, provider, namespace: evm } = environment;
  const blockchain = findBlockchain(context.getMeta(), network);

  if (!blockchain || !isEvmBlockchain(blockchain)) {
    throw new ActionError(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      `${network} is not an EVM chain in the host's meta`
    );
  }

  const wrongNetwork = (
    switchStatus: Extract<StepBlock, { reason: 'wrong_network' }>['switch'],
    cause?: unknown
  ) =>
    new ActionBlockedError(
      {
        reason: 'wrong_network',
        walletType: wallet.walletType,
        namespace: 'EVM',
        network,
        switch: switchStatus,
      },
      cause
    );

  if (!isSameChainId(await evm.getChainId(), blockchain.chainId)) {
    if (!canSwitchNetwork(provider, evm, blockchain, context.getMeta())) {
      throw wrongNetwork(null);
    }

    try {
      await evm.connect(toEvmChain(blockchain), {
        derivationPath: wallet.derivationPath,
      });
    } catch (error) {
      throw wrongNetwork('failed', error);
    }
    // The wallet may resolve the switch without having moved; only its chain id says it did.
    if (!isSameChainId(await evm.getChainId(), blockchain.chainId)) {
      throw wrongNetwork('failed');
    }
  }

  return { ...environment, blockchain, chainId: blockchain.chainId };
}

/**
 * Whether the wallet can be asked to switch to the chain. A namespace answers
 * for the chains the provider registered support for; one that does not
 * implement the action cannot switch at all.
 */
function canSwitchNetwork(
  provider: Provider<DefaultNamespaces>,
  evm: EvmNamespace,
  blockchain: EvmBlockchainMeta,
  meta: SdkMeta
): boolean {
  // `in` goes through the namespace proxy, so it is true only when the action is registered.
  if (!('canSwitchNetwork' in evm)) {
    return false;
  }
  return evm.canSwitchNetwork({
    network: blockchain.name,
    supportedChains: getSupportedEvmChains(provider, meta),
  });
}

/**
 * The EVM chains of meta the provider says it supports. A provider without
 * that metadata is taken to support all of them; the switch itself tells.
 */
function getSupportedEvmChains(
  provider: Provider<DefaultNamespaces>,
  meta: SdkMeta
): BlockchainMeta[] {
  const evmChains = meta.blockchains.filter(isEvmBlockchain);
  const evmNamespace = getNamespacesProperty(provider)?.value.data.find(
    (namespace) => namespace.value === 'evm'
  );
  if (!evmNamespace) {
    return evmChains;
  }
  return evmChains.filter((chain) =>
    evmNamespace.isChainSupported(toCaipChainId(chain))
  );
}

function getNamespacesProperty(
  provider: Provider<DefaultNamespaces>
): NamespacesProperty<DefaultNamespaces> | undefined {
  for (const property of provider.info()?.metadata.properties ?? []) {
    if (property.name === 'namespaces') {
      return property;
    }
  }
  return undefined;
}

/** The CAIP-2 id providers key chain support by; its reference is the chain id in decimal. */
function toCaipChainId(chain: EvmBlockchainMeta): string {
  return `${EVM_CAIP_NAMESPACE}:${BigInt(chain.chainId)}`;
}
