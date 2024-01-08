import type { WidgetConfig } from '@rango-dev/widget-embedded';

import { commonStyles } from './styles';
// Actual app that will be loaded inside the iframe.
const WIDGET_URL = 'http://localhost:3002';
const DEFAULT_CONTAINER_ID = 'rango-widget-container';
const RANGO_WIDGET_IFRAME_ID = 'rango-widget-iframe';

export class RangoWidget {
  public init(configuration?: WidgetConfig, rootId?: string): void {
    const container = this.getContainer(rootId || DEFAULT_CONTAINER_ID);
    const widget = this.createWidget(configuration);

    window.addEventListener('message', (event) => {
      if (event.data.type === 'dimensionsChanged') {
        console.log('new height:', event.data.height);
        widget.style.height = event.data.height;
      }
    });

    container.appendChild(widget);

    widget.onload = () => {
      widget.style.display = 'block';
    };
  }
  /**
   * Encode configuration object into a string that can be passed as url param.
   */
  private encode(configuration: WidgetConfig): string {
    const configParams = JSON.stringify(configuration, (key, value) => {
      // Take # out of the url parameters
      if (typeof value === 'string' && value[0] === '#') {
        return value.replace('#', '$');
      }
      return value;
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
    widget.setAttribute('id', RANGO_WIDGET_IFRAME_ID);
    widget.src = url;
    //Introduce a high-contrast color to enhance visibility when observing the height changes.
    widget.style.backgroundColor = 'red';
    widget.style.width = '100%';
    widget.style.maxWidth = commonStyles.maxWidth;
    widget.style.maxHeight = commonStyles.maxHeight;
    widget.style.overflow = commonStyles.overflow;
    widget.style.border = 'none';
    /*
     * To prevent layout shifts, we can set an initial height for the iframe.
     *  widget.style.height = '441px';
     */
    return widget;
  }
}
