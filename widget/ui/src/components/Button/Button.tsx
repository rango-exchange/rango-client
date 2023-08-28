import type { PropTypes } from './Button.types';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { Spinner } from '../Spinner';

import { ButtonBase, Content } from './Button.styles';

export function Button(props: PropsWithChildren<PropTypes>) {
  const { children, loading, disabled, prefix, suffix, ...otherProps } = props;

  return (
    <ButtonBase disabled={disabled} {...otherProps}>
      {loading ? (
        <Spinner />
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
    </ButtonBase>
  );
}
