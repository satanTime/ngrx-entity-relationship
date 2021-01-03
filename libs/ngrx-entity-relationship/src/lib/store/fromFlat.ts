import {ENTITY_SELECTOR} from '../types';

import {injectEntity} from './injectEntity';

const extractMap = (
    selector: ENTITY_SELECTOR,
    map: Map<string, {selectors: Set<ENTITY_SELECTOR>; skipFields: Set<keyof any>}>,
) => {
    if (!selector.meta || !selector.meta.flatKey) {
        throw new Error('Flat key is not provided in meta');
    }
    const {selectors = new Set<ENTITY_SELECTOR>(), skipFields = new Set<keyof any>()} =
        map.get(selector.meta.flatKey) || {};
    if (!map.has(selector.meta.flatKey)) {
        map.set(selector.meta.flatKey, {
            selectors,
            skipFields,
        });
    }
    selectors.add(selector);
    for (const relationship of selector.relationships) {
        skipFields.add(relationship.keyValue);
        extractMap(relationship, map);
    }
    return map;
};

const func = (state: any, selector: ENTITY_SELECTOR, data: any) => {
    const map = extractMap(selector, new Map());
    for (const [key, {selectors, skipFields}] of map) {
        const isSet = Array.isArray(data[key]);
        const entities = isSet ? data[key] : [data[key]];

        for (const entity of entities) {
            if (!entity) {
                continue;
            }

            for (const entitySelector of selectors) {
                state = injectEntity.func(state, entitySelector, entity, {skipFields: [...skipFields]});
            }
        }
    }

    return state;
};

export const fromFlat = {
    func,
};
