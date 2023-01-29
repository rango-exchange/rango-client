import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { Modal, PropTypes } from './Modal';

export default { name: 'Modal', component: Modal } as ComponentMeta<
  typeof Modal
>;

export const Main = (args: PropTypes) => <Modal {...args} />;
