import {namehash, validateName, domainNode, domainTokenId} from './utils'


function getSeiIDAddress(networkId) {
    switch (networkId) {
        case 'atlantic-2':
            return 'sei19nwj9c0jsdpsq7cwhl8t0cygvv6d024wy0t4hs72v7aajvqmsrjqhe7fkv'
        default:
            return ''
    }
}
function getSeiIDReverseResolverAddress(networkId) {
    switch (networkId) {
        case 'atlantic-2':
            return 'sei1hjgekx06xkpr09zx53g4hngcu3q074ffqhkhh07eje79tyh233hsne0w0t'
        default:
            return ''
    }
}


class Resolver {
    constructor({address, client, seiIdAddress}) {
        this.address = address
        this.client = client
        this.seiIdAddr = seiIdAddress
    }

    name(name) {
        validateName(name)
        return new Name({
            name,
            client: this.client,
            resolver: this.address,
            seiIdAddress: this.seiIdAddr,
        })
    }
}

class Name {
    constructor(options) {
        const {name, client, seiIdAddress, resolver} = options
        this.client = client
        this.seiIdAddr = seiIdAddress
        this.name = name
        this.namehash = namehash(name)
        this.resolver = resolver
    }

    async getOwner() {
        try {
            const msg = {
                owner: {
                    node: domainNode(this.name)
                }
            }
            const res = await this.client.queryContractSmart(this.seiIdAddr, msg)
            return res?.owner
        } catch (e) {
            console.error(e)
        }
    }

    async getResolver() {
        try {
            const msg = {
                resolver: {
                    node: domainNode(this.name)
                }
            }
            const res = await this.client.queryContractSmart(this.seiIdAddr, msg)
            return res?.resolver
        } catch (e) {
            console.error(e)
        }
    }

    async getResolverAddr() {
        if (this.resolver) {
            return this.resolver // hardcoded for old resolvers or specific resolvers
        } else {
            return this.getResolver()
        }
    }

    async getAddress() {
        const resolverAddr = await this.getResolverAddr()
        if (!resolverAddr) return
        try {
            const msg = {
                address: {
                    node: domainNode(this.name)
                }
            }
            const res = await this.client.queryContractSmart(resolverAddr, msg)
            return res?.address
        } catch (e) {
            console.error(e)
        }

    }
}

export default class SeiID {
    constructor(options) {
        const {chainId, client, seiIdAddress} = options

        if (!client) throw new Error('client is required')
        if (!chainId) throw new Error('chainId is required')

        this.client = client
        this.chainId = chainId
        this.seiIdAddr = seiIdAddress || getSeiIDAddress(chainId)
    }

    name(name) {
        validateName(name)
        return new Name({
            name,
            client: this.client,
            seiIdAddress: this.seiIdAddr,
        })
    }

    resolver(address) {
        return new Resolver({
            client: this.client,
            address: address,
            seiIdAddress: this.seiIdAddr,
        })
    }

    async getName(address) {
        const reverseResolver = getSeiIDReverseResolverAddress(this.chainId)
        if (!reverseResolver) return
        try {
            const msg = {
                name: {
                    address: address.toLowerCase()
                }
            }
            const res = await this.client.queryContractSmart(reverseResolver, msg)
            if (res?.name) {
                const domain = res.name.endsWith('.sei') ? res.name : res.name + '.sei'
                const addr = await this.name(domain).getAddress()
                if (addr?.toLowerCase() !== address.toLowerCase()) {
                    return
                }
                return domain
            }
        } catch (e) {
            console.error(e)
        }
    }
}

export {
    validateName,
    domainNode,
    domainTokenId,
    getSeiIDAddress,
}
