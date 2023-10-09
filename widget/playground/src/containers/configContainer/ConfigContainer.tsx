import type { PropsWithChildren } from 'react';

import { Divider, Typography } from '@rango-dev/ui';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

import { SideNavigation } from '../../components/SideNavigation';
import { StyleLayout } from '../../components/StyleLayout';
import { SearchParams, SIDE_TABS_IDS } from '../../constants';
import { globalStyles } from '../../globalStyles';

import { Header } from './ConfigContainer.Header';
import {
  Container,
  Content,
  LeftSide,
  Main,
  MobileSection,
} from './ConfigContainer.styles';

export function ConfigContainer(props: PropsWithChildren) {
  globalStyles();
  const [searchParams] = useSearchParams();
  const layoutParams = new URLSearchParams(searchParams.toString());
  const layoutSelected = layoutParams.get(SearchParams.LAYOUT);

  return (
    <>
      <Container>
        <LeftSide>
          <SideNavigation />
          <Divider direction="horizontal" size={12} />
          {layoutSelected === SIDE_TABS_IDS.FUNCTIONAL ? null : <StyleLayout />}
        </LeftSide>
        <Main>
          <Header />
          <Content>{props.children}</Content>
        </Main>
      </Container>
      <MobileSection>
        <Typography size="large" variant="title" align="center">
          Please use our platform from a desktop computer for full functionality
        </Typography>
      </MobileSection>
    </>
  );
}
