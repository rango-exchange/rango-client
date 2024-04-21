import type { PropTypes } from './SelectableCategoryList.types';
import type { Meta } from '@storybook/react';

import React, { useState } from 'react';

import { blockchains } from './mock';
import { SelectableCategoryList } from './SelectableCategoryList';

export default {
  title: 'Components/SelectableCategoryList',
  component: SelectableCategoryList,
  args: {
    blockchains,
    isLoading: false,
  },
} as Meta<typeof SelectableCategoryList>;

export const Main = (args: PropTypes) => {
  const [category, setCategory] = useState<string>('');
  return (
    <SelectableCategoryList
      {...args}
      setCategory={setCategory}
      category={category}
    />
  );
};
