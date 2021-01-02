import {ENTITY_SELECTOR} from '../types';

import {patchState} from './patchState';

export const func = (state: any, selector: ENTITY_SELECTOR, entity: any, meta?: {skipFields?: Array<keyof any>}) => {
    if (typeof entity !== 'object') {
        throw new Error('Entity is not an object');
    }
    const id = selector.idSelector(entity);
    if (!id) {
        throw new Error('Cannot detect id of an entity');
    }

    const originalSelector = selector.collectionSelector.originalSelector || selector.collectionSelector;
    const entitiesKey = selector.collectionSelector.entitiesKey || 'entities';
    const idsKey = selector.collectionSelector.idsKey || 'ids';

    // Any because keys may be different because of entitiesKey.
    const originalState: any = originalSelector(state);
    const originalEntity = originalState[entitiesKey][id];
    let featureState = originalState;

    // creating a clone
    const clone: any = {};
    for (const key of Object.keys(entity)) {
        if (meta && meta.skipFields && meta.skipFields.indexOf(key) !== -1) {
            continue;
        }
        clone[key] = entity[key];
    }
    Object.setPrototypeOf(clone, Object.getPrototypeOf(entity));

    const existingKeys = Object.keys(clone);
    for (const key of originalEntity ? Object.keys(originalEntity) : []) {
        if (existingKeys.indexOf(key) !== -1) {
            continue;
        }
        clone[key] = originalEntity[key];
    }

    if (featureState[idsKey] && featureState[idsKey].indexOf(id) === -1) {
        featureState = {
            ...featureState,
            [idsKey]: [...featureState[idsKey], id],
        };
    }

    let isEntityChanged = !originalEntity;
    for (const key of Object.keys(clone)) {
        if (isEntityChanged || !originalEntity || clone[key] !== originalEntity[key]) {
            isEntityChanged = true;
            break;
        }
    }
    if (isEntityChanged) {
        featureState = {
            ...featureState,
            [entitiesKey]: {
                ...featureState[entitiesKey],
                [id]: clone,
            },
        };
    }

    return patchState.func(state, originalState, featureState);
};

export const injectEntity = {
    func,
};
