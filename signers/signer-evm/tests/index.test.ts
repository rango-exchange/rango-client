import { describe, beforeEach, it, expect } from 'vitest';
import { DefaultEvmSigner } from '../src/index';
import { MockEvmProvider } from '../../../test-utils/mock.evm.provider';
import { EVM_TX, address, privateKey } from './mock.data';

describe('Test EVM Signer', () => {
  let provider: MockEvmProvider;
  let signer: DefaultEvmSigner;

  beforeEach(() => {
    provider = new MockEvmProvider({
      address,
      privateKey,
      networkVersion: 1337,
      debug: false,
    });
    signer = new DefaultEvmSigner(provider);
  });

  describe('personal_sign', () => {
    it('returns the correct signature for the message', async () => {
      const signed = await signer.signMessage('Hello World');

      expect(signed).toEqual(
        '0x446e62683c4304f8e9ac2f0b930af84fde6930f73aaac2b726e2e90984b4c55f2969ef122788984ae0c83674dc24f6bf351a467c9320818dc8741bc540e2ad321c'
      );
    });
  });

  describe('sign and send Tx', () => {
    it(`the sign fails when doesn't match chains`, async () => {
      try {
        await signer.signAndSendTx(EVM_TX, address, '1338');
      } catch (e) {
        expect(e.root).toMatch(
          `Signer chainId: '1337' doesn't match with required chainId: '1338' for tx.`
        );
      }
    });

    it(`the sign fails when doesn't match addresses`, async () => {
      try {
        await signer.signAndSendTx(EVM_TX, 'sample address', '1337');
      } catch (e) {
        expect(e.root).toMatch(
          `Signer address: '0x17ec8597ff92c3f44523bdc65bf0f1be632917ff' doesn't match with required address: 'sample address' for tx.`
        );
      }
    });

    it(`the sign fails when doesn't match addresses`, async () => {
      try {
        expect(
          await signer.signAndSendTx(EVM_TX, address, '1337')
        ).toBeDefined();
      } catch (e) {
        expect(e).toBeDefined();
      }
    });
  });
});
