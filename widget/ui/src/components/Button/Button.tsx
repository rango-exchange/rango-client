import type { PropTypes } from './Button.types';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { Spinner } from '../Spinner';

import { ButtonBase, Content } from './Button.styles';
import Ripple from './Ripple';

export function Button(props: PropsWithChildren<PropTypes>) {
  const {
    children,
    loading,
    disabled,
    prefix,
    suffix,
    onClick,
    ...otherProps
  } = props;

  return (
    <ButtonBase
      disabled={!loading && disabled}
      onClick={loading || disabled ? undefined : onClick}
      {...otherProps}>
      {loading ? (
        <Spinner css={{ width: '$24', height: '$24' }} />
      ) : (
        <>
          {prefix}
          {children && (
            <Content pl={!!prefix} pr={!!suffix} className="_text">
              {children}
            </Content>
          )}
          {suffix}
        </>
      )}
      {!disabled && !loading && <Ripple />}
    </ButtonBase>
  );
}
