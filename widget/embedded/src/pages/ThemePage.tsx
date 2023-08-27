import { i18n } from '@lingui/core';
import {
  AutoThemeIcon,
  DarkModeIcon,
  LightModeIcon,
  List,
  Radio,
  RadioRoot,
  Typography,
} from '@rango-dev/ui';
import React from 'react';

import { Layout } from '../components/Layout';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useSettingsStore } from '../store/settings';

type Theme = 'dark' | 'light' | 'auto';

enum Mode {
  DARK = 'dark',
  LIGHT = 'light',
  AUTO = 'auto',
}

interface SettingItemPropsTypes {
  title: string;
}

function ThemeItemTitle({ title }: SettingItemPropsTypes) {
  return (
    <Typography variant="title" size="xmedium" color="neutral900">
      {i18n.t(title)}
    </Typography>
  );
}

export function ThemePage() {
  const { navigateBackFrom } = useNavigateBack();
  const theme = useSettingsStore.use.theme();
  const setTheme = useSettingsStore.use.setTheme();

  const themesList = [
    {
      id: Mode.LIGHT,
      value: Mode.LIGHT,
      title: <ThemeItemTitle title="Light" />,
      start: <LightModeIcon color="gray" />,
      end: <Radio value={Mode.LIGHT} />,
    },
    {
      id: Mode.DARK,
      value: Mode.DARK,
      title: <ThemeItemTitle title="Dark" />,
      start: <DarkModeIcon color="gray" />,
      end: <Radio value={Mode.DARK} />,
    },
    {
      id: Mode.AUTO,
      value: Mode.AUTO,
      title: <ThemeItemTitle title="Auto" />,
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
      <RadioRoot
        onValueChange={(value) => setTheme(value as Theme)}
        value={theme}>
        <List items={themesList} />
      </RadioRoot>
    </Layout>
  );
}
