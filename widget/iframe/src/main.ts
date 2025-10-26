import type { WidgetConfig } from '@rango-dev/widget-embedded';

import {
  applyCommonStyles,
  applyDefaultStyles,
  applyDynamicHeightStyles,
} from './styles';
import { canParse } from './utils';

// Actual app that will be loaded inside the iframe.
const WIDGET_URL = 'https://widget.rango.exchange/';
const DEFAULT_CONTAINER_ID = 'rango-widget-container';
const RANGO_WIDGET_IFRAME_ID = 'rango-widget-iframe';

interface Options {
  rootId?: string;
  clientUrl?: string;
  widgetUrl?: string;
}

interface Features {
  dynamicHeight: boolean;
}

/**
 * TODO: we should add a new path to our build process to be able to use some internal types.
 * esm supports for `exports` in package json which will be useful for this use case.
 * The bellow type should come from `widget/embedded/src/hooks/useIframe/useIframe.types.ts`.
 */
type Messages = any;

export class RangoWidget {
  private widget: HTMLIFrameElement | null = null;
  private features: Features = {
    dynamicHeight: false,
  };
  private options?: Options;

  public init(configuration?: WidgetConfig, options?: string | Options) {
    /**
     * It was only an string for setting rootId previously, so for backward compatibility we should keep the string yet.
     * Here, we are parsing the value and convert it to an object.
     */
    this.parseOptions(options);

    if (!!this.options?.widgetUrl && !canParse(this.options.widgetUrl)) {
      throw new Error('You need to pass a valid `widgetUrl`.');
    }

    if (!!this.options?.clientUrl && !canParse(this.options.clientUrl)) {
      throw new Error('You need to pass a valid `clientUrl`.');
    }

    // Create widget
    this.createWidget(configuration);
    if (!this.widget) {
      throw new Error("Widget element hasn't been created yet.");
    }

    // Append the widget to target container
    const rootId = this.options?.rootId || DEFAULT_CONTAINER_ID;
    const container = this.getContainer(rootId);
    container.appendChild(this.widget);

    // Listening to events
    this.widget.onload = () => {
      this.widget!.style.display = 'block';
    };

    if (!!this.options?.clientUrl) {
      this.listenToMessages();
    }

    return this.builder();
  }

  /**
   *
   * Activating feature
   * This script can have different features that needs to be activated by user explicitly.
   *
   * @param feature
   * @returns
   */
  public activate(feature: keyof Features) {
    if (!this.widget) {
      throw new Error(
        "It seems you didn't call `init`. Please first setup iframe using `init` then try to activate a feature."
      );
    }
    if (!this.options?.clientUrl) {
      throw new Error(
        "You need to pass `clientUrl` in your init's options to be able to use iframe features."
      );
    }
    if (!(feature in this.features)) {
      throw new Error(`${feature} is not a valid feature.`);
    }

    this.features[feature] = true;

    return this.builder();
  }

  /**
   * We can call some specific methods like a chain by using this pattern.
   * It will be like: rango().activate('a').activate('b')
   */
  private builder(): {
    activate: RangoWidget['activate'];
  } {
    return {
      activate: this.activate.bind(this),
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
  private createWidget(configuration?: WidgetConfig) {
    if (!configuration) {
      throw new Error('Make sure you are passing configurations.');
    }

    const configs = this.encode(configuration);
    const baseUrl = this.options?.widgetUrl || WIDGET_URL;
    let url = `${baseUrl}?config=${configs}`;
    const widget = document.createElement('iframe');
    widget.setAttribute('id', RANGO_WIDGET_IFRAME_ID);

    if (this.options?.clientUrl) {
      url += `&clientUrl=${encodeURI(this.options.clientUrl)}`;
      applyDynamicHeightStyles(widget);
    } else {
      applyCommonStyles(widget);
      applyDefaultStyles(widget);
    }
    widget.src = url;
    this.widget = widget;
  }

  /**
   * Listening to messages and react to events sent by widget.
   */
  private listenToMessages() {
    window.addEventListener('message', (e) => {
      if (this.features.dynamicHeight && e.data.type === 'widget_height') {
        this.onWidgetHeightChange(e.data);
      }
    });
  }

  private onWidgetHeightChange(message: Messages) {
    if (!this.widget) {
      return;
    }
    this.widget.style.height = message.data.height;
  }

  /**
   * This is for backward compatibility. Previously we only got `rootId` as option and second parameter of `init`.
   */
  private parseOptions(options?: string | Options) {
    let opts: Options | undefined = undefined;
    if (typeof options === 'string') {
      opts = {
        rootId: options,
      };
    } else if (typeof options !== 'undefined') {
      opts = options;
    }

    this.options = opts;
  }
}
