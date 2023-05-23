# @rango-dev/widget-iframe

It's a javascript code to create an `iframe` for loading Rango's widget to your page.

Example:

Put the script in `<head>`:
```html
<script type="text/javascript" src="https://...SCRIPT_URL..."></script>
```

then you need to specify your container tag:

```html
<div id="rango-widget-container"></div>
```

and finally,

```javascript
<script>
    const configurations = {
        apiKey: '<YOUR_API_KEY>',
        to: {
            blockchain: 'BSC',
            token: {
            blockchain: 'BSC',
            address: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
            symbol: 'ETH',
            },
        },
        theme: {
            mode: 'dark',
            singleTheme: true,
            colors: {
            dark: {
                background: '#0c0f12ff',
                primary: '#e0c072ff',
                foreground: '#e0c072ff',
                success: '#e9dcbeff',
                surface: '#12171cff',
                neutral: '#202327ff',
            },
            },
        },
    };

    rangoWidget.init(configurations);
</script>
```

## Build

You need to pass an enviroment variable which is the widget app that we are going to embedd.

```
WIDGET_URL=http://... yarn build
```


## Development

```shell
# 1. Create a test html page and put the example code there.
# 2. It will serve the `widget-app` on 3002
yarn dev:widget
# 3. Build the script
WIDGET_URL=http://localhost:3002 yarn build
```