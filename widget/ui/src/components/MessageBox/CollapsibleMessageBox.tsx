import type { PropTypes } from './CollapsibleMessageBox.types.js';
import type { PropsWithChildren } from 'react';

import * as Collapsible from '@radix-ui/react-collapsible';
import React, { useState } from 'react';

import { ChevronDownIcon, ChevronUpIcon } from '../../icons/index.js';
import { CollapsibleContent } from '../common/styles.js';
import { Divider } from '../Divider/index.js';

import { Trigger } from './CollapsibleMessageBox.styles.js';

import { MessageBox } from './index.js';

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
