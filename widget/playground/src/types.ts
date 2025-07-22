import type { WidgetColors } from '@arlert-dev/widget-embedded';

export type Type = 'Destination' | 'Source';

export type ColorsType = { light?: WidgetColors; dark?: WidgetColors };
export type PresetType = Array<
  ColorsType & {
    id: number | string;
  }
>;
