const SeiID = require('@siddomains/sei-sidjs').default
const {getSeiIDAddress} = require('@siddomains/sei-sidjs')
const {getCosmWasmClient} = require("@sei-js/core")

const CHAIN_ID = 'pacific-1'
const RPC = 'https://sei-rpc.polkachu.com/'

let seiId

async function getSeiId() {
    if (seiId) return seiId
    const client = await getCosmWasmClient(RPC);
    seiId = new SeiID({client, chainId: CHAIN_ID, seiIdAddress: getSeiIDAddress(CHAIN_ID)})
    return seiId
}


async function testGetAddress(name) {
    const seiId = await getSeiId()
    const address = await seiId.name(name).getAddress()
    console.log("name: %s, address: %s", name, address)
}

async function testGetOwner(name) {
    const seiId = await getSeiId()
    const owner = await seiId.name(name).getOwner()
    console.log("name: %s, owner: %s", name, owner)
}

async function testGetName(address) {
    const seiId = await getSeiId()
    const domain = await seiId.getName(address)
    console.log("address: %s, domain: %s", address, domain)
}

testGetAddress("allen.sei")
testGetOwner("allen.sei")
testGetName('sei1tmew60aj394kdfff0t54lfaelu3p8j8lz93pmf')
