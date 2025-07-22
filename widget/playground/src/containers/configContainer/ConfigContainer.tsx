import type { PropsWithChildren } from 'react';

import {
  DesktopIcon,
  Divider,
  LogoWithTextIcon,
  Switch,
  Typography,
} from '@arlert-dev/ui';
import React, { useState } from 'react';

import { SideNavigation } from '../../components/SideNavigation';
import { SIDE_TABS_IDS } from '../../constants';
import { RANGO_DOCS_URL, RANGO_WEBSITE_URL } from '../../constants/urls';
import { globalStyles } from '../../globalStyles';
import BoundaryGuideContainer from '../BoundaryGuideContainer/BoundaryGuideContainer';
import { FunctionalLayout } from '../FunctionalLayout';
import { StyleLayout } from '../StyleLayout';

import { Header } from './ConfigContainer.Header';
import {
  BoundarySection,
  Container,
  Content,
  Layout,
  LeftSide,
  LogoIcon,
  Main,
  MobileContent,
  MobileSection,
  StyledButton,
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
            <BoundaryGuideContainer show={showBoundaryGuide}>
              {props.children}
            </BoundaryGuideContainer>
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
          <Divider size={40} />
          <StyledButton
            type="secondary"
            size="medium"
            variant="contained"
            onClick={() => window.open(RANGO_DOCS_URL, '_blank')}>
            Rango Widget Docs
          </StyledButton>
          <Divider size={10} />
          <StyledButton
            type="secondary"
            size="medium"
            variant="ghost"
            onClick={() => window.open(RANGO_WEBSITE_URL, '_blank')}
            css={{ border: '1px solid $secondary500' }}>
            Rango Website
          </StyledButton>
        </MobileContent>
      </MobileSection>
    </>
  );
}
