import { CAIP_NAMESPACE as CAIP_EVM_NAMESPACE } from '@hub3js/evm';
import { CAIP_NAMESPACE as CAIP_SOLANA_NAMESPACE } from '@hub3js/solana';
import { CAIP_NAMESPACE as CAIP_STARKNET_NAMESPACE } from '@hub3js/starknet';
import {
  CAIP_CHAINS,
  convertBlockchainMetaToCaip,
  isBitcoinBlockchain,
  isZcashBlockchain,
} from '@rango-dev/internal-blockchains';
import { CAIP_NAMESPACE as CAIP_TRON_NAMESPACE } from '@rango-dev/wallets-core/namespaces/tron';
import { TransactionType } from 'rango-types';
import { describe, expect, it } from 'vitest';

/**
 * Only the three fields `convertBlockchainMetaToCaip` reads. The `chainId` values are
 * the shapes the meta response actually returns, which is the whole point of these
 * cases — several families report a `chainId` that is NOT their CAIP reference.
 */
function meta(type: TransactionType, chainId: string | null, name = '') {
  return { type, chainId, name };
}

describe('convertBlockchainMetaToCaip', () => {
  describe('EVM', () => {
    it('converts the hex chainId meta reports into a decimal CAIP reference', () => {
      // 0xa86a is Avalanche C-Chain, 43114.
      expect(
        convertBlockchainMetaToCaip(meta(TransactionType.EVM, '0xa86a'))
      ).toBe('eip155:43114');
      expect(
        convertBlockchainMetaToCaip(meta(TransactionType.EVM, '0x1'))
      ).toBe(CAIP_CHAINS.ETHEREUM);
    });

    it('accepts a bare decimal chainId', () => {
      expect(
        convertBlockchainMetaToCaip(meta(TransactionType.EVM, '137'))
      ).toBe('eip155:137');
    });

    it('returns null rather than a truncated id for a malformed chainId', () => {
      // `parseInt` alone would turn '12abc' into chain 12, silently pointing elsewhere.
      expect(
        convertBlockchainMetaToCaip(meta(TransactionType.EVM, '12abc'))
      ).toBeNull();
      expect(
        convertBlockchainMetaToCaip(meta(TransactionType.EVM, '0x'))
      ).toBeNull();
      expect(
        convertBlockchainMetaToCaip(meta(TransactionType.EVM, ''))
      ).toBeNull();
      expect(
        convertBlockchainMetaToCaip(meta(TransactionType.EVM, null))
      ).toBeNull();
    });
  });

  describe('single-chain families', () => {
    /*
     * Each of these reports a `chainId` that is not its CAIP reference, so the
     * conversion has to ignore it. Regression guard: deriving the reference from
     * `chainId` here silently returned null for every one of them.
     */
    it.each([
      [TransactionType.SOLANA, 'mainnet-beta', CAIP_CHAINS.SOLANA],
      [TransactionType.SUI, 'sui-mainnet', CAIP_CHAINS.SUI],
      [TransactionType.TRON, 'tron', CAIP_CHAINS.TRON],
      [TransactionType.STARKNET, 'SN_MAIN', CAIP_CHAINS.STARKNET],
      [TransactionType.TON, 'ton', CAIP_CHAINS.TON],
      [TransactionType.STELLAR, 'stellar', CAIP_CHAINS.STELLAR],
      [TransactionType.XRPL, 'xrpl', CAIP_CHAINS.XRPL],
    ])(
      'maps %s to its fixed CAIP id regardless of meta chainId',
      (type, chainId, expected) => {
        expect(convertBlockchainMetaToCaip(meta(type, chainId))).toBe(expected);
        // Also holds when meta omits the chainId entirely.
        expect(convertBlockchainMetaToCaip(meta(type, null))).toBe(expected);
      }
    );

    it('keeps each family in its own namespace', () => {
      const namespaceOf = (type: TransactionType) =>
        convertBlockchainMetaToCaip(meta(type, null))?.split(':')[0];

      expect(namespaceOf(TransactionType.TRON)).toBe(CAIP_TRON_NAMESPACE);
      expect(namespaceOf(TransactionType.STARKNET)).toBe(
        CAIP_STARKNET_NAMESPACE
      );
      expect(namespaceOf(TransactionType.SOLANA)).toBe(CAIP_SOLANA_NAMESPACE);
    });
  });

  describe('TRANSFER', () => {
    it('resolves by blockchain name, since meta chainId is always null', () => {
      expect(
        convertBlockchainMetaToCaip(meta(TransactionType.TRANSFER, null, 'BTC'))
      ).toBe(CAIP_CHAINS.BITCOIN);
      expect(
        convertBlockchainMetaToCaip(
          meta(TransactionType.TRANSFER, null, 'ZCASH')
        )
      ).toBe(CAIP_CHAINS.ZCASH);
    });

    it('returns null for a transfer chain with no CAIP mapping', () => {
      // DASH is enabled in meta but has no bip122 reference here yet.
      expect(
        convertBlockchainMetaToCaip(
          meta(TransactionType.TRANSFER, null, 'DASH')
        )
      ).toBeNull();
    });
  });

  describe('HYPERLIQUID', () => {
    /*
     * It lands in `eip155` on purpose: wallets that claim the whole EVM family have to
     * keep matching Hyperliquid, the way they did when they listed it by name.
     */
    it('lands in the eip155 namespace so EVM-family wallets still match it', () => {
      const caip = convertBlockchainMetaToCaip(
        meta(TransactionType.HYPERLIQUID, '1337')
      );

      expect(caip).toBe('eip155:1337');
      expect(caip?.startsWith(`${CAIP_EVM_NAMESPACE}:`)).toBe(true);
    });

    it('returns null without a chainId, rather than a bare namespace', () => {
      expect(
        convertBlockchainMetaToCaip(meta(TransactionType.HYPERLIQUID, null))
      ).toBeNull();
    });
  });

  /*
   * Cosmos is deliberately not addressable: we don't connect to it through the hub, so
   * no namespace claims it. `null` is the decision, not a gap — even though a Cosmos
   * meta `chainId` ('osmosis-1') would already be a valid CAIP reference.
   */
  it('leaves COSMOS unaddressable, with or without a chainId', () => {
    expect(
      convertBlockchainMetaToCaip(meta(TransactionType.COSMOS, 'osmosis-1'))
    ).toBeNull();
    expect(
      convertBlockchainMetaToCaip(meta(TransactionType.COSMOS, null))
    ).toBeNull();
  });

  it('returns null for a transaction type it does not know', () => {
    expect(
      convertBlockchainMetaToCaip(meta('SOMETHING_NEW' as TransactionType, '1'))
    ).toBeNull();
  });
});

describe('blockchain-name predicates', () => {
  it('identifies Bitcoin and Zcash by their Rango names', () => {
    expect(isBitcoinBlockchain('BTC')).toBe(true);
    expect(isZcashBlockchain('ZCASH')).toBe(true);
  });

  it('rejects the other UTXO chains, which share the bip122 namespace', () => {
    expect(isBitcoinBlockchain('LTC')).toBe(false);
    expect(isBitcoinBlockchain('DOGE')).toBe(false);
    expect(isBitcoinBlockchain('BCH')).toBe(false);
    expect(isBitcoinBlockchain('ZCASH')).toBe(false);
    expect(isZcashBlockchain('BTC')).toBe(false);
  });

  it('rejects non-transfer names and CAIP ids passed in by mistake', () => {
    expect(isBitcoinBlockchain('ETH')).toBe(false);
    expect(isBitcoinBlockchain('')).toBe(false);
    expect(isBitcoinBlockchain(CAIP_CHAINS.BITCOIN)).toBe(false);
  });
});
