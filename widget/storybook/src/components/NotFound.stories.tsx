import type { NotFoundPropTypes } from '@rango-dev/ui';
import type { Meta } from '@storybook/react';

import { NotFound } from '@rango-dev/ui';
import React from 'react';

export default {
  title: 'Components/NotFound',
  component: NotFound,
  args: {
    title: 'Not Found!',
    description: 'Try using different keywords',
  },
} as Meta<typeof NotFound>;

export const Main = (args: NotFoundPropTypes) => <NotFound {...args} />;
