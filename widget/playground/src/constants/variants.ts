import type { WidgetVariant } from '@arlert-dev/widget-embedded';

export const VARIANTS: { label: string; value: WidgetVariant }[] = [
  {
    label: 'Default',
    value: 'default' as WidgetVariant,
  },
  {
    label: 'Expanded',
    value: 'expanded' as WidgetVariant,
  },
  {
    label: 'Full Expanded',
    value: 'full-expanded' as WidgetVariant,
  },
];
