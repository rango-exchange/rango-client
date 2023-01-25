import React from 'react';
import { ComponentMeta } from '@storybook/react';

import { SelectableWalletList, PropTypes } from './SelectableWalletList';
import { data } from './mock';

export default {
  title: 'Components/SelectableWalletList',
  component: SelectableWalletList,
} as ComponentMeta<typeof SelectableWalletList>;

export const Main = (props: PropTypes) => (
  <SelectableWalletList {...props} data={data} />
);
