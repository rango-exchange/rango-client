import type { PropTypes } from './SideNavigation.types';

import { InfoIcon, SettingsIcon, StyleIcon } from '@rango-dev/ui';
import React from 'react';

import { SIDE_TABS_IDS } from '../../constants';

import { IconLink } from './SideNavigation.Icon';
import { Container, StyledAnchor } from './SideNavigation.styles';
import Tabs from './SideNavigation.Tabs';

const SIDE_NAVIGATION_TABS = [
  {
    title: 'Functional Setting',
    id: SIDE_TABS_IDS.FUNCTIONAL,
    icon: <SettingsIcon color="secondary" size={24} />,
  },
  {
    title: 'Style',
    id: SIDE_TABS_IDS.STYLE,
    icon: <StyleIcon color="secondary" size={24} />,
  },
];

export function SideNavigation(props: PropTypes) {
  const { onChange, activeLayout } = props;

  return (
    <Container>
      <Tabs
        variant="vertical"
        onChange={onChange}
        activeLayout={activeLayout}
        tabs={SIDE_NAVIGATION_TABS.map((tab) => {
          return {
            title: tab.title,
            id: tab.id,
            content: <IconLink icon={tab.icon} label={tab.title} />,
          };
        })}
      />
      <StyledAnchor
        href="https://docs.rango.exchange/widget-integration/"
        target="_blank">
        <IconLink
          icon={<InfoIcon color="secondary" size={24} />}
          label="Help"
        />
      </StyledAnchor>
    </Container>
  );
}
