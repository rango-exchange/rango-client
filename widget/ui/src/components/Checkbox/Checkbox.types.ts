import type { CheckboxProps } from '@radix-ui/react-checkbox';

type RadixCheckboxProps = Pick<
  CheckboxProps,
  'defaultChecked' | 'checked' | 'disabled' | 'name' | 'onCheckedChange'
>;

interface ComponentProps {
  id: string;
  label: string;
}

export type PropTypes = RadixCheckboxProps & ComponentProps;
