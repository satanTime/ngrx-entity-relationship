import {rootEntityFlags} from './rootEntityFlags';
import {HANDLER_ROOT_ENTITIES, HANDLER_ROOT_ENTITY, ID_TYPES} from './types';

export function rootEntities<STORE, ENTITY>(
    rootSelector: HANDLER_ROOT_ENTITY<STORE, ENTITY, ID_TYPES>,
): HANDLER_ROOT_ENTITIES<STORE, ENTITY, ID_TYPES> {
    const cacheMap = new Map<string, Array<ENTITY>>();
    const emptyResult: Array<ENTITY> = [];

    const callback = (state: STORE, ids: undefined | Array<ID_TYPES>) => {
        if (!ids) {
            return emptyResult;
        }

        const cacheKey = ids.join(',');
        const cacheValue = cacheMap.get(cacheKey) || emptyResult;

        if (rootEntityFlags.disabled) {
            return cacheValue;
        }

        const value: Array<ENTITY> = [];
        for (const itemId of ids) {
            const item = rootSelector(state, itemId);
            if (!item) {
                continue;
            }
            value.push(item);
        }

        let index = 0;
        let equal = cacheValue && value.length === cacheValue.length;
        for (const item of value) {
            if (!cacheValue || !cacheValue[index] || cacheValue[index] !== item) {
                equal = false;
                break;
            }
            index += 1;
        }
        if (equal) {
            return cacheValue;
        }

        cacheMap.set(cacheKey, value);
        return value;
    };
    callback.ngrxEntityRelationship = 'rootEntities';
    callback.idSelector = rootSelector.idSelector;

    return callback;
}
