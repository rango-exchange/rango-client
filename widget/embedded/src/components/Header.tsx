import React from 'react';
import { css, styled, Typography } from '@rango-dev/ui';
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
  titleSize?: number;
  titleWeight?: number;
}

export function Header(props: PropTypes) {
  const { onClickRefresh, title, titleSize, titleWeight } = props;
  const { t } = useTranslation();
  const titleStyle = css({
    fontSize: `${titleSize}px !important`,
    fontWeight: `${titleWeight} !important`,
  });

  return (
    <HeaderContainer>
      <Typography variant="h4" className={titleStyle()}>
        {t(title.toLocaleLowerCase()) || title}
      </Typography>
      <HeaderButtons onClickRefresh={onClickRefresh} />
    </HeaderContainer>
  );
}
