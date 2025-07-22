import type { ButtonPropTypes } from '@arlert-dev/ui';
import type { Meta } from '@storybook/react';

import { Button, Divider, styled, WalletIcon } from '@arlert-dev/ui';
import React from 'react';

const meta: Meta<typeof Button> = {
  component: Button,
  args: {
    prefix: <></>,
    suffix: <></>,
  },
  argTypes: {
    size: {
      options: ['medium', 'small', 'xxsmall', 'xsmall', 'large'],
      control: { type: 'select' },
      description: 'medium | small | xxsmall | xsmall | large | undefined',
      type: 'string',
    },
    variant: {
      name: 'variant',
      options: ['contained', 'outlined', 'ghost', 'default'],
      control: { type: 'select' },
      description: 'contained | outlined | ghost | default | undefined',
      type: 'string',
    },
    type: {
      options: ['primary', 'secondary', 'error', 'warning', 'success'],
      control: { type: 'select' },
      description:
        'primary | secondary | error | warning | success | undefined',
      type: 'string',
    },
    loading: {
      control: { type: 'boolean' },
      type: 'boolean',
    },
    disabled: {
      control: { type: 'boolean' },
      type: 'boolean',
    },
    fullWidth: {
      control: { type: 'boolean' },
      type: 'boolean',
    },
    disableRipple: {
      control: { type: 'boolean' },
      type: 'boolean',
    },
  },
};

export default meta;

const Content = styled('div', {
  display: 'flex',
  alignItems: 'center',
});

export const Main = (props: ButtonPropTypes) => (
  <Button {...props}>I'm a button</Button>
);

export const WithPrefix = (args: ButtonPropTypes) => {
  return (
    <Button {...args} prefix={<WalletIcon />}>
      I'm a button
    </Button>
  );
};

export const WithSuffix = (args: ButtonPropTypes) => (
  <Button {...args} suffix={<WalletIcon />}>
    I'm a button
  </Button>
);

export const TypesAndVariants = (args: ButtonPropTypes) => (
  <div>
    <Content>
      <Button {...args} type="primary" variant="contained">
        I'm a primary button
      </Button>
      <Divider direction="horizontal" size={12} />
      <Button {...args} type="primary" variant="outlined">
        I'm a primary button
      </Button>
      <Divider direction="horizontal" size={12} />
      <Button {...args} type="primary" variant="ghost">
        I'm a primary button
      </Button>
    </Content>

    <Divider size={12} />
    <Content>
      <Button {...args} type="secondary" variant="contained">
        I'm a secondary button
      </Button>
      <Divider direction="horizontal" size={12} />
      <Button {...args} type="secondary" variant="outlined">
        I'm a secondary button
      </Button>
      <Divider direction="horizontal" size={12} />
      <Button {...args} type="secondary" variant="ghost">
        I'm a secondary button
      </Button>
    </Content>

    <Divider size={12} />
    <Content>
      <Button {...args} type="error" variant="contained">
        I'm a error button
      </Button>
      <Divider direction="horizontal" size={12} />
      <Button {...args} type="error" variant="outlined">
        I'm a error button
      </Button>
      <Divider direction="horizontal" size={12} />
      <Button {...args} type="error" variant="ghost">
        I'm a error button
      </Button>
    </Content>

    <Divider size={12} />
    <Content>
      <Button {...args} type="warning" variant="contained">
        I'm a warning button
      </Button>
      <Divider direction="horizontal" size={12} />
      <Button {...args} type="warning" variant="outlined">
        I'm a warning button
      </Button>
      <Divider direction="horizontal" size={12} />
      <Button {...args} type="warning" variant="ghost">
        I'm a warning button
      </Button>
    </Content>

    <Divider size={12} />
    <Content>
      <Button {...args} type="success" variant="contained">
        I'm a success button
      </Button>
      <Divider direction="horizontal" size={12} />
      <Button {...args} type="success" variant="outlined">
        I'm a success button
      </Button>
      <Divider direction="horizontal" size={12} />
      <Button {...args} type="success" variant="ghost">
        I'm a success button
      </Button>
    </Content>
  </div>
);
