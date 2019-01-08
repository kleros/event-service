# Event Notification Service

This service is hosted at:
- `https://staging.events.kleros.io` to subscribe to events on the `Kovan` testnet
- `https://events.kleros.io` to subscribe to events on the Ethereum mainnet

## Basic Usage

### Routes

#### `https://events.kleros.io/contracts/:address/listeners/:eventName/callbacks`

`POST`

Create a new subscription.

```
body = {
  callbackURI: 'https://my-callback-uri.com',
  contractABI: [...]
}
```

Params:
- `address`: The smart contracts address
- `eventName`: The name of the event that will trigger the callback
- `callbackURI`: The URI of your webhook. When a matching event is consumed a POST request will be sent to this URI whose body is an Ethereum event log. For structure of event log see `https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#contract-events`
- `contractABI`: <conditional> The contract ABI. This only needs to be included if the contract has not been registered before.

`DELETE`

Remove a subscription callback.

```
body = {
  callbackURI: 'https://my-callback-uri.com',
}
```

Params:
- `address`: The smart contracts address.
- `eventName`: The name of the event.
- `callbackURI`: The URI of your webhook to remove.
