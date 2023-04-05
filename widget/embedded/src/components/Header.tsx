import React from 'react';
import { styled, Typography } from '@rango-dev/ui';
import { HeaderButtons } from './HeaderButtons';
import { useTranslation } from 'react-i18next';

export const HeaderContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  padding: '$16 0',
});

export interface PropTypes {
  onClickRefresh: () => void;
  title?: string;
}

export function Header(props: PropTypes) {
  const { onClickRefresh, title } = props;
  const { t } = useTranslation();
  return (
    <HeaderContainer>
      <Typography variant="h4">{t(title.toLocaleLowerCase()) || title}</Typography>
      <HeaderButtons onClickRefresh={onClickRefresh} />
    </HeaderContainer>
  );
}
