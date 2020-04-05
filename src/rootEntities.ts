import {EntityState} from '@ngrx/entity';

import {rootEntity} from './rootEntity';
import {rootEntityFlags} from './rootEntityFlags';
import {
    FEATURE_SELECTOR,
    HANDLER_RELATED_ENTITY,
    HANDLER_ROOT_ENTITIES,
    HANDLER_ROOT_ENTITY,
    ID_TYPES,
    isBuiltInSelector,
    isFeatureSelector,
    isHandlerRootEntity,
    isSelector,
    STORE_SELECTOR,
    TRANSFORMER,
} from './types';

export function rootEntities<
    STORE,
    ENTITY,
    TYPES extends Array<ID_TYPES>,
    SUB_TYPE extends TYPES extends Array<infer U> ? U : never
>(rootSelector: HANDLER_ROOT_ENTITY<STORE, ENTITY, SUB_TYPE>): HANDLER_ROOT_ENTITIES<STORE, ENTITY, SUB_TYPE>;
/**
 * @deprecated
 */
export function rootEntities<STORE, ENTITY>(
    featureSelector: FEATURE_SELECTOR<STORE, ENTITY>,
    ...relations: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>>
): HANDLER_ROOT_ENTITIES<STORE, ENTITY, ID_TYPES>;
/**
 * @deprecated
 */
export function rootEntities<STORE, ENTITY>(
    featureSelector: FEATURE_SELECTOR<STORE, ENTITY>,
    transformer: TRANSFORMER<ENTITY>,
    ...relations: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>>
): HANDLER_ROOT_ENTITIES<STORE, ENTITY, ID_TYPES>;
export function rootEntities<STORE, ENTITY>(
    featureSelector: FEATURE_SELECTOR<STORE, ENTITY> | HANDLER_ROOT_ENTITY<STORE, ENTITY, ID_TYPES>,
    decide?: TRANSFORMER<ENTITY> | HANDLER_RELATED_ENTITY<STORE, ENTITY>,
    ...relations: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>>
): HANDLER_ROOT_ENTITIES<STORE, ENTITY, ID_TYPES> | HANDLER_ROOT_ENTITIES<STORE, Array<ENTITY>, Array<ID_TYPES>> {
    let transformer: undefined | TRANSFORMER<ENTITY>;
    if (isBuiltInSelector<STORE, ENTITY>(decide)) {
        relations = [decide, ...relations];
    } else {
        transformer = decide;
    }
    let funcSelector: STORE_SELECTOR<STORE, EntityState<ENTITY>> | undefined;
    if (isFeatureSelector<STORE, ENTITY>(featureSelector) && isSelector<STORE, ENTITY>(featureSelector)) {
        funcSelector = featureSelector;
    } else if (isFeatureSelector<STORE, ENTITY>(featureSelector) && !isSelector<STORE, ENTITY>(featureSelector)) {
        funcSelector = featureSelector.selectors.selectCollection;
    }

    const cacheMap = new Map<string, Array<ENTITY>>();
    let itemSelector: HANDLER_ROOT_ENTITY<STORE, ENTITY, ID_TYPES> | undefined;
    if (isHandlerRootEntity<STORE, ENTITY, ID_TYPES>(featureSelector)) {
        itemSelector = featureSelector;
    } else if (funcSelector && transformer) {
        itemSelector = rootEntity<STORE, ENTITY>(funcSelector, transformer, ...relations);
    } else if (funcSelector) {
        itemSelector = rootEntity<STORE, ENTITY>(funcSelector, ...relations);
    }

    const emptyResult: Array<ENTITY> = [];

    const callback = (state: STORE, ids: Array<ID_TYPES> | undefined) => {
        if (!ids) {
            return emptyResult;
        }

        const cacheKey = ids.join(',');
        const cacheValue = cacheMap.get(cacheKey) || [];

        const value: Array<ENTITY> = [];
        for (const itemId of ids) {
            const item = itemSelector && itemSelector(state, itemId);
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
