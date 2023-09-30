import type { PropsWithChildren } from 'react';

import React from 'react';

import { SideNavigation } from '../../components/SideNavigation';
import { globalStyles } from '../../globalStyles';

import { Header } from './ConfigContainer.Header';
import { Container, Content, LeftSide, Main } from './ConfigContainer.styles';

export function ConfigContainer(props: PropsWithChildren) {
  globalStyles();

  return (
    <Container>
      <LeftSide>
        <SideNavigation />
      </LeftSide>
      <Main>
        <Header />
        <Content>{props.children}</Content>
      </Main>
    </Container>
  );
}
