import type { PropsWithChildren } from 'react';

import { Divider, Typography } from '@rango-dev/ui';
import React, { useState } from 'react';

import { SideNavigation } from '../../components/SideNavigation';
import { SIDE_TABS_IDS } from '../../constants';
import { globalStyles } from '../../globalStyles';
import { FunctionalLayout } from '../FunctionalLayout';
import { StyleLayout } from '../StyleLayout';

import { Header } from './ConfigContainer.Header';
import {
  Container,
  Content,
  LeftSide,
  Main,
  MobileSection,
} from './ConfigContainer.styles';

export function ConfigContainer(props: PropsWithChildren) {
  const [activeLayout, setActiveLayout] = useState(SIDE_TABS_IDS.FUNCTIONAL);
  globalStyles();

  return (
    <>
      <Container>
        <LeftSide>
          <SideNavigation
            onChange={(id) => setActiveLayout(id)}
            activeLayout={activeLayout}
          />
          <Divider direction="horizontal" size={12} />
          {activeLayout === SIDE_TABS_IDS.FUNCTIONAL ? (
            <FunctionalLayout />
          ) : (
            <StyleLayout />
          )}
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
