import {namehash, validateName, domainNode, domainTokenId} from './utils'


function getSeiIDAddress(networkId) {
    switch (networkId) {
        case 'atlantic-2':
            return 'sei1q49lp2y87lt0p9pcpv3al2x3gxq3g2504sxh8knamnlarhwhckgqctpnf0'
        case 'pacific-1':
            return 'sei1qwzmp9tw2guxjwjteyjn52efu5ny0a5sc9e7lq69zytn87f30hksrlytqy'
        default:
            return ''
    }
}

function getSeiIDReverseResolverAddress(networkId) {
    switch (networkId) {
        case 'atlantic-2':
            return 'sei1a59k7mc9hsvtaeu532etl2geqmqdyufjncjkg0h3lxsu5u2rpensanaxwf'
        case 'pacific-1':
            return 'sei1qujw7gxacyk08fpg0lsf377f727ldq8f9cmjlrxt6awdkag9ypjsdnkh98'
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
