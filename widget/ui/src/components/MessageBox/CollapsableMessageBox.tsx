import type { PropTypes } from './CollapsableMessageBox.types';
import type { PropsWithChildren } from 'react';

import * as Collapsible from '@radix-ui/react-collapsible';
import React, { useState } from 'react';

import { ChevronDownIcon, ChevronUpIcon } from '../../icons';
import { Divider } from '../Divider';
import { MessageBox } from '../MessageBox';

import { Content, Trigger } from './CollapsableMessageBox.styles';

export function CollapsableMessageBox(props: PropsWithChildren<PropTypes>) {
  const { description, status, title, children } = props;
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Trigger>
        <MessageBox title={title} description={description} type={status} />
        <Content open={open}>
          <Divider size={12} />

          {children}
        </Content>

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
