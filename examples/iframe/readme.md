# Getting started

You can get different configurations from [our playground](https://playground.rango.exchange/).

## Production/next testing

```shell
npx serve ./
```

## Local testing

First, put your local server url into `iframe` script which located at `widget/iframe/src/main.ts` and `WIDGET_URL`.

Then, on `rango-client`,

```shell
cd widget/iframe
yarn build
```

Copy generated `index.js` into this directory.

Then on `HTML` files of this directory update the script path to your local path:

```html
<script src="https://api.rango.exchange/widget/iframe.bundle.min.js"></script>
```

into

```html
<script src="./index.js"></script>
```

If you are testing `embedded`, you need to run this command on `rango-client`:

```shell
yarn dev:widget
```

Then serve HTML files using:

```shell
npx serve ./
```
