import React from 'react';
import { CheckCircleIcon, InfoCircleIcon, WarningIcon } from '../Icon';
import { Typography } from '../Typography';
import { styled } from '../../theme';

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
        backgroundColor: '$warning300',
      },
      error: {
        backgroundColor: '$error300',
      },
    },
  },
});

const ContentContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});

const TitleContainer = styled('div', {
  marginBottom: '$8',
});

const IconContainer = styled('div', {
  marginRight: '$24',
});

export interface PropTypes {
  type: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  description: string;
  title?: string;
}

export function Alert(props: PropTypes) {
  const { type, description, title } = props;

  const showIcon = (
    ['error', 'success', 'warning'] as PropTypes['type'][]
  ).includes(type);

  return (
    <MainContainer type={type}>
      {showIcon && (
        <IconContainer>
          {type === 'success' && <CheckCircleIcon color="success" size={28} />}
          {type === 'warning' && <WarningIcon size={28} />}
          {type === 'error' && <InfoCircleIcon color="error" size={28} />}
        </IconContainer>
      )}
      <ContentContainer>
        {title && (
          <TitleContainer>
            <Typography variant="h6">{title}</Typography>
          </TitleContainer>
        )}
        <Typography variant="body2">{description}</Typography>
      </ContentContainer>
    </MainContainer>
  );
}
