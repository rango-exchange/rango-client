import React, { PropsWithChildren, ReactNode } from 'react';
import { CheckCircleIcon, InfoCircleIcon, WarningIcon } from '../Icon';
import { Typography } from '../Typography';
import { styled } from '../../theme';
import { Spacer } from '../Spacer';

const MainContainer = styled('div', {
  width: '100%',
  padding: '$16',
  borderRadius: '$5',
  backgroundColor: '$neutrals300',
  color: '$neutrals800',

  '.main': {
    display: 'flex',
    alignItems: 'center',
  },

  '.footer': {
    paddingTop: '$8',
  },
  '&.hasIcon .footer': {
    paddingLeft: '$32',
  },

  variants: {
    type: {
      primary: {
        color: '$primary200',
      },
      secondary: {
        color: '$secondary',
      },
      success: {
        color: '$success300',
      },
      warning: {
        color: '$warning500',
      },
      error: {
        color: '$error300',
      },
    },
  },
});

export interface PropTypes {
  type?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  title?: string;
  footer?: ReactNode;
}

export function Alert(props: PropsWithChildren<PropTypes>) {
  const { type, children, title } = props;

  const showIcon = (
    ['error', 'success', 'warning'] as PropTypes['type'][]
  ).includes(type);

  return (
    <MainContainer type={type} className={showIcon ? 'hasIcon' : ''}>
      <div className="main">
        {showIcon && (
          <>
            {type === 'success' && <CheckCircleIcon color={type} size={24} />}
            {type === 'warning' && <WarningIcon color={type} size={24} />}
            {type === 'error' && <InfoCircleIcon color={type} size={24} />}
            <Spacer size={8} />
          </>
        )}
        {title && (
          <Typography variant="h6" color={type}>
            {title}
          </Typography>
        )}
        {children}
      </div>
      {props.footer ? <div className="footer">{props.footer}</div> : null}
    </MainContainer>
  );
}
