Basic StatsD client
-------------------

```js

const g = require('gauges');

// configure connection

g.PORT = 8125;
h.HOST = 'localhost';

// single message
g.counter('ducks', 2);

// multi
const multi = g.multi('server');

multi
    .counter('request', 1)
    .counter('sessions', 2)
    .counter('queries', 6)
    .timer('delay', 200)
    .set('query', 'get_all_ducks')
    .set('query', 'get_all_cows');
    
multi.send();
```

API
===

Mirrors StatsD API. [Reference](https://github.com/etsy/statsd/blob/master/docs/metric_types.md)

> NOTE: all commands also send the corresponding UDP packet to StatsD

- `#counter(key, value)`
- `#gauge(key, value)`
- `#timer(key, value)`
- `#set(key, value)`

### Multi

Sends multi-metric packets. [Reference](https://github.com/etsy/statsd/blob/master/docs/metric_types.md#multi-metric-packets)

- `gauges.multi(prefix)`
- `#send()` send the batch command
