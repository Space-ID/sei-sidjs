~~# Use sei-sidjs SDK to interact with SEI-SID contracts

# SEI-SID.js

SEI-SIDjs integrates the SEI-SID contract.

## Overview of the API

### Installation

Install @siddomains/sei-sidjs, alongside [@sei-js/core](https://www.npmjs.com/package/@sei-js/core).

```
npm install @siddomains/sei-sidjs @sei-js/core
```

### Getting Started

All that's needed to get started is a CosmWasmClient instance, you should pass it and select chain id when creating a
new SeiID instance.

```javascript
// atlantic-2 testnet domain example
const SeiID = require('@siddomains/sei-sidjs').default
const {getSeiIDAddress} = require('@siddomains/sei-sidjs')
const {getCosmWasmClient} = require("@sei-js/core")

async function main(name) {
    const client = await getCosmWasmClient('https://rpc.atlantic-2.seinetwork.io/');
    const seiId = new SeiID({client, chainId: 'atlantic-2', seiIdAddress: getSeiIDAddress('atlantic-2')})

    const address = await seiId.name(name).getAddress()
    console.log("name: %s, address: %s", name, address)
}

main("000.sei")
```

```javascript
// pacific-1 mainnet domain example
const SeiID = require('@siddomains/sei-sidjs').default
const {getSeiIDAddress} = require('@siddomains/sei-sidjs')
const {getCosmWasmClient} = require("@sei-js/core")

async function main(name) {
    const client = await getCosmWasmClient('https://sei-rpc.polkachu.com/');
    const seiId = new SeiID({client, chainId: 'pacific-1', seiIdAddress: getSeiIDAddress('pacific-1')})

    const address = await seiId.name(name).getAddress()
    console.log("name: %s, address: %s", name, address)
}

main("allen.sei")
```

### exports

```
default - SeiID
getSeiIDAddress
domainNode
domainTokenId
validateName
```

### SeiID Interface

```
name(name: String) => Name
```

Returns a Name Object, that allows you to make record queries.

```
resolver(address: SeiAddress) => Resolver
```

Returns a Resolver Object, allowing you to query names from this specific resolver. Most useful when querying a
different resolver that is different than is currently recorded on the registry. E.g. migrating to a new resolver

```
async getName(address: SeiAddress) => Promise<Name>
```

Returns the reverse record for a particular Sei address.

### Name Interface

```ts
async getOwner() => Promise<SeiAddress>
```

Returns the owner/controller for the current SeiID name.

```ts
async getResolver() => Promise<SeiAddress>
```

Returns the resolver for the current SeiID name.

```ts
async getAddress() => Promise<SeiAddress>
```

Returns the address for the current SeiID name.

## Resolver Interface

```ts
address
```

Static property that returns current resolver address

```ts
name(name)
=>
Name
```

Returns a Name Object that hardcodes the resolver

Build SDK and test on your test machine

```shell
yarn install
yarn run build
node main.js
```~~
