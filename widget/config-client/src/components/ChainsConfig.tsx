import { Checkbox, Spacer, styled, Typography } from '@rangodev/ui';
import { BlockchainMeta, Token } from 'rango-sdk';
import React from 'react';
import { useMetaStore } from '../store/meta';
import { ConfigType } from '../types';
import { MultiSelect } from './MultiSelect';
import { MultiTokenSelect } from './MultiTokenSelect';
import { TokenInfo } from './TokenInfo';

interface PropTypes {
  type: 'Destination' | 'Source';
  config: ConfigType;
  onChange: (
    name: string,
    value: 'all' | BlockchainMeta[] | Token[] | boolean | Token | BlockchainMeta,
  ) => void;
}
export const ConfigurationContainer = styled('div', {
  borderRadius: '$10',
  maxWidth: '732px',
  boxShadow: '$s',
  padding: '$16',
  backgroundColor: '$background',
});

export function ChainsConfig({ type, config, onChange }: PropTypes) {
  const {
    meta: { blockchains, tokens },
    loadingStatus,
  } = useMetaStore();

  const chains = type === 'Destination' ? config.fromChains : config.toChains;

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
          onChange={onChange}
          name={type === 'Destination' ? 'fromChains' : 'toChains'}
          value={chains}
          modalTitle="Select Blockchains"
        />
        <Spacer size={24} direction={'vertical'} />
        <MultiTokenSelect
          list={tokens}
          onChange={onChange}
          loading={loadingStatus === 'loading'}
          disabled={loadingStatus === 'failed'}
          modalTitle="Select Tokens"
          label="Supported Tokens"
          name={type === 'Destination' ? 'fromTokens' : 'toTokens'}
          value={type === 'Destination' ? config.fromTokens : config.toTokens}
          blockchains={chains === 'all' ? blockchains : chains}
        />
        {type === 'Destination' ? (
          <>
            <Spacer direction="vertical" size={12} />
            <Checkbox
              onCheckedChange={(checked) => onChange('customeAddress', checked)}
              id="custom_address"
              label="Enable transfer to custom address"
              checked={config.customeAddress}
            />
          </>
        ) : null}
        <Spacer size={24} direction={'vertical'} />

        <TokenInfo
          type={type === 'Destination' ? 'from' : 'to'}
          chain={type === 'Destination' ? config.fromChain : config.toChain}
          defualtAmount={config.fromAmount}
          onChange={onChange}
          token={type === 'Destination' ? config.fromToken : config.toToken}
        />
      </ConfigurationContainer>
    </div>
  );
}
