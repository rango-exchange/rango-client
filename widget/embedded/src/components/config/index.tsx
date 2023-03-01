import React from 'react';
import { Spacer, styled, Typography } from '@rangodev/ui';
import { ChainsConfig } from './ChainsConfig';
import { WalletsConfig } from './WalletsConfig';
import { SourcesConfig } from './SourcesConfig';
import { StylesConfig } from './StylesConfig';
import { ConfigType, StyleType, Value } from '../../types/config';

const Container = styled('div', {
  height: 'calc(100vh - 40px)',
  overflowY: 'auto',
});
interface PropTypes {
  style: StyleType;
  config: ConfigType;
  onChangeStyles: (name: string, value: string, color: boolean) => void;
  onChangeConfig: (name: string, value: Value) => void;
}

export function Config({ style, config, onChangeStyles, onChangeConfig }: PropTypes) {
  return (
    <Container>
      <Typography variant="h1">Configuration</Typography>
      <Spacer size={20} scale="vertical" />
      <ChainsConfig type="Source" config={config} onChange={onChangeConfig} />
      <Spacer size={24} scale="vertical" />
      <ChainsConfig type="Destination" config={config} onChange={onChangeConfig} />
      <Spacer size={24} scale="vertical" />
      <WalletsConfig onChange={onChangeConfig} config={config} />
      <Spacer size={24} scale="vertical" />
      <SourcesConfig onChange={onChangeConfig} config={config} />
      <Spacer size={24} scale="vertical" />
      <StylesConfig onChange={onChangeStyles} style={style} />
    </Container>
  );
}
