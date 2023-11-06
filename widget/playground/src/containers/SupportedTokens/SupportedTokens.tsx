import type { Type } from '../../types';

import { ChainsIcon } from '@rango-dev/ui';
import React from 'react';

import { MultiSelect } from '../../components/MultiSelect/MultiSelect';
import { useConfigStore } from '../../store/config';
import { useMetaStore } from '../../store/meta';
import { tokensAreEqual } from '../../utils/common';

export function SupportedTokens({ type }: { type: Type }) {
  const {
    config: { from, to },
    onChangeTokens,
    onChangeToken,
  } = useConfigStore();
  const {
    meta: { tokens, blockchains },
  } = useMetaStore();

  const selectedType = type === 'Source' ? from : to;

  const configTokens = selectedType?.tokens;

  const seletedBlockchains = selectedType?.blockchains;
  const allTokens = seletedBlockchains
    ? tokens.filter((token) => seletedBlockchains.includes(token.blockchain))
    : tokens;
  const defaultBlockchains =
    seletedBlockchains || blockchains.map((chain) => chain.name);

  const list = allTokens.map((token) => {
    return {
      ...token,
      checked:
        !configTokens || configTokens.some((ct) => tokensAreEqual(ct, token)),
    };
  });

  const isAllTokens = !configTokens || configTokens.length === list.length;

  return (
    <MultiSelect
      label="Supported Tokens"
      type="Tokens"
      icon={<ChainsIcon size={24} />}
      selectedBlockchains={defaultBlockchains}
      value={
        isAllTokens
          ? undefined
          : defaultBlockchains.filter((blockchain) =>
              configTokens?.some((token) => token.blockchain === blockchain)
            )
      }
      list={list}
      onChange={(items) => {
        onChangeTokens(
          items?.map(({ symbol, blockchain, address }) => ({
            symbol,
            blockchain,
            address,
          })),
          type
        );
        onChangeToken(undefined, type);
      }}
    />
  );
}
