import { Checkbox, Spacer, styled, Typography } from '@rango-dev/ui';
import React from 'react';
import { onChangeMultiSelects } from '../helpers';
import { useConfigStore } from '../store/config';
import { useMetaStore } from '../store/meta';
import { Type } from '../types';
import { MultiSelect } from './MultiSelect';
import { MultiTokenSelect } from './MultiSelect/MultiTokenSelect';
import { TokenInfo } from './TokenInfo';

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
  const fromChains = useConfigStore.use.configs().fromChains;
  const toChains = useConfigStore.use.configs().toChains;
  const customeAddress = useConfigStore.use.configs().customeAddress;
  const onChangeBlockChains = useConfigStore.use.onChangeBlockChains();
  const onChangeTokens = useConfigStore.use.onChangeTokens();

  const onChangeBooleansConfig = useConfigStore.use.onChangeBooleansConfig();

  const chains = type === 'Source' ? fromChains : toChains;

  const onChangeChains = (chain) => {
    let values = type === 'Source' ? fromChains : toChains;
    values = onChangeMultiSelects(chain, values, blockchains, (item) => item.name === chain.name);
    onChangeBlockChains(values, type);
    onChangeTokens('all', type);
  };

  return (
    <div>
      <Typography variant="h4">{type} Form</Typography>
      <Spacer size={12} direction="vertical" />
      <ConfigurationContainer>
        <MultiSelect
          list={blockchains}
          label="Supported Blockchains"
          type="Blockchains"
          value={type === 'Source' ? fromChains : toChains}
          onChange={onChangeChains}
          modalTitle="Select Blockchains"
        />
        <Spacer size={24} direction={'vertical'} />
        <MultiTokenSelect
          list={tokens}
          modalTitle="Select Tokens"
          label="Supported Tokens"
          type={type}
          blockchains={chains === 'all' ? blockchains : chains}
        />
        {type === 'Destination' ? (
          <>
            <Spacer direction="vertical" size={12} />
            <Checkbox
              onCheckedChange={(checked) => onChangeBooleansConfig('customeAddress', checked)}
              id="custom_address"
              label="Enable Transfer To Custom Address"
              checked={customeAddress}
            />
          </>
        ) : null}
        <Spacer size={24} direction={'vertical'} />

        <TokenInfo type={type} />
      </ConfigurationContainer>
    </div>
  );
}
