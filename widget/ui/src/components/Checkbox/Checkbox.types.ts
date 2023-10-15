import type { CheckboxProps } from '@radix-ui/react-checkbox';

type RadixCheckboxProps = Pick<
  CheckboxProps,
  'defaultChecked' | 'checked' | 'disabled' | 'name' | 'onCheckedChange'
>;

interface WithLabelProps {
  id: string;
  label: React.ReactNode;
}
interface ComponentProps {
  id?: never;
  label?: never;
}

export type PropTypes = RadixCheckboxProps & (ComponentProps | WithLabelProps);
