import { Checkbox, Spacer, styled, Typography } from '@rangodev/ui';
import React from 'react';
import { useConfigStore } from '../store/config';
import { useMetaStore } from '../store/meta';
import { Type } from '../types';
import { MultiSelect } from './MultiSelect';
import { MultiTokenSelect } from './MultiTokenSelect';
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
  const {
    meta: { blockchains, tokens },
    loadingStatus,
  } = useMetaStore();

  const { fromChains, toChains, customeAddress, onChangeBlockChains, onChangeBooleansConfig } =
    useConfigStore((state) => state);

  const chains = type === 'Destination' ? fromChains : toChains;

  return (
    <div>
      <Typography variant="h4">{type} Form</Typography>
      <Spacer size={12} direction="vertical" />
      <ConfigurationContainer>
        <MultiSelect
          list={blockchains}
          label="Supported Blockchains"
          type="Blockchains"
          loading={loadingStatus === 'loading'}
          disabled={loadingStatus === 'failed'}
          value={type === 'Destination' ? fromChains : toChains}
          onChange={(chains) => onChangeBlockChains(chains, type)}
          modalTitle="Select Blockchains"
        />
        <Spacer size={24} direction={'vertical'} />
        <MultiTokenSelect
          list={tokens}
          loading={loadingStatus === 'loading'}
          disabled={loadingStatus === 'failed'}
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
              label="Enable transfer to custom address"
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
