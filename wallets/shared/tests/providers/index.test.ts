import { describe, beforeEach, it, expect } from 'vitest';
import {
  canEagerlyConnectToEvm,
  getEvmAccounts,
} from '@yeager-dev/wallets-shared';
import { MockEvmProvider } from '../../../../test-utils/mock.evm.provider';

describe('Test EVM Provider', function test() {
  const address = '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D';
  const privateKey =
    'de926db3012af759b4f24b5a51ef6afa397f04670f634aa4f48d4480417007f3';
  let instance;

  beforeEach(() => {
    instance = new MockEvmProvider({
      address,
      privateKey,
      networkVersion: 31,
      debug: false,
    });
  });

  it('get EVM accounts', async () => {
    const result = await getEvmAccounts(instance);
    expect(result).not.toBe(undefined);
    expect(result.accounts).toEqual([address]);
  });

  it('can eagerly connect to Evm', async () => {
    expect(
      await canEagerlyConnectToEvm({
        instance,
        meta: [],
      })
    ).toEqual(true);
  });
});
