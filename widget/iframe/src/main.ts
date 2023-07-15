import { WidgetConfig } from '@rango-dev/widget-embedded';
import { commonStyles } from './styles';

// Actual app that will be loaded inside the iframe.
const WIDGET_URL = 'https://widget.rango.exchange/';
const DEFAULT_CONTAINER_ID = 'rango-widget-container';

export class RangoWidget {
  /**
   * Encode configuration object into a string that can be passed as url param.
   */
  private encode(configuration: WidgetConfig): string {
    const configParams = JSON.stringify(configuration, (key, value) => {
      // Take # out of the url parameters
      if (typeof value === 'string' && value[0] === '#') {
        return value.replace('#', '$');
      } else if (typeof value === 'function')
        return { isFunction: true, functionBody: value.toString() };
      else return value;
    });
    return configParams;
  }

  /**
   * We need a container to load our iframe into it. This method will get the container or raise an error.
   */
  private getContainer(containerId: string): HTMLElement {
    const container = window.document.getElementById(containerId);

    if (!container) {
      throw new Error(
        `Couldn't find root element for initializing widget. Please make sure you have an HTML element with this is: ${container} `
      );
    }

    return container;
  }

  /**
   * Creating an iframe node with desired attributes to load the widget.
   */
  private createWidget(configuration?: WidgetConfig): HTMLIFrameElement {
    if (!configuration) {
      throw new Error('Make sure you are passing configurations.');
    }

    const configs = this.encode(configuration);
    const url = `${WIDGET_URL}?config=${configs}`;

    const widget = document.createElement('iframe');
    widget.src = url;
    widget.style.maxWidth = commonStyles.maxWidth;
    widget.style.minWidth = commonStyles.minWidth;
    widget.width = commonStyles.width;
    widget.height = commonStyles.height;
    widget.style.overflow = commonStyles.overflow;
    widget.style.border = 'none';
    widget.style.display = 'none';

    return widget;
  }

  public init(configuration?: WidgetConfig, rootId?: string): void {
    const container = this.getContainer(rootId || DEFAULT_CONTAINER_ID);
    const widget = this.createWidget(configuration);

    container.style.width = '100%';
    container.appendChild(widget);

    widget.onload = () => {
      widget.style.display = 'block';
    };
  }
}
