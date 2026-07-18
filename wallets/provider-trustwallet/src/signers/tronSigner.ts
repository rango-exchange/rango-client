import type { TronTransaction, TrxContractData } from 'rango-types';

import { DefaultTronSigner } from '@rango-dev/signer-tron';

// TODO: remove this and use the default signer after the backend fixed the problem
/*
 * Rango's Tron transactions carry an extra `type` field inside
 * `raw_data.contract[*].parameter.value` (alongside the standard one on the contract
 * object). TronLink ignores unknown fields, but Trust signs through wallet-core, whose
 * strict parser rejects the whole transaction with "unexpected field 'type' in contract
 * value" — so we strip it before handing the transaction to the wallet. This doesn't
 * affect the signature: it is computed over `txID`/`raw_data_hex`, which never contained
 * the field.
 */
function omitTypeFromContractValue(contract: TrxContractData): TrxContractData {
  const { value } = contract.parameter;

  if (typeof value !== 'object' || value === null || !('type' in value)) {
    return contract;
  }

  const { type: _omitted, ...sanitizedValue } = value as Record<
    string,
    unknown
  >;
  return {
    ...contract,
    parameter: { ...contract.parameter, value: sanitizedValue },
  };
}

export class CustomTronSigner extends DefaultTronSigner {
  async signAndSendTx(tx: TronTransaction): Promise<{ hash: string }> {
    if (!tx.raw_data) {
      return super.signAndSendTx(tx);
    }

    return super.signAndSendTx({
      ...tx,
      raw_data: {
        ...tx.raw_data,
        contract: tx.raw_data.contract.map(omitTypeFromContractValue),
      },
    });
  }
}
