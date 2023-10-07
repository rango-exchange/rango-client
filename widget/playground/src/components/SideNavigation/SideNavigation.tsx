import { InfoIcon, SettingsIcon, StyleIcon } from '@rango-dev/ui';
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { SearchParams, SIDE_TABS_IDS } from '../../constants';

import { IconLink } from './SideNavigation.Icon';
import { Container, StyledAnchor } from './SideNavigation.styles';
import Tabs from './SideNavigation.Tabs';

const SIDE_NAVIGATION_TABS = [
  {
    title: 'Functional Setting',
    id: SIDE_TABS_IDS.FUNCTIONAL,
    icon: <SettingsIcon color="secondary" />,
    disabled: true,
  },
  {
    title: 'Style',
    id: SIDE_TABS_IDS.STYLE,
    icon: <StyleIcon color="secondary" />,
  },
];

export function SideNavigation() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const activeLayoutParam = params.get(SearchParams.LAYOUT);
  const [activeLayout, setActiveLayout] = useState(
    activeLayoutParam || SIDE_TABS_IDS.STYLE
  );
  const handleTabChange = (id: string) => {
    setActiveLayout(id);
    params.set(SearchParams.LAYOUT, id);
    setSearchParams(params);
  };

  return (
    <Container>
      <Tabs
        variant="vertical"
        onChange={handleTabChange}
        activeLayout={activeLayout}
        tabs={SIDE_NAVIGATION_TABS.map((tab) => {
          return {
            disabled: tab.disabled,
            title: tab.title,
            id: tab.id,
            content: (
              <IconLink
                icon={tab.icon}
                label={tab.title}
                disabled={tab.disabled}
              />
            ),
          };
        })}
      />
      <StyledAnchor
        href="https://docs.rango.exchange/widget-integration/"
        target="_blank">
        <IconLink icon={<InfoIcon color="secondary" />} label="Help" />
      </StyledAnchor>
    </Container>
  );
}
