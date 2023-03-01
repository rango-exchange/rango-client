import { Checkbox, MultiSelect, Spacer, styled, Typography } from '@rangodev/ui';
import React from 'react';
import { blockchainMeta } from './mock';
import { TokenInfo } from './TokenInfo';

interface PropTypes {
  type: 'Destination' | 'Source';
}
export const ConfigurationContainer = styled('div', {
  borderRadius: '$10',
  maxWidth: '732px',
  boxShadow: '$s',
  padding: '$16',
  backgroundColor:'$background'
});

export function ChainsConfig({ type }: PropTypes) {
  return (
    <div>
      <Typography variant="h4">{type} Form</Typography>
      <Spacer size={12} scale="vertical" />
      <ConfigurationContainer>
        <MultiSelect
          list={blockchainMeta}
          label="Supported Blockchains"
          type="Blockchains"
          selectItem={{
            image: '',
            value: '',
          }}
        />
        <Spacer size={24} scale={'vertical'} />
        <MultiSelect
          list={blockchainMeta}
          label="Supported Tokens"
          type="Tokens"
          selectItem={{
            image: '',
            value: '',
          }}
        />
        {type === 'Destination' ? (
          <>
            <Spacer scale="vertical" size={12} />
            <Checkbox id="custom_address" label="Enable transfer to custom address" checked />
          </>
        ) : null}
        <Spacer size={24} scale={'vertical'} />

        <TokenInfo type={type} />
      </ConfigurationContainer>
    </div>
  );
}
