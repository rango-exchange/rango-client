import { i18n } from '@lingui/core';
import { Alert, Button, styled } from '@arlert-dev/ui';
import React from 'react';
import { useInRouterContext, useSearchParams } from 'react-router-dom';

import { Layout, PageContainer } from '../components/Layout';
import { Slippage } from '../components/Slippage';
import { SearchParams } from '../constants/searchParams';
import { SettingsLists } from '../containers/Settings/Lists';
import { useAppStore } from '../store/AppStore';

const ResetAction = styled('div', {
  paddingLeft: '$8',
});

export function SettingsPage() {
  const { isInCampaignMode, updateCampaignMode } = useAppStore();
  const campaignMode = isInCampaignMode();

  const [, setSearchParams] = useSearchParams();
  const isRouterInContext = useInRouterContext();

  const onClick = () => {
    if (isRouterInContext && campaignMode) {
      setSearchParams(
        (prev) => {
          prev.delete(SearchParams.LIQUIDITY_SOURCES);
          return prev;
        },
        { replace: true }
      );
      updateCampaignMode('liquiditySources', undefined);
    }
  };
  return (
    <Layout
      header={{
        title: i18n.t('Settings'),
      }}>
      <PageContainer>
        {campaignMode && (
          <Alert
            type="info"
            variant="alarm"
            id="widget-settings-campaign-mode-alert"
            title={i18n.t(
              "Currently, you're in campaign mode with restrictions on liquidity sources. Would you like to switch out of this mode and make use of all available liquidity sources?"
            )}
            action={
              <ResetAction>
                <Button
                  id="widget-setting-exit-campaign-mode-btn"
                  type="secondary"
                  size="small"
                  onClick={onClick}>
                  {i18n.t('Reset')}
                </Button>
              </ResetAction>
            }
          />
        )}
        <Slippage />
        <SettingsLists />
      </PageContainer>
    </Layout>
  );
}
