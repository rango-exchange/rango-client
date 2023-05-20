import React, { PropsWithChildren, ReactNode } from 'react';
import { CheckCircleIcon, InfoCircleIcon, WarningIcon } from '../Icon';
import { Typography } from '../Typography';
import { styled } from '../../theme';
import { Divider } from '../Divider';

const MainContainer = styled('div', {
  width: '100%',
  padding: '$16',
  borderRadius: '$5',
  backgroundColor: '$neutral100',
  color: '$neutral800',

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
        color: '$foreground',
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
            <div
              style={{
                width: '32px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {type === 'success' && <CheckCircleIcon color={type} size={24} />}
              {type === 'warning' && <WarningIcon color={type} size={24} />}
              {type === 'error' && <InfoCircleIcon color={type} size={24} />}
              <Divider size={4} direction='horizontal' />
            </div>
          </>
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'start',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          {title && (
            <>
              <Typography className="title" variant="title" color={type}>
                {title}
              </Typography>
              {!!children && <Divider size={4} />}
            </>
          )}
          {children}
        </div>
      </div>
      {props.footer ? <div className="footer">{props.footer}</div> : null}
    </MainContainer>
  );
}
