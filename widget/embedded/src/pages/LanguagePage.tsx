import { i18n } from '@lingui/core';
import {
  List,
  ListItemButton,
  Radio,
  RadioRoot,
  Typography,
} from '@yeager-dev/ui';
import React from 'react';

import { Layout } from '../components/Layout';
import { SettingsContainer } from '../components/SettingsContainer';
import { useLanguage } from '../hooks/useLanguage';

export function LanguagePage() {
  const { activeLanguage, changeLanguage, languages } = useLanguage();

  const languageList = languages.map((languageItem) => {
    const { local, label, SVGFlag } = languageItem;
    return {
      id: local,
      value: local,
      title: (
        <Typography variant="title" size="xmedium">
          {label}
        </Typography>
      ),
      onClick: () => changeLanguage(languageItem.local),
      end: <Radio value={local} />,
      start: <SVGFlag />,
    };
  });

  return (
    <Layout
      header={{
        title: i18n.t('Language'),
      }}>
      <SettingsContainer>
        <RadioRoot value={activeLanguage}>
          <List
            type={
              <ListItemButton
                title={i18n.t('language')}
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
