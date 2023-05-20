import { WidgetConfig } from '@rango-dev/widget-embedded';
import { commonStyles, defaultStyles } from './constants';
import { getIframePlaceholder } from './iframePlaceholder';
import { convertHexToRGB } from './utils';
import { WIDGET_IFRAME_URL } from './config';
import { PlaceholderStyles } from './types';

export class RangoWidget {
  private createConfigParams(configuration: WidgetConfig): string {
    const configParams = JSON.stringify(configuration, (key, value) => {
      // Take # out of the url parameters, and use rgb colors instead of hex colors.
      if (typeof value === 'string' && value[0] === '#') {
        const rgb = convertHexToRGB(value);
        return rgb;
      } else return value;
    });

    return configParams;
  }

  private getPlaceholderStyles(configuration: WidgetConfig): PlaceholderStyles {
    const colors = configuration?.theme?.colors;
    let background: string = '';
    let foreground: string = '';
    const OSThemeMode = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';
    const mode =
      configuration?.theme?.mode === 'auto'
        ? OSThemeMode
        : configuration?.theme?.mode || 'light';

    if (!!colors) {
      if (mode === 'light') {
        if (colors.light.background) background = colors.light.background;
        if (colors.light.foreground) foreground = colors.light.foreground;
      }

      if (mode === 'dark') {
        if (colors.dark.background) background = colors.dark.background;
        if (colors.dark.foreground) foreground = colors.dark.foreground;
      }
    } else {
      defaultStyles[mode].background;
      defaultStyles[mode].foreground;
    }

    return { background, foreground };
  }

  private createIframeNode(configuration: WidgetConfig): HTMLIFrameElement {
    const iframeWidget = document.createElement('iframe');
    const configParams = this.createConfigParams(configuration);
    iframeWidget.src = `${WIDGET_IFRAME_URL}?config=${configParams}`;
    iframeWidget.style.maxWidth = commonStyles.maxWidth;
    iframeWidget.style.minWidth = commonStyles.minWidth;
    iframeWidget.width = commonStyles.width;
    iframeWidget.height = commonStyles.height;
    iframeWidget.style.overflow = commonStyles.overflow;
    iframeWidget.style.border = 'none';
    iframeWidget.style.display = 'none';

    return iframeWidget;
  }

  public init(configuration?: WidgetConfig): void {
    const widgetRoot = window.document.getElementById('rango-widget-root');
    if (!!widgetRoot) {
      const iframeWidget = this.createIframeNode(configuration);
      const placeholderStyles = this.getPlaceholderStyles(configuration);
      widgetRoot.insertAdjacentHTML(
        'afterbegin',
        getIframePlaceholder(placeholderStyles)
      );
      widgetRoot.appendChild(iframeWidget);

      iframeWidget.onload = () => {
        const placeholder = document.getElementById('widget-placeholder');
        placeholder?.remove();
        iframeWidget.style.display = 'block';
      };
    }
  }
}
