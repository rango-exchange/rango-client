import type { Type } from '../../types';
import type { tokensConfigType } from '../../utils/configs';

import { ChainsIcon } from '@rango-dev/ui';
import React from 'react';

import { MultiSelect } from '../../components/MultiSelect';
import { useConfigStore } from '../../store/config';
import { useMetaStore } from '../../store/meta';
import { tokensAreEqual } from '../../utils/common';
import { isTokenExcludedInConfig } from '../../utils/configs';

export function SupportedTokens({ type }: { type: Type }) {
  const {
    config: { from, to },
    onChangeTokens,
    onChangeToken,
    onChangePinnedTokens,
  } = useConfigStore();
  const {
    meta: { tokens, blockchains },
  } = useMetaStore();

  const selectedType = type === 'Source' ? from : to;

  const tokensConfig = selectedType?.tokens as tokensConfigType;
  const pinnedTokens = selectedType?.pinnedTokens;

  const selectedBlockchains = selectedType?.blockchains;
  const allTokens = selectedBlockchains
    ? tokens.filter((token) => selectedBlockchains.includes(token.blockchain))
    : tokens;
  const defaultBlockchains =
    selectedBlockchains || blockchains.map((chain) => chain.name);

  const tokensWithCheck = allTokens.map((token) => {
    const isToken = isTokenExcludedInConfig(token, tokensConfig);
    const isExclude =
      tokensConfig &&
      tokensConfig[token.blockchain] &&
      tokensConfig[token.blockchain].isExcluded;

    return {
      ...token,
      checked:
        !tokensConfig || (!isExclude && !isToken) || (isExclude && isToken),
      pinned:
        !!pinnedTokens && pinnedTokens.some((ct) => tokensAreEqual(ct, token)),
    };
  });

  const checkedTokens = tokensWithCheck.filter((item) => item.checked);

  const isAllTokens =
    !tokensConfig || checkedTokens.length === tokensWithCheck.length;

  return (
    <>
      <MultiSelect
        label="Supported Tokens"
        type="Tokens"
        icon={<ChainsIcon size={24} />}
        selectedBlockchains={defaultBlockchains}
        value={
          isAllTokens
            ? undefined
            : defaultBlockchains.filter((blockchain) =>
                checkedTokens?.some((token) => token.blockchain === blockchain)
              )
        }
        tokensConfig={tokensConfig || {}}
        list={tokensWithCheck}
        onChange={(selectedTokens, pinnedTokens) => {
          onChangePinnedTokens(
            pinnedTokens?.map(({ symbol, blockchain, address }) => ({
              symbol,
              blockchain,
              address,
            })),
            type
          );
          onChangeTokens(selectedTokens, type);
          onChangeToken(undefined, type);
        }}
      />
    </>
  );
}
