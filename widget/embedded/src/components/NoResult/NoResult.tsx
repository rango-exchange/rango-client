import type { PropTypes } from './NoResult.types';

import {
  Alert,
  Button,
  Divider,
  NoRouteIcon,
  RefreshIcon,
  Typography,
} from '@rango-dev/ui';
import React from 'react';

import { errorMessages } from '../../constants/errors';
import { useAppStore } from '../../store/AppStore';

import {
  makeInfo,
  NoRouteIconSize,
  NoRouteTitleSize,
} from './NoResult.helpers';
import {
  Container,
  ErrorDescription,
  Footer,
  PrefixIcon,
} from './NoResult.styles';

export function NoResult(props: PropTypes) {
  const { fetch, error, size = 'small' } = props;
  const disabledLiquiditySources = useAppStore().getDisabledLiquiditySources();
  const toggleAllLiquiditySources = useAppStore().toggleAllLiquiditySources;

  const swappers = useAppStore().swappers();
  const info = makeInfo(
    error,
    disabledLiquiditySources,
    () => toggleAllLiquiditySources(swappers, true),
    fetch
  );

  return (
    <Container>
      <NoRouteIcon size={NoRouteIconSize[size]} color="gray" />
      <Divider size={4} />
      <Typography variant="title" size={NoRouteTitleSize[size]}>
        {errorMessages().noResultError.title}
      </Typography>
      {size === 'large' && <Divider size={4} />}
      {!!info.description && (
        <ErrorDescription size={size}>
          <Typography
            variant="body"
            size="small"
            align="center"
            color="neutral700">
            {info.description}
          </Typography>
        </ErrorDescription>
      )}
      <Divider size={size === 'large' ? '24' : '4'} />
      {!!info.alert && (
        <Footer size={size}>
          <Alert
            type={info.alert.type}
            title={info.alert.text}
            titleAlign={'left'}
            action={
              info.alert.action && (
                <Button
                  size="xsmall"
                  type={info.alert.type}
                  prefix={
                    <PrefixIcon>
                      <RefreshIcon size={8} />
                    </PrefixIcon>
                  }
                  onClick={info.alert.action.onClick}>
                  {info.alert.action.title}
                </Button>
              )
            }
            variant="alarm"
          />
        </Footer>
      )}
    </Container>
  );
}
