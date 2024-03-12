## How it works?

Take a look at original PR:
https://github.com/rango-exchange/rango-client/pull/601


## Usage

log your messages using:
```
@rango-dev/logging-core
```

Listen to you logs (only on clients):
```json
    "@rango-dev/logging-subscriber": "0.1.0",
    "@rango-dev/logging-console": "0.1.0",
```

and 

```js
import { init, Level } from '@rango-dev/logging-subscriber';
import { layer as consoleLayer } from '@rango-dev/logging-console';

init([consoleLayer()], {
    baseLevel: Level.Trace,
});

```