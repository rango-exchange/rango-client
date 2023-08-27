import { i18n } from '@lingui/core';
import { List, Radio, RadioRoot, Typography } from '@rango-dev/ui';
import React from 'react';

import { Layout } from '../components/Layout';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';

enum Languages {
  ENGLISH = 'english',
  FRENCH = 'french',
  SPANISH = 'spanish',
}

interface SettingItemPropsTypes {
  title: string;
}

function LanguageItemTitle({ title }: SettingItemPropsTypes) {
  return (
    <Typography variant="title" size="xmedium" color="neutral900">
      {i18n.t(title)}
    </Typography>
  );
}

export function LanguagePage() {
  const { navigateBackFrom } = useNavigateBack();

  const languageList = [
    {
      id: Languages.ENGLISH,
      value: Languages.ENGLISH,
      title: <LanguageItemTitle title="English" />,
      end: <Radio value={Languages.ENGLISH} />,
    },
    {
      id: Languages.FRENCH,
      value: Languages.FRENCH,
      title: <LanguageItemTitle title="French" />,
      end: <Radio value={Languages.FRENCH} />,
    },
    {
      id: Languages.SPANISH,
      value: Languages.SPANISH,
      title: <LanguageItemTitle title="Spanish" />,
      end: <Radio value={Languages.SPANISH} />,
    },
  ];

  return (
    <Layout
      header={{
        onBack: navigateBackFrom.bind(null, navigationRoutes.settings),
        title: i18n.t('Language'),
      }}>
      <RadioRoot value={Languages.ENGLISH}>
        <List items={languageList} />
      </RadioRoot>
    </Layout>
  );
}
