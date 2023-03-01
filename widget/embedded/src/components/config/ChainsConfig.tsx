import { Checkbox, Spacer, styled, Typography } from '@rangodev/ui';
import { BlockchainMeta, TokenMeta } from '@rangodev/ui/dist/types/meta';
import React from 'react';
import { ConfigType } from '../../types/config';
import { blockchainMeta } from './mock';
import { MultiSelect } from './MultiSelect';
import { TokenInfo } from './TokenInfo';

interface PropTypes {
  type: 'Destination' | 'Source';
  config: ConfigType;
  onChange: (name: string, value: string | TokenMeta | BlockchainMeta | boolean) => void;
}
export const ConfigurationContainer = styled('div', {
  borderRadius: '$10',
  maxWidth: '732px',
  boxShadow: '$s',
  padding: '$16',
  backgroundColor: '$background',
});

export function ChainsConfig({ type, config, onChange }: PropTypes) {
  return (
    <div>
      <Typography variant="h4">{type} Form</Typography>
      <Spacer size={12} scale="vertical" />
      <ConfigurationContainer>
        <MultiSelect
          // list={blockchainMeta}
          label="Supported Blockchains"
          type="Blockchains" 
          modalTitle={''}          // selectItem={{
          //   image: '',
          //   value: '',
          // }}
        />
        <Spacer size={24} scale={'vertical'} />
        <MultiSelect
          // list={blockchainMeta}
          label="Supported Tokens"
          type="Tokens"
          modalTitle={''} 
          // selectItem={{
          //   image: '',
          //   value: '',
          // }}
        />
        {type === 'Destination' ? (
          <>
            <Spacer scale="vertical" size={12} />
            <Checkbox
              onCheckedChange={(checked) => onChange('customeAddress', checked)}
              id="custom_address"
              label="Enable transfer to custom address"
              checked={config.customeAddress}
            />
          </>
        ) : null}
        <Spacer size={24} scale={'vertical'} />

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
