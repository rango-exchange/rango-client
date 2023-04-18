import React from 'react';
import {
  SettingsIcon,
  Tooltip,
  styled,
  Button,
  HistoryIcon,
  RetryIcon,
} from '@rango-dev/ui';
import { useNavigate } from 'react-router-dom';
import { navigationRoutes } from '../constants/navigationRoutes';

const ButtonsContainer = styled('div', {
  display: 'flex',
});

interface PropTypes {
  onClickRefresh?: () => void;
}

export function HeaderButtons(props: PropTypes) {
  const { onClickRefresh } = props;
  const navigate = useNavigate();

  return (
    <ButtonsContainer>
      <Tooltip content="Refresh">
        <Button
          variant="ghost"
          onClick={onClickRefresh}
          disabled={!onClickRefresh}
        >
          <RetryIcon size={24} disabled={!onClickRefresh} />
        </Button>
      </Tooltip>
      <Tooltip content="Transactions History">
        <Button
          variant="ghost"
          onClick={() => navigate(navigationRoutes.swaps)}
        >
          <HistoryIcon size={24} />
        </Button>
      </Tooltip>
      <Tooltip content="Settings">
        <Button
          variant="ghost"
          onClick={() => navigate(navigationRoutes.settings)}
        >
          <SettingsIcon size={24} />
        </Button>
      </Tooltip>
    </ButtonsContainer>
  );
}
