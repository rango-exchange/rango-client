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

import { Layout } from '../components/Layout';
import { SettingsContainer } from '../components/SettingsContainer';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useSettingsStore } from '../store/settings';

type Theme = 'dark' | 'light' | 'auto';

enum Mode {
  DARK = 'dark',
  LIGHT = 'light',
  AUTO = 'auto',
}

export function ThemePage() {
  const { navigateBackFrom } = useNavigateBack();
  const theme = useSettingsStore.use.theme();
  const setTheme = useSettingsStore.use.setTheme();

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
        onBack: navigateBackFrom.bind(null, navigationRoutes.settings),
        title: i18n.t('Theme'),
      }}>
      <SettingsContainer>
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
      </SettingsContainer>
    </Layout>
  );
}
