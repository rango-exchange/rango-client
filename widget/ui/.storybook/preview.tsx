import React from 'react';
import { DecoratorFn } from '@storybook/react';

import { lightTheme, darkTheme, styled } from '../src/theme';
import { globalCss } from '@stitches/react';

// https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters
export const parameters = {
  // https://storybook.js.org/docs/react/essentials/actions#automatically-matching-args
  actions: { argTypesRegex: '^on.*' },
};

const ThemeBlock = styled('div', {
  position: 'absolute',
  top: 0,
  height: '100vh',
  bottom: 0,
  overflow: 'auto',
  padding: '1rem',
  backgroundColor: '$background',
  variants: {
    position: {
      left: {
        left: 0,
        right: '50vw',
      },
      right: {
        left: '50vw',
        right: 0,
      },
      fill: {
        left: 0,
        width: '100vw',
      },
    },
  },
});

const globalStyles = globalCss({
  '*': {
    fontFamily: 'Roboto',
    boxSizing: 'border-box',
  },
});

export const withTheme: DecoratorFn = (StoryFn, context) => {
  globalStyles();
  const theme = context.parameters.theme || context.globals.theme;
  const storyTheme = theme === 'dark' ? darkTheme : lightTheme;
  switch (theme) {
    case 'side-by-side': {
      return (
        <>
          <ThemeBlock position="left" className={lightTheme}>
            <StoryFn />
          </ThemeBlock>
          <ThemeBlock position="right" className={darkTheme}>
            <StoryFn />
          </ThemeBlock>
        </>
      );
    }
    default: {
      return (
        <ThemeBlock position="fill" className={storyTheme}>
          <StoryFn />
        </ThemeBlock>
      );
    }
  }
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Theme for the components',
    defaultValue: 'light',
    toolbar: {
      icon: 'circlehollow',
      items: [
        { value: 'light', icon: 'circlehollow', title: 'light' },
        { value: 'dark', icon: 'circle', title: 'dark' },
        { value: 'side-by-side', icon: 'sidebar', title: 'side by side' },
      ],
      showName: true,
    },
  },
};

export const decorators = [withTheme];
