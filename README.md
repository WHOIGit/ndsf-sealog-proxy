# NDSF Sealog Proxy

The Sealog Proxy broadcasts messages from a Sealog server to multiple clients.

![Diagram](./diagram.svg)

This is useful in the case where there is limited bandwidth between the Sealog server and clients of the Sealog websockets API, such as browsers using the Sealog client web application.


## Implementation Details

Sealog uses the [nes protocol][protocol] to allow clients to subscribe to messages published by the Sealog server to specific message topics (or paths).

[protocol]: https://github.com/hapijs/nes/blob/master/PROTOCOL.md

The topic set for Sealog can be found in [this file][sealog-ws-api]. This line declares one such subscription topic:

```node
server.subscription('/ws/status/newCruises');
```

[sealog-ws-api]: https://github.com/OceanDataTools/sealog-server/blob/master/routes/ws/events.js

The proxy server tracks the subscriptions of each connected client, and forwards relevant messages to the subscribing clients. All messages originating from clients are dropped.


## Limitations

- Message splitting and reconstruction is not implemented.

- Clients connecting the proxy are not authenticated. If Sealog content is sensitive, ensure that the proxy is not accessible to unauthorized clients.
