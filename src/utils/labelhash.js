import namehash from '@ensdomains/eth-ens-namehash'
import {keccak256} from "@cosmjs/crypto";
import {toHex} from "@cosmjs/encoding";

export function decodeLabelhash(hash) {
  if (!(hash.startsWith('[') && hash.endsWith(']'))) {
    throw Error(
      'Expected encoded labelhash to start and end with square brackets'
    )
  }

  if (hash.length !== 66) {
    throw Error('Expected encoded labelhash to have a length of 66')
  }

  return `${hash.slice(1, -1)}`
}

export function isEncodedLabelhash(hash) {
  return hash.startsWith('[') && hash.endsWith(']') && hash.length === 66
}

export function labelhash(unnormalisedLabelOrLabelhash) {
  const tEncoder = new TextEncoder()

  return isEncodedLabelhash(unnormalisedLabelOrLabelhash)
    ? '0x' + decodeLabelhash(unnormalisedLabelOrLabelhash)
    : '0x' + toHex(keccak256(tEncoder.encode(namehash.normalize(unnormalisedLabelOrLabelhash))))
}
