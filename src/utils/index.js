import {validate as ensValidate} from '@ensdomains/ens-validation'
import {fromHex} from "@cosmjs/encoding";
import toArray from 'lodash.toarray'
import {
    isEncodedLabelhash,
    decodeLabelhash,
    labelhash,
} from './labelhash'

import ensNamehash from '@ensdomains/eth-ens-namehash'
import {namehash} from './namehash'
import whitelist from "../constants/whitelist";

function validateLabelLength(name) {
    if (!name) {
        return false
    }
    const len = toArray(name).length
    if (len < 3 || len > 512) {
        return false
    }
    let normalizedValue
    try {
        normalizedValue = ensNamehash.normalize(name)
    } catch (e) {
        normalizedValue = name
    }
    if (normalizedValue.length < 3 || normalizedValue.length > 512) {
        return false
    }
    return true
}

function validateDomains(value) {
    // black list
    // ASCII中的十进制: 0-44, 46-47, 58-94, 96, 123-127;
    // unicode: \u200b, \u200c, \u200d, \ufeff
    const blackList =
        // eslint-disable-next-line no-control-regex
        /[\u0000-\u002c\u002e-\u002f\u003a-\u005e\u0060\u007b-\u007f\u200b\u200c\u200d\ufeff]/g
    if (blackList.test(value)) {
        return false
    } else if (!ensValidate(value)) {
        return false
    }
    return true
}

function validateName(name) {
    if (!name) {
        throw new Error('Invalid name');
    }
    const labelArr = name.split('.');
    let domain = name;
    let suffix = '';
    if (labelArr.length > 1) {
        domain = labelArr.slice(0, labelArr.length - 1).join('.');
        suffix = labelArr[labelArr.length - 1];
    }
    const hasEmptyLabels = labelArr.filter((e) => e.length < 1).length > 0
    if (hasEmptyLabels) throw new Error('Domain cannot have empty labels');
    if (!validateLabelLength(domain) && !whitelist.includes(name.toLowerCase())) {
        throw new Error('Invalid name');
    }
    if (!validateDomains(domain, suffix)) throw new Error('Invalid name');
    const normalizedArray = labelArr.map((label) => {
        return isEncodedLabelhash(label) ? label : ensNamehash.normalize(label)
    })
    try {
        return normalizedArray.join('.')
    } catch (e) {
        throw e
    }
}

function domainNode(domain) {
    if (!domain) {
        return []
    }
    const hash = namehash(domain)
    return Array.from(fromHex(hash.slice(2)))
}

const domainTokenId = (domain) => {
    const label = domain.split('.')[0]
    return labelhash(label).slice(2)
}


export {
    validateName,
    // labelhash utils
    labelhash,
    isEncodedLabelhash,
    decodeLabelhash,
    // namehash utils
    namehash,
    domainNode,
    domainTokenId
}
