import type { PropTypes } from './SelectableWalletList';
import type { Meta } from '@storybook/react';

import React from 'react';

import { data } from './mock';
import { SelectableWalletList } from './SelectableWalletList';

export default {
  title: 'Components/SelectableWalletList(Deprecated)',
  component: SelectableWalletList,
} as Meta<typeof SelectableWalletList>;

export const Main = (props: PropTypes) => (
  <SelectableWalletList {...props} list={data} />
);
