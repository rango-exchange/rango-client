import type { PropTypes } from './CollapsibleMessageBox.types';
import type { PropsWithChildren } from 'react';

import * as Collapsible from '@radix-ui/react-collapsible';
import React, { useState } from 'react';

import { ChevronDownIcon, ChevronUpIcon } from '../../icons';
import { CollapsibleContent } from '../common/styles';
import { Divider } from '../Divider';

import { Trigger } from './CollapsibleMessageBox.styles';

import { MessageBox } from '.';

export function CollapsibleMessageBox(props: PropsWithChildren<PropTypes>) {
  const { description, status, title, children } = props;
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Trigger>
        <MessageBox title={title} description={description} type={status} />
        <CollapsibleContent open={open}>
          <Divider size={12} />

          {children}
        </CollapsibleContent>

        <Divider size={12} />
        {open ? (
          <ChevronUpIcon color={'black'} size={16} />
        ) : (
          <ChevronDownIcon color={'black'} size={16} />
        )}
      </Trigger>
    </Collapsible.Root>
  );
}
