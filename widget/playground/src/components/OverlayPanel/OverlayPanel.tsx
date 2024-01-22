import type { PropTypes } from './OverlayPanel.types';
import type { PropsWithChildren } from 'react';

import { ChevronLeftIcon, Divider, Typography } from '@rango-dev/ui';
import React from 'react';

import { Container, Header, Layout } from './OverlayPanel.styles';

export function OverlayPanel(props: PropsWithChildren<PropTypes>) {
  const { onBack, children } = props;
  return (
    <Layout>
      <Container>
        <Header onClick={onBack}>
          <ChevronLeftIcon size={12} color="black" />
          <Divider size={4} direction="horizontal" />
          <Typography size="medium" variant="label" color="neutral700">
            back
          </Typography>
        </Header>
        <Divider size={10} />
        {children}
      </Container>
    </Layout>
  );
}
