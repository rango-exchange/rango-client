import type { PropTypes } from './ExpandedQuotes.types';

import { i18n } from '@lingui/core';
import { Header } from '@arlert-dev/ui';
import React, { useEffect, useState } from 'react';

import { HeaderButtons } from '../../components/HeaderButtons';
import { LayoutContainer } from '../../components/Layout/Layout.styles';
import { Quotes } from '../../components/Quotes';
import { SelectStrategy } from '../../components/Quotes/SelectStrategy';
import { WIDGET_UI_ID } from '../../constants';
import { useAppStore } from '../../store/AppStore';
import { getExpanded } from '../../utils/common';

import { Container, Content } from './ExpandedQuotes.styles';

export const TIME_TO_CLOSE_OPEN_EXPANDED = 100;

export function ExpandedQuotes(props: PropTypes) {
  const { fetch, loading, onClickOnQuote, onClickRefresh, isVisible } = props;
  const [isDelayedVisible, setIsDelayedVisible] = useState(false);
  const containerClass = isDelayedVisible ? '' : 'is-hidden';
  const { config } = useAppStore();
  const fullExpandedMode = config?.variant === 'full-expanded';
  const container = getExpanded();
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    if (isVisible) {
      timeout = setTimeout(() => {
        setIsDelayedVisible(true);
      }, TIME_TO_CLOSE_OPEN_EXPANDED);
    } else {
      setIsDelayedVisible(false);
      if (timeout) {
        clearTimeout(timeout);
      }
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isVisible]);

  return (
    <Container
      expandMode={config?.variant === 'full-expanded' ? 'full' : 'default'}
      className={`${containerClass} ${LayoutContainer()} widget-expanded-quotes-container`}
      id={WIDGET_UI_ID.EXPANDED_BOX_ID}>
      <Header
        title={i18n.t('Routes')}
        suffix={
          <>
            <SelectStrategy container={container} />
            <HeaderButtons
              container={container}
              onClickRefresh={onClickRefresh}
              hidden={['history', 'notifications', 'settings']}
            />
          </>
        }
      />
      <Content>
        <Quotes
          showModalFee={true}
          fetch={fetch}
          hasSort={false}
          loading={loading}
          container={getExpanded()}
          onClickOnQuote={onClickOnQuote}
          fullExpandedMode={fullExpandedMode}
        />
      </Content>
    </Container>
  );
}
