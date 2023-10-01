import { InfoIcon, SettingsIcon, StyleIcon } from '@rango-dev/ui';
import React from 'react';

import { IconLink } from './SideNavigation.Icon';
import { Container } from './SideNavigation.styles';
import Tabs from './SideNavigation.Tabs';

const tabs = [
  {
    title: 'Functional Setting',
    icon: <SettingsIcon color="secondary" />,
    disabled: true,
  },
  {
    title: 'Style',
    icon: <StyleIcon color="secondary" />,
  },
];

export function SideNavigation() {
  return (
    <Container>
      <Tabs
        variant="vertical"
        defaultIndex={1}
        tabs={tabs.map((tab) => {
          return {
            disabled: tab.disabled,
            title: tab.title,
            content: <IconLink icon={tab.icon} label={tab.title} />,
          };
        })}
      />
      <IconLink icon={<InfoIcon color="secondary" />} label="Help" />
    </Container>
  );
}
