import type { TabsPropTypes } from './Tabs.types.js';

import React, { useEffect, useRef, useState } from 'react';

import { Divider } from '../Divider/index.js';
import { Tooltip } from '../Tooltip/index.js';

import { BackdropTab, Tab, Tabs } from './Tabs.styles.js';

const INITIAL_RENDER_DELAY = 100;
export function TabsComponent(props: TabsPropTypes) {
  const {
    items: tabItems,
    onChange,
    container = document.body,
    value,
    type,
    borderRadius = 'medium',
    className,
  } = props;
  const [tabWidth, setTabWidth] = useState(0);
  const tabRef: React.Ref<HTMLButtonElement> = useRef(null);
  const currentIndex = tabItems.findIndex((item) => item.id === value);

  // State variable to track the initial render
  const [initialRender, setInitialRender] = useState(true);
  const transformPosition = currentIndex * tabWidth;

  useEffect(() => {
    const updateTabWidth = () => {
      if (tabRef.current) {
        const tabRect = tabRef.current.getBoundingClientRect();
        setTabWidth(tabRect.width);
      }
    };
    updateTabWidth();
    window.addEventListener('resize', updateTabWidth);
    return () => {
      window.removeEventListener('resize', updateTabWidth);
    };
  }, []);

  useEffect(() => {
    // Set initialRender to false after a short delay
    const timeout = setTimeout(() => {
      setInitialRender(false);
      clearTimeout(timeout);
    }, INITIAL_RENDER_DELAY);
  }, []);

  return (
    <Tabs
      className={`_tabs ${className || ''}`}
      type={type}
      borderRadius={borderRadius}>
      {tabItems.map((item, index) => (
        <Tooltip
          key={item.id}
          styles={{ root: { width: '100%' } }}
          container={container}
          side="bottom"
          sideOffset={2}
          content={item.tooltip}
          open={!item.tooltip ? false : undefined}>
          <Tab
            className="_tab"
            ref={index === 0 ? tabRef : null} // Set ref on the first tab
            type={type}
            fullWidth
            disableRipple={true}
            borderRadius={borderRadius}
            onClick={() => onChange(item)}
            size="small"
            isActive={item.id === value}
            variant="default">
            {item.icon}
            {!!item.icon && !!item.title && (
              <Divider direction="horizontal" size="2" />
            )}
            {item.title}
          </Tab>
        </Tooltip>
      ))}
      <BackdropTab
        type={type}
        borderRadius={borderRadius}
        className={`_backdrop-tab ${initialRender ? 'no-transition' : ''}`}
        css={{
          width: tabWidth,
          transform: `translateX(${transformPosition}px)`,
        }}
      />
    </Tabs>
  );
}
