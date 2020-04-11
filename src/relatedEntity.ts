import {
    FEATURE_SELECTOR,
    HANDLER_CACHE,
    HANDLER_RELATED_ENTITY,
    ID_FILTER_PROPS,
    ID_TYPES,
    UNKNOWN,
    VALUES_FILTER_PROPS,
} from './types';
import {normalizeSelector} from './utils';

export function relatedEntity<
    STORE,
    PARENT_ENTITY,
    RELATED_ENTITY,
    RELATED_KEY_IDS extends ID_FILTER_PROPS<PARENT_ENTITY, ID_TYPES>,
    RELATED_KEY_IDS_ARRAYS extends ID_FILTER_PROPS<PARENT_ENTITY, Array<ID_TYPES>>,
    RELATED_KEY_VALUES extends VALUES_FILTER_PROPS<PARENT_ENTITY, RELATED_ENTITY>,
    RELATED_KEY_VALUES_ARRAYS extends VALUES_FILTER_PROPS<PARENT_ENTITY, Array<RELATED_ENTITY>>
>(
    featureSelector: FEATURE_SELECTOR<STORE, RELATED_ENTITY>,
    keyId: RELATED_KEY_IDS | RELATED_KEY_IDS_ARRAYS,
    keyValue: RELATED_KEY_VALUES | RELATED_KEY_VALUES_ARRAYS,
    ...relationships: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>>
): HANDLER_RELATED_ENTITY<STORE, PARENT_ENTITY> {
    const {collection: funcSelector, id: idSelector} = normalizeSelector(featureSelector);

    const callback = (
        cachePrefix: string,
        state: STORE,
        cacheRefs: HANDLER_CACHE<STORE, UNKNOWN>,
        source: PARENT_ENTITY,
    ) => {
        // a bit magic to relax generic types.
        const sourceKeyIdValue = source[keyId];
        const stateItems = funcSelector(state).entities;

        if (!sourceKeyIdValue) {
            return;
        }

        const relatedIds: Array<ID_TYPES> = [];
        const relatedItems: Array<RELATED_ENTITY> = [];
        const values: ID_TYPES | Array<ID_TYPES> = sourceKeyIdValue as any; // Thanks a8.
        if (Array.isArray(values)) {
            relatedIds.push(...values);
        } else {
            relatedIds.push(values);
        }

        for (const id of relatedIds) {
            if (!stateItems[id]) {
                cacheRefs.push([cachePrefix, funcSelector, id, stateItems[id]]);
                continue;
            }

            // we have to clone it because we are going to update it with relations.
            const cacheValue = {...stateItems[id]} as RELATED_ENTITY;

            cacheRefs.push([cachePrefix, funcSelector, id, stateItems[id], cacheValue]);

            let incrementedPrefix = 0;
            for (const relationship of relationships) {
                incrementedPrefix += 1;
                relationship(`${cachePrefix}:${incrementedPrefix}`, state, cacheRefs, cacheValue, idSelector);
            }
            relatedItems.push(cacheValue);
        }

        if (Array.isArray(source[keyId])) {
            source[keyValue] = (relatedItems as any) as PARENT_ENTITY[RELATED_KEY_VALUES] &
                PARENT_ENTITY[RELATED_KEY_VALUES_ARRAYS];
        } else {
            source[keyValue] = (relatedItems[0] as any) as PARENT_ENTITY[RELATED_KEY_VALUES] &
                PARENT_ENTITY[RELATED_KEY_VALUES_ARRAYS];
        }
    };
    callback.ngrxEntityRelationship = 'relatedEntity';
    callback.idSelector = idSelector;

    return callback;
}
