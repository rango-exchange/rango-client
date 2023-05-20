import React from 'react';
import { Meta } from '@storybook/react';

import { SelectableWalletList, PropTypes } from './SelectableWalletList';
import { data } from './mock';

export default {
  title: 'Components/SelectableWalletList',
  component: SelectableWalletList,
} as Meta<typeof SelectableWalletList>;

export const Main = (props: PropTypes) => (
  <SelectableWalletList {...props} list={data} />
);
