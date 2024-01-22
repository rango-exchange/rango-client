import type { TabPropTypes } from './SideNavigation.types';
import type { SIDE_TABS_IDS } from '../../constants';

import React, { useState } from 'react';

import { Indicator, Tab, TabsContainer } from './SideNavigation.styles';

const TAB_HEIGHT = 95;
const Tabs = (props: TabPropTypes) => {
  const { variant = 'vertical', tabs, onChange, activeLayout } = props;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleTabClick = (tabId: SIDE_TABS_IDS, index: number) => {
    onChange(tabId);
    setActiveIndex(index);
  };

  return (
    <TabsContainer>
      {variant === 'vertical' &&
        tabs.map((tab, index) => {
          const isActive = activeLayout === tab.id;
          const disabled = tab.disabled;
          return (
            <Tab
              key={tab.title}
              disabled={disabled}
              onClick={
                !disabled && !isActive
                  ? () => handleTabClick(tab.id, index)
                  : undefined
              }>
              {tab.content}
            </Tab>
          );
        })}
      <Indicator
        css={{
          transform: `translateY(${activeIndex * TAB_HEIGHT}px)`,
        }}
      />
    </TabsContainer>
    // TODO: check horizontal tab
  );
};

export default Tabs;
