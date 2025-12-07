import type { PropTypes } from './MaxBalance.types';

import { Divider, Skeleton, Typography } from '@rango-dev/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Container, MaxButton } from './MaxBalance.styles';

export function MaxBalance(props: PropTypes) {
  const { balance, loading, onClickMaxBalance } = props;
  const { t } = useTranslation();

  return (
    <Container>
      {loading ? (
        <Skeleton variant="text" size="large" width={105} />
      ) : (
        <>
          <Typography
            variant="body"
            size="xsmall"
            color="neutral600"
            className="max-balance">
            {t('Balance')}: {balance ?? '0.00'}
          </Typography>
          <Divider direction="horizontal" size={4} />
          {balance && (
            <MaxButton
              variant="default"
              size="small"
              id="widget-home-max-btn"
              onClick={onClickMaxBalance}>
              <Typography variant="body" size="xsmall">
                {t('Max')}
              </Typography>
            </MaxButton>
          )}
        </>
      )}
    </Container>
  );
}
