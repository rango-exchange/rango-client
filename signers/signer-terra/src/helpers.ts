import type { CreateTxOptions, Msg as TerraMsg } from '@terra-money/terra.js';
import type { Fee } from '@terra-money/terra.js/dist/core/index.js';
import type { CosmosTransaction } from 'rango-types';

import { JSONSerializable } from '@terra-money/terra.js/dist/util/json.js';

export const executeTerraTransaction = async (
  cosmosTx: CosmosTransaction,
  provider: any
): Promise<string> => {
  const txOptions = await cosmosTxToTerraTx(cosmosTx);
  return new Promise<string>((resolve, reject) => {
    provider
      .post(txOptions)
      .then((result: { result: { txhash: string | PromiseLike<string> } }) =>
        resolve(result?.result?.txhash)
      )
      .catch((error: any) => {
        console.log({ error });
        reject(error);
      });
  });
};

async function cosmosTxToTerraTx(
  tx: CosmosTransaction
): Promise<CreateTxOptions> {
  let tmpStdFee: Fee | undefined = undefined;
  if (tx.data.fee) {
    const { Coin } = await import('@terra-money/terra.js');
    const { Fee } = await import('@terra-money/terra.js/dist/core/index.js');

    const tmpCoinsFee = tx.data.fee.amount.map(
      (item) => new Coin(item.denom, item.amount)
    );
    tmpStdFee = new Fee(parseInt(tx.data.fee.gas), tmpCoinsFee);
  }

  const msgs = tx.data.msgs.map(
    (m) => new TerraMessageGeneralJsonSerializable(m) as unknown as TerraMsg
  );

  return {
    msgs,
    fee: tmpStdFee,
    memo: tx.data.memo || '',
    gas: tx.data.fee?.gas,
  };
}

export class TerraMessageGeneralJsonSerializable extends JSONSerializable<
  any,
  any,
  any
> {
  constructor(public raw: any) {
    super();
  }

  public static fromData(data: any): TerraMessageGeneralJsonSerializable {
    return new TerraMessageGeneralJsonSerializable(data);
  }

  toData(): any {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __type, value, ...rest } = this.raw;
    return JSON.parse(JSON.stringify({ ...rest, ...value }));
  }

  toAmino(): any {
    return this.toData();
  }
  toProto(): any {
    return this.toData();
  }
}
