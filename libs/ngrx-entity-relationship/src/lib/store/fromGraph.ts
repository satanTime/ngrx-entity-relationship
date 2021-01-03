import {ENTITY_SELECTOR} from '../types';

import {injectEntity} from './injectEntity';

export const func = (state: any, selector: ENTITY_SELECTOR, data: any) => {
    const isSet = Array.isArray(data);
    const entities = isSet ? data : [data];

    // detecting keys we should skip
    const skipFields: Array<keyof any> = [];
    for (const relationship of selector.relationships) {
        skipFields.push(relationship.keyValue);
    }

    for (const entity of entities) {
        if (!entity) {
            continue;
        }

        state = injectEntity.func(state, selector, entity, {skipFields});
        for (const relationship of selector.relationships) {
            state = func(state, relationship, entity[relationship.keyValue]);
        }
    }

    return state;
};

export const fromGraph = {
    func,
};
