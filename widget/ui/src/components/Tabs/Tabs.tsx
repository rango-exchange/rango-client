import type { TabsPropTypes } from './Tabs.types.js';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'src/icons/index.js';

import { Divider } from '../Divider/index.js';
import { Tooltip } from '../Tooltip/index.js';

import {
  ArrowLeft,
  ArrowRight,
  BackdropTab,
  Container,
  Tab,
  Tabs,
} from './Tabs.styles.js';

const INITIAL_RENDER_DELAY = 100;
export function TabsComponent(props: TabsPropTypes) {
  const {
    items: tabItems,
    onChange,
    container = document.body,
    value,
    type,
    className,
    scrollable,
    scrollButtons = true,
  } = props;
  const [tabWidth, setTabWidth] = useState(0);
  const tabRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftArrowRef = useRef<HTMLButtonElement | null>(null);
  const currentIndex = tabItems.findIndex((item) => item.id === value);
  // State variable to track the initial render
  const [initialRender, setInitialRender] = useState(true);
  const [transformPosition, setTransformPosition] = useState(0);
  const [leftArrowDisabled, setLeftArrowDisabled] = useState(true);
  const [rightArrowDisabled, setRightArrowDisabled] = useState(false);
  const [showArrows, setShowArrows] = useState(false);

  let borderRadius: TabsPropTypes['borderRadius'] = 'medium';
  if (type === 'bordered') {
    borderRadius = 'none';
  } else if (type && props.borderRadius) {
    borderRadius = props.borderRadius;
  }

  const handleScroll = (to: 'right' | 'left') => {
    if (!containerRef.current) {
      return;
    }
    const SCROLL_MULTIPLIER = 1.5;
    const scrollWidth =
      (containerRef.current.scrollWidth / tabItems.length) * SCROLL_MULTIPLIER;

    if (to === 'right') {
      containerRef.current.scrollLeft -= scrollWidth;
    } else {
      containerRef.current.scrollLeft += scrollWidth;
    }
  };

  const updateIndicator = (currentIndex: number) => {
    if (tabRef.current && containerRef.current) {
      const tabRect = tabRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      setTabWidth(tabRect.width);
      setTransformPosition(
        scrollable ? tabRef.current.offsetLeft : currentIndex * tabWidth
      );
      const itemPartiallyVisibleOnLeft = tabRect.left < containerRect.left;
      const itemPartiallyVisibleOnRight = tabRect.right > containerRect.right;

      if (itemPartiallyVisibleOnLeft) {
        containerRef.current.scrollLeft = tabRef.current.offsetLeft;
      } else if (itemPartiallyVisibleOnRight) {
        const containerComputedStyles = window.getComputedStyle(
          containerRef.current
        );
        containerRef.current.scrollLeft =
          containerRef.current.scrollLeft +
          tabRect.right -
          containerRect.right +
          parseFloat(containerComputedStyles.borderRightWidth);
      }
    }
  };

  useEffect(() => {
    // Set initialRender to false after a short delay
    const timeout = setTimeout(() => {
      setInitialRender(false);
      clearTimeout(timeout);
    }, INITIAL_RENDER_DELAY);
  }, []);

  useEffect(() => {
    updateIndicator(currentIndex);

    const updateArrowsVisibility = () => {
      if (scrollable && containerRef.current) {
        const startOfTheScroll = containerRef.current.scrollLeft === 0;
        const endOfTheScroll =
          containerRef.current.scrollLeft + containerRef.current.clientWidth ===
          containerRef.current.scrollWidth;

        if (startOfTheScroll) {
          setLeftArrowDisabled(true);
        } else {
          setLeftArrowDisabled(false);
        }
        if (endOfTheScroll) {
          setRightArrowDisabled(true);
        } else {
          setRightArrowDisabled(false);
        }
      }
    };

    const resizeHandler: ResizeObserverCallback = (event) => {
      if (scrollable && containerRef.current) {
        const TOTAL_WIDTH_OF_ARROWS = 64;
        updateIndicator(currentIndex);
        updateArrowsVisibility();
        const element = event[0].target;
        if (showArrows) {
          const tabsContainerOverflown =
            element.scrollWidth - TOTAL_WIDTH_OF_ARROWS > element.clientWidth;
          if (!tabsContainerOverflown) {
            setShowArrows(false);
          }
        } else if (element.scrollWidth > element.clientWidth) {
          setShowArrows(true);
        }
      }
    };

    containerRef.current?.addEventListener('scroll', updateArrowsVisibility);

    const resizeObserver = new ResizeObserver(resizeHandler);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
        containerRef.current.removeEventListener(
          'scroll',
          updateArrowsVisibility
        );
      }
    };
  }, [containerRef.current, showArrows, currentIndex]);

  return (
    <Container hasPadding={scrollButtons && showArrows}>
      {scrollable && showArrows && scrollButtons && (
        <>
          <ArrowLeft
            ref={leftArrowRef}
            hidden={leftArrowDisabled}
            onClick={() => handleScroll('right')}>
            <ChevronLeftIcon size={16} color="secondary" />
          </ArrowLeft>
          <ArrowRight
            hidden={rightArrowDisabled}
            onClick={() => handleScroll('left')}>
            <ChevronRightIcon size={16} color="secondary" />
          </ArrowRight>
        </>
      )}
      <Tabs
        ref={containerRef}
        className={`_tabs ${className || ''}`}
        type={type}
        borderRadius={borderRadius}
        scrollable={scrollable}>
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
              ref={index === currentIndex ? tabRef : null}
              type={type}
              fullWidth={scrollable ? false : true}
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
    </Container>
  );
}
