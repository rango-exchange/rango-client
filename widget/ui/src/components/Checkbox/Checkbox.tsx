import React, { PropsWithChildren } from 'react';
import { styled } from '../../theme';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '../Icon';

const CheckboxContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
});

const CheckboxRoot = styled(RadixCheckbox.Root, {
  borderRadius: '5px',
  width: 20,
  padding: 0,
  height: 20,
  border: '1px solid $foreground',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '$2',
  backgroundColor: '$neutral-100',
});
const Label = styled('label', {
  color: '$foreground',
  fontSize: '$m',
  marginLeft: '$8',
});

export interface PropTypes {
  id: string;
  defaultChecked?: boolean;
  label: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
}

export function Checkbox({
  label,
  id,
  ...props
}: PropsWithChildren<PropTypes>) {
  return (
    <CheckboxContainer>
      <CheckboxRoot id={id} {...props}>
        <RadixCheckbox.Indicator>
          <CheckIcon size={20} />
        </RadixCheckbox.Indicator>
      </CheckboxRoot>
      <Label htmlFor={id}>{label} </Label>
    </CheckboxContainer>
  );
}
