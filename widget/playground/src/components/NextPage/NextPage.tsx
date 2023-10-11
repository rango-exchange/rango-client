import type { PropTypes } from './NextPage.types';
import type { PropsWithChildren } from 'react';

import { ChevronLeftIcon, Divider, Typography } from '@rango-dev/ui';
import React from 'react';

import { Container, Header } from './NextPage.styles';

export function NextPage(props: PropsWithChildren<PropTypes>) {
  const { onBack, children } = props;
  return (
    <Container>
      <Header onClick={onBack}>
        <ChevronLeftIcon size={12} />
        <Divider size={4} direction="horizontal" />
        <Typography size="medium" variant="label" color="neutral900">
          back
        </Typography>
      </Header>
      <Divider size={12} />
      {children}
    </Container>
  );
}
