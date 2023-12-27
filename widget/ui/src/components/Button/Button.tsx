import type { PropTypes, Ref } from './Button.types';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { Spinner } from '../Spinner';

import { ButtonBase, Content } from './Button.styles';
import Ripple from './Ripple';

function ButtonComponent(props: PropsWithChildren<PropTypes>, ref?: Ref) {
  const {
    children,
    loading,
    disabled,
    prefix,
    suffix,
    onClick,
    disableRipple,
    ...otherProps
  } = props;

  const shouldShowRipple = !disabled && !loading && !disableRipple;

  return (
    <ButtonBase
      disabled={!loading && disabled}
      onClick={loading || disabled ? undefined : onClick}
      {...otherProps}
      ref={ref}>
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
      {shouldShowRipple && <Ripple />}
    </ButtonBase>
  );
}

const Button = React.forwardRef(ButtonComponent);
Button.displayName = 'Button';

export { Button };
