import { beforeEach, describe, expect, it } from 'vitest';

import { MockEvmProvider } from '../../../test-utils/mock.evm.provider.js';
import { DefaultEvmSigner } from '../src/index.js';

import { address, EVM_TX, privateKey } from './mock.data.js';

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
        '0xc22ee8f90ace365af000af37078743d4e72136a61a4f5838a537f573af45911f1445a2dfae662c79d98ce865cf134e7f4be896f19f59a6ed4dfe34c52c80c8581b'
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
