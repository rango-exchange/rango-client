import type { ButtonPropTypes, Ref } from './Button.types.js';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { Spinner } from '../Spinner/Spinner.js';

import { ButtonBase, Content } from './Button.styles.js';
import Ripple from './Ripple.js';

function ButtonComponent(props: PropsWithChildren<ButtonPropTypes>, ref?: Ref) {
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
