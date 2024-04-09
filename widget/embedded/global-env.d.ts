import type { WidgetConfig } from './src';

export {};

declare global {
  interface Window {
    __rango: {
      config: WidgetConfig;
      dappConfig: WidgetConfig;
    };
  }
}
