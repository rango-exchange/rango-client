import React, { PropsWithChildren, ReactNode } from 'react';
import { CheckCircleIcon, InfoCircleIcon, WarningIcon } from '../Icon';
import { Typography } from '../Typography';
import { styled } from '../../theme';
import { Divider } from '../Divider';

const MainContainer = styled('div', {
  width: '100%',
  padding: '$5',
  borderRadius: '$xs',
  backgroundColor: '$surface500',
  color: '$neutral800',

  '.main': {
    display: 'flex',
    alignItems: 'center',
    height: '$20',
    justifyContent: 'space-between',
  },
  '.title': {
    display: 'flex',
  },

  '.footer': {
    paddingTop: '$8',
  },
  '.description': {
    color: '$neutral600',
    fontSize: '$10',
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
  action?: ReactNode;
}

export function Alert(props: PropsWithChildren<PropTypes>) {
  const { type, children, title, action, footer } = props;

  const showIcon = (
    ['error', 'success', 'warning'] as PropTypes['type'][]
  ).includes(type);

  return (
    <MainContainer type={type} className={showIcon ? 'hasIcon' : ''}>
      <div className="main">
        <div className={'title'}>
          {showIcon && (
            <>
              <div
                style={{
                  width: '32px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {type === 'success' && (
                  <div
                    style={{
                      height: 20,
                      width: 20,
                      background: '#BDECD7',
                      borderRadius: 50,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <CheckCircleIcon color={type} size={16} />
                  </div>
                )}
                {type === 'warning' && (
                  <div
                    style={{
                      height: 20,
                      width: 20,
                      background: '#FFDFBB',
                      borderRadius: 50,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <WarningIcon color={type} size={16} />{' '}
                  </div>
                )}
                {type === 'error' && <InfoCircleIcon color={type} size={24} />}
                <Divider size={4} direction="horizontal" />
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
            }}>
            {title && (
              <>
                <Typography
                  className="title"
                  variant="body"
                  size="small"
                  color={type}>
                  {title}
                </Typography>
                {!!children && <Divider size={4} />}
              </>
            )}
            {children}
          </div>
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      {footer ? (
        <div
          className={`footer ${
            typeof footer === 'string' ? 'description' : ''
          }`}>
          {props.footer}
        </div>
      ) : null}
    </MainContainer>
  );
}
