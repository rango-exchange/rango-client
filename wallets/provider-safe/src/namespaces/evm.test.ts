import { beforeEach, describe, expect, test, vi } from 'vitest';

const SAFE_SIGNATURE = '0x5afe';
const ACCOUNT = '0x1111111111111111111111111111111111111111';

const safeSdk = vi.hoisted(() => ({
  txs: { signMessage: vi.fn() },
}));
const walletRequest = vi.hoisted(() => vi.fn());

vi.mock('../safe.js', () => ({ sdk: safeSdk }));
vi.mock('../utils.js', () => ({
  evmSafe: () => ({ request: walletRequest }),
  getSafeAccounts: vi.fn(),
}));

const { evm } = await import('./evm.js');

describe('Safe EVM namespace', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    safeSdk.txs.signMessage.mockResolvedValue({ signature: SAFE_SIGNATURE });
  });

  /*
   * viemWalletAdapter registers a `signMessage` too, which would sign through
   * the wallet's EIP-1193 `personal_sign`. Safe's own action is registered
   * after the adapter, so it has to win.
   */
  test("signs messages with Safe's own action, not the viem adapter's", async () => {
    const signature = await evm.signMessage({
      account: ACCOUNT,
      message: 'hello',
    });

    expect(signature).toBe(SAFE_SIGNATURE);
    expect(safeSdk.txs.signMessage).toHaveBeenCalledWith('hello');
    expect(walletRequest).not.toHaveBeenCalled();
  });

  test("keeps viem's wallet actions that Safe doesn't define", async () => {
    walletRequest.mockResolvedValue('0x10');

    await expect(evm.getBlockNumber()).resolves.toBe(BigInt('0x10'));
    expect(walletRequest).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'eth_blockNumber' })
    );
  });
});
