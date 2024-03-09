import type { EvmActions } from '../actions/evm/interface';
import type { SolanaActions } from '../actions/solana/interface';

import { beforeEach, describe, expect, test } from 'vitest';

import { BlockchainProvider } from './blockchain';
import { Provider } from './provider';

describe('providers', () => {
  let blockchainProviders: {
    evm: BlockchainProvider<EvmActions>;
    solana: BlockchainProvider<SolanaActions>;
  };

  beforeEach(() => {
    const evmBlockchain = new BlockchainProvider<EvmActions>();
    const solanaBlockchain = new BlockchainProvider<SolanaActions>();

    blockchainProviders = {
      evm: evmBlockchain,
      solana: solanaBlockchain,
    };

    return () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore-next-line
      blockchainProviders = undefined;
    };
  });

  test('Initialize providers correctly', () => {
    const wallet = new Provider('garbage');
    const { evm, solana } = blockchainProviders;
    wallet.add('evm', evm.build()).add('solana', solana.build());

    const allProviders = wallet.getAll();
    expect(allProviders.size).toBe(2);
  });

  test('updating states', () => {
    const wallet = new Provider('garbage');
    const { evm, solana } = blockchainProviders;
    wallet.add('evm', evm.build()).add('solana', solana.build());

    const [getState, setState] = wallet.state();
    setState('connected', true);
    const isConnected = getState('connected');
    expect(isConnected).toBe(true);
  });

  test('run actions', () => {
    const wallet = new Provider('garbage');
    const { evm, solana } = blockchainProviders;
    solana.action('connect', () => [
      '0x000000000000000000000000000000000000dead',
    ]);
    wallet.add('evm', evm.build()).add('solana', solana.build());

    expect(solana.run('connect')).toStrictEqual([
      '0x000000000000000000000000000000000000dead',
    ]);
    expect(() => evm.run('connect')).toThrowError();
  });
});
