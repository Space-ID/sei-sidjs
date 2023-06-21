const SeiID = require('./dist/index').default
const {getSeiIDAddress} = require('./dist/index')
const {getCosmWasmClient} = require("@sei-js/core")


let seiId

async function main(name) {
    const client = await getCosmWasmClient('https://rpc.atlantic-2.seinetwork.io/');
    seiId = new SeiID({client, chainId: 'atlantic-2', seiIdAddress: getSeiIDAddress('atlantic-2')})

    const address = await seiId.name(name).getAddress()
    console.log("name: %s, address: %s", name, address)
}

main("000.sei")
