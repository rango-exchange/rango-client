import React from 'react';
import { styled } from '../../theme';
import { AngleLeftIcon, CloseIcon, SearchIcon } from '../Icon';
import { TextField } from '../TextField/TextField';
import { Typography } from '../Typography';

export type PropTypes = {
  title?: string;
  onBack?: () => void;
  action?: React.ReactNode;
  onClose?: () => void;
  hasSearch: boolean;
  searchPlaceholder?: string;
  onSearchChange?: React.ChangeEventHandler<HTMLInputElement>;
  searchText?: string;
  hasHeaderTitle: boolean;
};

const HeaderContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
});
const SearchContainer = styled('div', {
  marginTop: '$16',
});
const BackIcon = styled(AngleLeftIcon, {
  cursor: 'pointer',
});
const Row = styled('div', {
  display: 'flex',
  alignItems: 'center',
});

export function Header(props: PropTypes) {
  const {
    title,
    hasSearch,
    onBack,
    action,
    hasHeaderTitle,
    onClose,
    searchPlaceholder,
    searchText,
    onSearchChange,
  } = props;
  return (
    <div>
      {hasHeaderTitle && (
        <HeaderContainer>
          {onBack && <BackIcon size={24} onClick={onBack} />}
          <Typography variant="h4">{title}</Typography>
          <Row>
            {action}
            {onClose && <CloseIcon size={24} onClick={onClose} />}
          </Row>
        </HeaderContainer>
      )}
      {hasSearch && (
        <SearchContainer>
          <TextField
            size="large"
            prefix={<SearchIcon size={24} />}
            placeholder={searchPlaceholder}
            onChange={onSearchChange}
            value={searchText}
            autoFocus
          />
        </SearchContainer>
      )}
    </div>
  );
}
