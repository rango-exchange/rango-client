import type { Type } from '../../types';
import type { tokensConfigType } from '../../utils/configs';

import { ChainsIcon, Divider, Tooltip } from '@rango-dev/ui';
import React, { useState } from 'react';

import { ItemPicker } from '../../components/ItemPicker';
import { OverlayPanel } from '../../components/OverlayPanel';
import { SingleList } from '../../components/SingleList';
import { useConfigStore } from '../../store/config';
import { useMetaStore } from '../../store/meta';
import { areTokensEqual, tokenToString } from '../../utils/common';
import { isTokenExcludedInConfig } from '../../utils/configs';
import { ModalState } from '../FunctionalLayout/FunctionalLayout.types';

export function DefaultChainAndToken({ type }: { type: Type }) {
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const {
    config: { from, to },
    onChangeBlockChain,
    onChangeToken,
  } = useConfigStore();
  const {
    meta: { blockchains, tokens },
  } = useMetaStore();

  const selectedType = type === 'Source' ? from : to;
  const tokensConfig = selectedType?.tokens as tokensConfigType;
  const filteredTokens = selectedType?.blockchain
    ? tokens.filter((token) => {
        const isToken = isTokenExcludedInConfig(token, tokensConfig);
        return token.blockchain === selectedType.blockchain && !isToken;
      })
    : [];
  const chainValue = blockchains.find(
    (chain) => chain.name === selectedType?.blockchain
  );
  const tokenValue = tokens.find((token) =>
    areTokensEqual(token, selectedType?.token)
  );

  const handleDefaultBlockchainConfirm = (item: string) => {
    if (item) {
      onChangeBlockChain(item, type);
      onChangeToken(undefined, type);
    }
    onBack();
  };

  const handleDefaultTokenConfirm = (item: string) => {
    if (item) {
      const selectedToken = filteredTokens.find(
        (token) => tokenToString(token) === item
      );
      if (selectedToken) {
        onChangeToken(
          {
            blockchain: selectedToken.blockchain,
            address: selectedToken.address,
            symbol: selectedToken.symbol,
          },
          type
        );
      }
    }
    onBack();
  };

  const onBack = () => setModalState(null);

  const filteredBlockchains = selectedType?.blockchains
    ? blockchains.filter((chain) =>
        selectedType.blockchains?.includes(chain.name)
      )
    : blockchains;

  return (
    <>
      <ItemPicker
        onClick={() => setModalState(ModalState.DEFAULT_BLOCKCHAIN)}
        value={{ label: chainValue?.displayName, logo: chainValue?.logo }}
        title="Default Blockchain"
        hasLogo={true}
        placeholder="Chain"
        disabled={!blockchains?.length}
      />
      <Divider size={10} />
      <Tooltip
        content="Choose the default blockchain first"
        open={!chainValue ? undefined : false}
        side="bottom">
        <ItemPicker
          onClick={() => setModalState(ModalState.DEFAULT_TOKEN)}
          value={{ label: tokenValue?.symbol, logo: tokenValue?.image }}
          title="Default Token"
          hasLogo={true}
          placeholder="Token"
          disabled={!chainValue}
        />
      </Tooltip>
      {modalState === ModalState.DEFAULT_BLOCKCHAIN && (
        <OverlayPanel onBack={onBack}>
          <SingleList
            onChange={handleDefaultBlockchainConfirm}
            list={filteredBlockchains.map((chain) => ({
              name: chain.displayName,
              image: chain.logo,
              value: chain.name,
            }))}
            title="Default Blockchain"
            defaultValue={selectedType?.blockchain}
            icon={<ChainsIcon size={24} />}
            searchPlaceholder="Search Blockchain"
          />
        </OverlayPanel>
      )}
      {modalState === ModalState.DEFAULT_TOKEN && (
        <OverlayPanel onBack={onBack}>
          <SingleList
            onChange={handleDefaultTokenConfirm}
            list={filteredTokens.map((token) => ({
              name: token.symbol,
              image: token.image,
              value: tokenToString(token),
            }))}
            title="Default Token"
            defaultValue={
              selectedType?.token ? tokenToString(selectedType?.token) : null
            }
            icon={<ChainsIcon size={24} />}
            searchPlaceholder="Search Token"
          />
        </OverlayPanel>
      )}
    </>
  );
}
