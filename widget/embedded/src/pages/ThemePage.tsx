import { i18n } from '@lingui/core';
import { RadioGroup, styled } from '@rango-dev/ui';
import React from 'react';

import { Layout } from '../components/Layout';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useSettingsStore } from '../store/settings';

const ThemesContainer = styled('div', {
  padding: '$16',
});

type Theme = 'dark' | 'light' | 'auto';

export function ThemePage() {
  const { navigateBackFrom } = useNavigateBack();
  const theme = useSettingsStore.use.theme();
  const setTheme = useSettingsStore.use.setTheme();

  return (
    <Layout
      header={{
        onBack: navigateBackFrom.bind(null, navigationRoutes.settings),
        title: i18n.t('Theme'),
      }}>
      <ThemesContainer>
        <RadioGroup
          value={theme}
          options={[
            { value: 'dark', label: `${i18n.t('Dark')}` },
            { value: 'light', label: `${i18n.t('Light')}` },
            { value: 'auto', label: `${i18n.t('Auto')}` },
          ]}
          onChange={(value) => setTheme(value as Theme)}
          direction="horizontal"
          style={{ marginTop: '$24' }}
        />
      </ThemesContainer>
    </Layout>
  );
}
