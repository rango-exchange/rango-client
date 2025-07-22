import { i18n } from '@lingui/core';
import {
  Alert,
  Divider,
  List,
  ListItemButton,
  Radio,
  RadioRoot,
  Typography,
} from '@arlert-dev/ui';
import React from 'react';

import { Layout, PageContainer } from '../components/Layout';
import { useLanguage } from '../hooks/useLanguage';
import { useNavigateBack } from '../hooks/useNavigateBack';

export function LanguagePage() {
  const { activeLanguage, changeLanguage, languages } = useLanguage();
  const navigateBack = useNavigateBack();

  const languageList = languages.map((languageItem) => {
    const { local, label, SVGFlag } = languageItem;
    return {
      id: `widget-setting-languages-${local}-item-btn`,
      value: local,
      title: (
        <Typography variant="title" size="xmedium">
          {label}
        </Typography>
      ),
      onClick: () => {
        changeLanguage(languageItem.local);
        navigateBack();
      },
      end: <Radio value={local} />,
      start: <SVGFlag />,
    };
  });

  return (
    <Layout
      header={{
        title: i18n.t('Language'),
      }}>
      <PageContainer>
        <Alert
          type="warning"
          id="widget-language-machine-translation-alarm-alert"
          variant="alarm"
          title="Warning: We are using machine translation, so the translations may be inaccurate."
        />
        <Divider size={'8'} />
        <RadioRoot value={activeLanguage}>
          <List
            type={
              <ListItemButton
                title={i18n.t('language')}
                className="widget-language-list-item-btn"
                id="_"
                onClick={() => console.log()}
              />
            }
            items={languageList}
          />
        </RadioRoot>
      </PageContainer>
    </Layout>
  );
}
