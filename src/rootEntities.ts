import {rootEntity} from './rootEntity';
import {rootEntityFlags} from './rootEntityFlags';
import {
    FEATURE_SELECTOR,
    HANDLER_RELATED_ENTITY,
    HANDLER_ROOT_ENTITIES,
    ID_TYPES,
    isBuiltInSelector,
    TRANSFORMER,
} from './types';

export function rootEntities<STORE, ENTITY>(
    featureSelector: FEATURE_SELECTOR<STORE, ENTITY>,
    ...relations: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>>
): HANDLER_ROOT_ENTITIES<STORE, ENTITY, ID_TYPES>;
export function rootEntities<STORE, ENTITY>(
    featureSelector: FEATURE_SELECTOR<STORE, ENTITY>,
    transformer: TRANSFORMER<ENTITY>,
    ...relations: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>>
): HANDLER_ROOT_ENTITIES<STORE, ENTITY, ID_TYPES>;
export function rootEntities<STORE, ENTITY>(
    featureSelector: FEATURE_SELECTOR<STORE, ENTITY>,
    decide?: TRANSFORMER<ENTITY> | HANDLER_RELATED_ENTITY<STORE, ENTITY>,
    ...relations: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>>
): HANDLER_ROOT_ENTITIES<STORE, ENTITY, ID_TYPES> {
    let transformer: undefined | TRANSFORMER<ENTITY>;
    if (isBuiltInSelector<STORE, ENTITY>(decide)) {
        relations = [decide, ...relations];
    } else {
        transformer = decide;
    }

    const cacheMap = new Map<string, Array<ENTITY>>();
    const itemSelector = transformer
        ? rootEntity<STORE, ENTITY>(featureSelector, transformer, ...relations)
        : rootEntity<STORE, ENTITY>(featureSelector, ...relations);

    const callback = (state: STORE, ids: Array<any>) => {
        const cacheKey = ids.join(',');
        const cacheValue = cacheMap.get(cacheKey) || [];

        const value: Array<ENTITY> = [];
        for (const itemId of ids) {
            const item = itemSelector(state, itemId);
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

        if (rootEntityFlags.disabled) {
            return cacheValue;
        }

        cacheMap.set(cacheKey, value);
        return value;
    };
    callback.ngrxEntityRelationship = 'rootEntities';

    return callback;
}
