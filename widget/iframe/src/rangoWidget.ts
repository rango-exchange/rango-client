import { WidgetConfig } from '@rango-dev/widget-embedded';
import { commonStyles } from './commonStyles';
import { iframePlaceholder } from './iframePlaceholder';

export class RangoWidget {
  private createIframeNode(configuration: WidgetConfig) {
    const configParams = JSON.stringify(configuration);

    const iframeWidget = document.createElement('iframe');
    iframeWidget.src = `https://rango-widget-iframe-rango-finance-rango-exchange.vercel.app?config=${configParams}`;
    iframeWidget.style.maxWidth = commonStyles.maxWidth;
    iframeWidget.style.minWidth = commonStyles.minWidth;
    iframeWidget.width = commonStyles.width;
    iframeWidget.height = commonStyles.height;
    iframeWidget.style.overflow = commonStyles.overflow;
    iframeWidget.style.border = 'none';
    iframeWidget.style.visibility = 'hidden';

    return iframeWidget;
  }

  public init(configuration?: WidgetConfig): void {
    const widgetRoot = window.document.getElementById('rango-widget-root');
    if (!!widgetRoot) {
      const iframeWidget = this.createIframeNode(configuration);
      widgetRoot.insertAdjacentHTML('afterbegin', iframePlaceholder);
      widgetRoot.appendChild(iframeWidget);

      iframeWidget.onload = () => {
        widgetRoot.firstElementChild?.remove();
        iframeWidget.style.visibility = 'visible';
      };
    }
  }
}
