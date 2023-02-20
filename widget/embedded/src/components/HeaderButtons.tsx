import React from 'react';
import { SettingsIcon, Tooltip, styled, Button, HistoryIcon, RetryIcon } from '@rangodev/ui';
import { useNavigate } from 'react-router-dom';
import { navigationRoutes } from '../constants/navigationRoutes';
import { PropTypes } from './Header';

const ButtonsContainer = styled('div', {
  display: 'flex',
});

export function HeaderButtons(props: PropTypes) {
  const { onClickRefresh } = props;
  const navigate = useNavigate();

  return (
    <ButtonsContainer>
      <Tooltip content="Retry">
        <Button variant="ghost" onClick={onClickRefresh.bind(null)}>
          <RetryIcon size={28} />
        </Button>
      </Tooltip>
      <Tooltip content="Transactions History">
        <Button variant="ghost" onClick={() => navigate(navigationRoutes.history)}>
          <HistoryIcon size={24} />
        </Button>
      </Tooltip>
      <Tooltip content="Settings">
        <Button variant="ghost" onClick={() => navigate(navigationRoutes.settings)}>
          <SettingsIcon size={24} />
        </Button>
      </Tooltip>
    </ButtonsContainer>
  );
}
