import type { TabPropTypes } from './SideNavigation.types';

import React from 'react';

import { Indicator, Tab, TabsContainer } from './SideNavigation.styles';

const Tabs = (props: TabPropTypes) => {
  const { variant = 'vertical', tabs, onChange, activeLayout } = props;

  return (
    <TabsContainer>
      {variant === 'vertical' &&
        tabs.map((tab) => {
          const isActive = activeLayout === tab.id;
          const disabled = tab.disabled;
          return (
            <Tab
              key={tab.title}
              disabled={disabled}
              active={isActive}
              onClick={!disabled ? () => onChange(tab.id) : undefined}>
              {tab.content}
              {isActive && <Indicator />}
            </Tab>
          );
        })}
    </TabsContainer>
    // TODO: check horizontal tab
  );
};

export default Tabs;
