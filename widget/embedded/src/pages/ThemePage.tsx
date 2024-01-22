import { i18n } from '@lingui/core';
import {
  AutoThemeIcon,
  DarkModeIcon,
  LightModeIcon,
  List,
  ListItemButton,
  Radio,
  RadioRoot,
  Typography,
} from '@rango-dev/ui';
import React from 'react';

import { Layout, PageContainer } from '../components/Layout';
import { useAppStore } from '../store/AppStore';

type Theme = 'dark' | 'light' | 'auto';

enum Mode {
  DARK = 'dark',
  LIGHT = 'light',
  AUTO = 'auto',
}

export function ThemePage() {
  const { setTheme, theme } = useAppStore();

  const themesList = [
    {
      id: Mode.LIGHT,
      value: Mode.LIGHT,
      title: (
        <Typography variant="title" size="xmedium">
          {i18n.t('Light')}
        </Typography>
      ),
      onClick: () => setTheme(Mode.LIGHT as Theme),
      start: <LightModeIcon color="gray" />,
      end: <Radio value={Mode.LIGHT} />,
    },
    {
      id: Mode.DARK,
      value: Mode.DARK,
      title: (
        <Typography variant="title" size="xmedium">
          {i18n.t('Dark')}
        </Typography>
      ),
      onClick: () => setTheme(Mode.DARK as Theme),
      start: <DarkModeIcon color="gray" />,
      end: <Radio value={Mode.DARK} />,
    },
    {
      id: Mode.AUTO,
      value: Mode.AUTO,
      title: (
        <Typography variant="title" size="xmedium">
          {i18n.t('Auto')}
        </Typography>
      ),
      onClick: () => setTheme(Mode.AUTO as Theme),
      start: <AutoThemeIcon color="gray" />,
      end: <Radio value={Mode.AUTO} />,
    },
  ];

  return (
    <Layout
      header={{
        title: i18n.t('Theme'),
      }}>
      <PageContainer>
        <RadioRoot
          onValueChange={(value) => setTheme(value as Theme)}
          value={theme}>
          <List
            type={
              <ListItemButton
                title={i18n.t('Theme')}
                id="_"
                onClick={() => console.log()}
              />
            }
            items={themesList}
          />
        </RadioRoot>
      </PageContainer>
    </Layout>
  );
}
