import {isEncodedLabelhash, decodeLabelhash} from './labelhash'
import namehase from '@ensdomains/eth-ens-namehash'
import {keccak256} from "@cosmjs/crypto";
import {toHex, fromHex} from "@cosmjs/encoding";

export function namehash(inputName) {
    let node = ''
    for (let i = 0; i < 32; i++) {
        node += '00'
    }
    const tEncoder = new TextEncoder()
    if (inputName) {
        const labels = inputName.split('.')

        for (let i = labels.length - 1; i >= 0; i--) {
            let labelSha
            if (isEncodedLabelhash(labels[i])) {
                labelSha = decodeLabelhash(labels[i])
            } else {
                let normalisedLabel = namehase.normalize(labels[i])
                const data = tEncoder.encode(normalisedLabel)
                labelSha = toHex(keccak256(data))
            }
            node = toHex(keccak256(fromHex(node + labelSha)))
        }
    }

    return '0x' + node
}
