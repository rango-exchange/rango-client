import type { PropTypes } from './NoRoutes.types';

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
import { useMetaStore } from '../../store/meta';
import { useSettingsStore } from '../../store/settings';

import { makeInfo } from './NoRoutes.helper';
import { Container, Footer, PrefixIcon } from './NoRoutes.styles';

export function NoRoutes(props: PropTypes) {
  const { diagnosisMessage, fetch, error } = props;
  const disabledLiquiditySources =
    useSettingsStore.use.disabledLiquiditySources();
  const loadingMetaStatus = useMetaStore.use.loadingStatus();
  const toggleAllLiquiditySources =
    useSettingsStore.use.toggleAllLiquiditySources();

  const hasError = error || loadingMetaStatus === 'failed';

  const info = makeInfo(
    diagnosisMessage ?? null,
    disabledLiquiditySources,
    hasError,
    toggleAllLiquiditySources,
    fetch
  );

  return (
    <Container>
      <NoRouteIcon size={24} color="gray" />
      <Divider size={4} />
      <Typography variant="title" size="small">
        {errorMessages().noRoutesError.title}
      </Typography>
      {!!info.description && (
        <Typography
          variant="body"
          size="small"
          align="center"
          color="neutral700">
          {info.description}
        </Typography>
      )}
      <Divider size={4} />
      {!!info.alert && (
        <Footer>
          <Alert
            type={info.alert.type}
            title={info.alert.text}
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
