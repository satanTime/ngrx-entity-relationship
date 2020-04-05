import {
    FEATURE_SELECTOR,
    HANDLER_CACHE,
    HANDLER_RELATED_ENTITY,
    ID_FILTER_PROPS,
    ID_TYPES,
    UNKNOWN,
    VALUES_FILTER_PROPS,
} from './types';

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
    ...relations: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>>
): HANDLER_RELATED_ENTITY<STORE, PARENT_ENTITY> {
    const funcSelector =
        typeof featureSelector === 'function' ? featureSelector : featureSelector.selectors.selectCollection;

    const callback = (
        cachePrefix: string,
        state: STORE,
        cacheRefs: HANDLER_CACHE<STORE, UNKNOWN>,
        source: PARENT_ENTITY,
    ) => {
        // a bit magic to relax generic types.
        const sourceKeyIdValue = source[keyId];
        const stateFeature = funcSelector(state);
        const stateItems = stateFeature ? stateFeature.entities : {};

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
            const cacheRef = cacheRefs.find(
                ([prefix, selector, index]) => prefix === cachePrefix && selector === funcSelector && index === id,
            );
            if (cacheRef) {
                if (cacheRef.length) {
                    relatedItems.push(cacheRef[3] as RELATED_ENTITY);
                }
                continue;
            }

            if (!stateItems[id]) {
                cacheRefs.push([cachePrefix, funcSelector, id, stateItems[id]]);
                continue;
            }

            // we have to clone it because we are going to update it with relations.
            const cacheValue = {...stateItems[id]} as RELATED_ENTITY;

            cacheRefs.push([cachePrefix, funcSelector, id, stateItems[id], cacheValue]);

            let incrementedPrefix = 0;
            for (const relation of relations) {
                incrementedPrefix += 1;
                relation(`${cachePrefix}${incrementedPrefix}`, state, cacheRefs, cacheValue);
            }
            relatedItems.push(cacheValue);
        }

        if (Array.isArray(source[keyId])) {
            source[keyValue] = relatedItems as any;
        } else if (relatedItems) {
            source[keyValue] = relatedItems[0] as any;
        }
    };
    callback.ngrxEntityRelationship = 'relatedEntity';

    return callback;
}
