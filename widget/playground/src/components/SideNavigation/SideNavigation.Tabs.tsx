import type { TabPropTypes } from './SideNavigation.types';

import React, { useState } from 'react';

import { Indicator, Tab, TabsContainer } from './SideNavigation.styles';

const Tabs = (props: TabPropTypes) => {
  const { variant = 'vertical', tabs, defaultIndex } = props;
  const [activeTab, setActiveTab] = useState(defaultIndex);

  return (
    <TabsContainer>
      {variant === 'vertical' &&
        tabs.map((tab, index) => {
          const isActive = activeTab === index;
          const disabled = tab.disabled;
          return (
            <Tab
              key={tab.title}
              disabled={disabled}
              active={isActive}
              onClick={!disabled ? () => setActiveTab(index) : undefined}>
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
