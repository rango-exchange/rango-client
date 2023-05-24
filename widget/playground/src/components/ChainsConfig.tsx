import { Divider, styled, Typography, Checkbox } from '@rango-dev/ui';
import React from 'react';
import { onChangeMultiSelects } from '../helpers';
import { useConfigStore } from '../store/config';
import { useMetaStore } from '../store/meta';
import { Type } from '../types';
import { MultiSelect } from './MultiSelect';
import { MultiTokenSelect } from './MultiSelect/MultiTokenSelect';
import { TokenInfo } from './TokenInfo';
import { Asset } from 'rango-sdk';

interface PropTypes {
  type: Type;
}
export const ConfigurationContainer = styled('div', {
  borderRadius: '$10',
  maxWidth: '732px',
  boxShadow: '$s',
  padding: '$16',
  backgroundColor: '$background',
});

export function ChainsConfig({ type }: PropTypes) {
  const blockchains = useMetaStore.use.meta().blockchains;
  const tokens = useMetaStore.use.meta().tokens;
  const from = useConfigStore.use.config().from;
  const to = useConfigStore.use.config().to;

  const customDestination = useConfigStore.use.config().customDestination;
  const onChangeBlockChains = useConfigStore.use.onChangeBlockChains();
  const onChangeTokens = useConfigStore.use.onChangeTokens();

  const onChangeBooleansConfig = useConfigStore.use.onChangeBooleansConfig();

  const chains = type === 'Source' ? from?.blockchains : to?.blockchains;

  const onChangeChains = (blockchain: string) => {
    const tokens = type === 'Source' ? from?.tokens : to?.tokens;
    const ChainsList = blockchains.map((chain) => chain.name);
    const values = onChangeMultiSelects(
      blockchain,
      chains,
      ChainsList,
      (item) => item === blockchain,
    );
    onChangeBlockChains(values, type);

    let tokensList: Asset[] = [];
    if (tokens && values) {
      for (const chain of values) {
        tokensList = [...tokensList, ...tokens.filter((token) => token.blockchain === chain)];
      }
    }
    onChangeTokens(tokensList && tokensList.length ? tokensList : undefined, type);
  };

  return (
    <div>
      <Typography variant="h6">{type} Form</Typography>
      <Divider size={12} />
      <ConfigurationContainer>
        <MultiSelect
          list={blockchains}
          label="Supported Blockchains"
          type="Blockchains"
          value={type === 'Source' ? from?.blockchains : to?.blockchains}
          onChange={onChangeChains}
          modalTitle="Select Blockchains"
        />
        <Divider size={32} />
        <MultiTokenSelect
          list={tokens}
          modalTitle="Select Tokens"
          label="Supported Tokens"
          type={type}
          blockchains={
            !chains ? blockchains : blockchains.filter((chain) => chains.includes(chain.name))
          }
        />
        {type === 'Destination' ? (
          <>
            <Divider size={16} />
            <Checkbox
              onCheckedChange={(checked) => onChangeBooleansConfig('customDestination', checked)}
              id="custom_address"
              label="Enable Transfer To Custom Address"
              checked={customDestination === undefined ? true : customDestination}
            />
          </>
        ) : null}
        <Divider size={24} direction='vertical' />

        <TokenInfo type={type} />
      </ConfigurationContainer>
    </div>
  );
}
