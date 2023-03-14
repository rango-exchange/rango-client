import React, { PropsWithChildren } from 'react';
import { CheckCircleIcon, InfoCircleIcon, WarningIcon } from '../Icon';
import { Typography } from '../Typography';
import { darkTheme, styled } from '../../theme';

const MainContainer = styled('div', {
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  padding: '$16',
  borderRadius: '$5',
  variants: {
    type: {
      primary: {
        backgroundColor: '$primary200',
      },
      secondary: {
        backgroundColor: '$neutrals400',
      },
      success: {
        backgroundColor: '$success300',
      },
      warning: {
        backgroundColor: '$warning500',
      },
      error: {
        backgroundColor: '$error300',
      },
    },
  },
});

const ContentContainer = styled('div', {});

const TitleContainer = styled('div', {
  marginBottom: '$8',
});

const IconContainer = styled('div', {
  marginRight: '$24',
});

const StyledTypography = styled(Typography, {
  color: darkTheme.colors.foreground.value,
});

export interface PropTypes {
  type: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  title?: string;
}

export function Alert(props: PropsWithChildren<PropTypes>) {
  const { type, children, title } = props;

  const showIcon = (
    ['error', 'success', 'warning'] as PropTypes['type'][]
  ).includes(type);

  return (
    <MainContainer type={type}>
      {showIcon && (
        <IconContainer>
          {type === 'success' && <CheckCircleIcon color="success" size={28} />}
          {type === 'warning' && <WarningIcon color="white" size={28} />}
          {type === 'error' && <InfoCircleIcon color="error" size={28} />}
        </IconContainer>
      )}
      <ContentContainer>
        {title && (
          <TitleContainer>
            <StyledTypography variant="h6">{title}</StyledTypography>
          </TitleContainer>
        )}
        {children}
      </ContentContainer>
    </MainContainer>
  );
}
