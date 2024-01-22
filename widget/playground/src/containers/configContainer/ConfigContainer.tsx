import type { PropsWithChildren } from 'react';

import {
  DesktopIcon,
  Divider,
  HeightIcon,
  LogoWithTextIcon,
  Switch,
  Typography,
  WidthIcon,
} from '@rango-dev/ui';
import React, { useState } from 'react';

import { SideNavigation } from '../../components/SideNavigation';
import { SIDE_TABS_IDS } from '../../constants';
import { globalStyles } from '../../globalStyles';
import { FunctionalLayout } from '../FunctionalLayout';
import { StyleLayout } from '../StyleLayout';

import { Header } from './ConfigContainer.Header';
import {
  BoundaryGuide,
  BoundarySection,
  BoundarySize,
  Container,
  Content,
  Layout,
  LeftSide,
  LogoIcon,
  Main,
  MobileContent,
  MobileSection,
} from './ConfigContainer.styles';

export function ConfigContainer(props: PropsWithChildren) {
  const [activeLayout, setActiveLayout] = useState(SIDE_TABS_IDS.FUNCTIONAL);
  globalStyles();
  const [showBoundaryGuide, setShowBoundaryGuide] = useState<boolean>(false);

  return (
    <>
      <Container>
        <LeftSide>
          <SideNavigation
            onChange={(id) => setActiveLayout(id)}
            activeLayout={activeLayout}
          />
          <Divider direction="horizontal" size={10} />
          <Layout>
            {activeLayout === SIDE_TABS_IDS.FUNCTIONAL ? (
              <FunctionalLayout />
            ) : (
              <StyleLayout />
            )}

            <BoundarySection>
              <Typography variant="label" size="medium" color="neutral600">
                Show Widget Boundary Guide
              </Typography>
              <Switch
                checked={showBoundaryGuide}
                onChange={(checked) => setShowBoundaryGuide(checked)}
              />
            </BoundarySection>
          </Layout>
        </LeftSide>
        <Main>
          <Header />
          <Content>
            {showBoundaryGuide && (
              <BoundarySize side="right">
                <WidthIcon size={16} color="gray" />
                <Divider size={4} direction="horizontal" />
                <Typography variant="label" size="medium" color="neutral600">
                  Max Width: 390 px
                </Typography>
              </BoundarySize>
            )}
            <BoundaryGuide
              style={{ borderWidth: showBoundaryGuide ? '1px' : 0 }}>
              {props.children}
            </BoundaryGuide>

            {showBoundaryGuide && (
              <BoundarySize side="left">
                <HeightIcon size={16} color="gray" />
                <Divider size={4} direction="horizontal" />
                <Typography variant="label" size="medium" color="neutral600">
                  Max Height: 700 px
                </Typography>
              </BoundarySize>
            )}
          </Content>
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
            color="neutral700">
            To use the Playground page, You must use the Desktop version
          </Typography>
        </MobileContent>
      </MobileSection>
    </>
  );
}
