import type { PropTypes } from './CustomCollapsible.types';
import type { PropsWithChildren } from 'react';

import React, { useRef } from 'react';

import {
  CollapsibleContent,
  CollapsibleRoot,
  Trigger,
} from './CustomCollapsible.styles';

export function CustomCollapsible(props: PropsWithChildren<PropTypes>) {
  const {
    open,
    hasSelected,
    onOpenChange,
    children,
    onClickTrigger,
    trigger,
    triggerAnchor,
  } = props;
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <CollapsibleRoot
      ref={ref}
      className="collapsible_root"
      selected={hasSelected && open}
      open={open}
      onOpenChange={onOpenChange}>
      {triggerAnchor === 'top' && (
        <Trigger className="collapsible_trigger" onClick={onClickTrigger}>
          {trigger}
        </Trigger>
      )}
      <CollapsibleContent className="collapsible_content" open={open}>
        {children}
      </CollapsibleContent>
      {triggerAnchor === 'bottom' && (
        <Trigger className="collapsible_trigger" onClick={onClickTrigger}>
          {trigger}
        </Trigger>
      )}
    </CollapsibleRoot>
  );
}
