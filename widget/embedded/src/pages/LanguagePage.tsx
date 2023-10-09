import { i18n } from '@lingui/core';
import {
  List,
  ListItemButton,
  Radio,
  RadioRoot,
  Typography,
} from '@rango-dev/ui';
import React, { useState } from 'react';

import { Layout } from '../components/Layout';
import { SettingsContainer } from '../components/SettingsContainer';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';

enum Languages {
  ENGLISH = 'english',
  FRENCH = 'french',
  SPANISH = 'spanish',
}
export function LanguagePage() {
  const { navigateBackFrom } = useNavigateBack();
  const [language, setLanguage] = useState(Languages.ENGLISH);

  const languageList = [
    {
      id: Languages.ENGLISH,
      value: Languages.ENGLISH,
      title: (
        <Typography variant="title" size="xmedium">
          {i18n.t('English')}
        </Typography>
      ),
      onClick: () => setLanguage(Languages.ENGLISH),
      end: <Radio value={Languages.ENGLISH} />,
    },
    {
      id: Languages.FRENCH,
      value: Languages.FRENCH,
      title: (
        <Typography variant="title" size="xmedium">
          {i18n.t('French')}
        </Typography>
      ),
      onClick: () => setLanguage(Languages.FRENCH),
      end: <Radio value={Languages.FRENCH} />,
    },
    {
      id: Languages.SPANISH,
      value: Languages.SPANISH,
      title: (
        <Typography variant="title" size="xmedium">
          {i18n.t('Spanish')}
        </Typography>
      ),
      onClick: () => setLanguage(Languages.SPANISH),
      end: <Radio value={Languages.SPANISH} />,
    },
  ];

  return (
    <Layout
      header={{
        onBack: navigateBackFrom.bind(null, navigationRoutes.settings),
        title: i18n.t('Language'),
      }}>
      <SettingsContainer>
        <RadioRoot value={language}>
          <List
            type={
              <ListItemButton
                title="language"
                id="_"
                onClick={() => console.log()}
              />
            }
            items={languageList}
          />
        </RadioRoot>
      </SettingsContainer>
    </Layout>
  );
}
