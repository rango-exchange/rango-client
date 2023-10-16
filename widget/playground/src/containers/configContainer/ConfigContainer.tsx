import type { PropsWithChildren } from 'react';

import {
  DesktopIcon,
  Divider,
  LogoWithTextIcon,
  Typography,
} from '@rango-dev/ui';
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
  LogoIcon,
  Main,
  MobileContent,
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
        <LogoIcon>
          <LogoWithTextIcon size={94} color="primary" />
        </LogoIcon>
        <MobileContent>
          <DesktopIcon size={228} />
          <Typography size="small" variant="headline" align="center">
            Use a Desktop Browser
          </Typography>
          <Divider size={8} />
          <Typography
            size="medium"
            variant="body"
            align="center"
            color="neutral900">
            To use the Playground page, You must use the Desktop version
          </Typography>
        </MobileContent>
      </MobileSection>
    </>
  );
}
