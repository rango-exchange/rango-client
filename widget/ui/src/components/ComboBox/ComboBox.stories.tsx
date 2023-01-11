//
import React from 'react';
import { ComponentMeta } from '@storybook/react';

import ComboBox, { PropTypes } from './ComboBox';

export default {
  title: 'Combobox',
  component: ComboBox,
} as ComponentMeta<typeof ComboBox>;

const options = [
  { value: 'one', label: 'one' },
  { value: 'two', label: 'two' },
  { value: 'three', label: 'three' },
  { value: 'four', label: 'four' },
  { value: 'five', label: 'five' },
  { value: 'six', label: 'six' },
  { value: 'seven', label: 'seven' },
  { value: 'eight', label: 'eight' },
  { value: 'nine', label: 'nine' },
  { value: 'ten', label: 'ten' },
];

export const Main = (arg: PropTypes) => (
  <ComboBox
    useVirualizedList
    options={options}
    multiple={true}
    onChange={() => {}}
    defaultValue={[{ value: 'one', label: 'one' }]}
  />
);
