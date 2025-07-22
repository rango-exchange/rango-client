import type { SelectableCategoryListPropTypes } from '@arlert-dev/ui';
import type { Meta } from '@storybook/react';

import { SelectableCategoryList } from '@arlert-dev/ui';
import React, { useState } from 'react';

import { blockchains } from './mock';

export default {
  title: 'Components/SelectableCategoryList',
  component: SelectableCategoryList,
  args: {
    blockchains,
    isLoading: false,
  },
  argTypes: {
    category: {
      type: 'string',
      control: { type: 'text' },
    },
    setCategory: {
      type: 'function',
    },
  },
} as Meta<typeof SelectableCategoryList>;

export const Main = (args: SelectableCategoryListPropTypes) => {
  const [category, setCategory] = useState<string>('');
  return (
    <SelectableCategoryList
      {...args}
      setCategory={setCategory}
      category={category}
    />
  );
};
