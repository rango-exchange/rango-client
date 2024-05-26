import { I18nManager } from '@rango-dev/ui';
import React from 'react';

import { useBootstrap } from '../../hooks/useBootstrap';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/AppStore';

import { MainContainer } from './App.styles';

export function Main() {
  useBootstrap();
  const { config } = useAppStore();
  const { activeTheme } = useTheme(config?.theme || {});
  const { activeLanguage } = useLanguage();

  return (
    <I18nManager language={activeLanguage}>
      <MainContainer id="swap-container" className={activeTheme()}>
        <div>this is a test</div>
      </MainContainer>
    </I18nManager>
  );
}
