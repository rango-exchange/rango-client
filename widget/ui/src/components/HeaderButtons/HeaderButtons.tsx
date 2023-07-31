import React from 'react';
import { i18n } from '@lingui/core';
import { SettingsIcon, Tooltip, Button, HistoryIcon, RetryIcon } from '..';
import { styled } from '../../theme';

const ButtonsContainer = styled('div', {
  display: 'flex',
});

interface PropTypes {
  onClickRefresh?: () => void;
  onClickHistory?: () => void;
  onClickSettings?: () => void;
}

export function HeaderButtons(props: PropTypes) {
  const { onClickRefresh, onClickHistory, onClickSettings } = props;

  return (
    <ButtonsContainer>
      <Tooltip content={i18n.t('Refresh')}>
        <Button
          variant="ghost"
          onClick={onClickRefresh}
          disabled={!onClickRefresh}>
          <RetryIcon size={24} disabled={!onClickRefresh} />
        </Button>
      </Tooltip>
      <Tooltip content={i18n.t('Transactions History')}>
        <Button variant="ghost" onClick={onClickHistory}>
          <HistoryIcon size={24} />
        </Button>
      </Tooltip>
      <Tooltip content={i18n.t('Settings')}>
        <Button variant="ghost" onClick={onClickSettings}>
          <SettingsIcon size={24} />
        </Button>
      </Tooltip>
    </ButtonsContainer>
  );
}
