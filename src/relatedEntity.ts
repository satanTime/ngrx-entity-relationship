import {
    FEATURE_SELECTOR,
    HANDLER_CACHE,
    HANDLER_RELATED_ENTITY,
    ID_FILTER_PROPS,
    ID_TYPES,
    isBuiltInSelector,
    TRANSFORMER,
    VALUES_FILTER_PROPS,
} from './types';

export function relatedEntity<
    STORE,
    PARENT_ENTITY,
    RELATED_ENTITY,
    RELATED_KEY_IDS extends ID_FILTER_PROPS<PARENT_ENTITY, ID_TYPES>,
    RELATED_KEY_IDS_ARRAYS extends ID_FILTER_PROPS<PARENT_ENTITY, Array<ID_TYPES>>,
    RELATED_KEY_VALUES extends VALUES_FILTER_PROPS<PARENT_ENTITY, RELATED_ENTITY>,
    RELATED_KEY_VALUES_ARRAYS extends VALUES_FILTER_PROPS<PARENT_ENTITY, Array<RELATED_ENTITY>>,
    TRANSFORMED_RELATED_ENTITY
>(
    featureSelector: FEATURE_SELECTOR<STORE, RELATED_ENTITY>,
    keyId: RELATED_KEY_IDS | RELATED_KEY_IDS_ARRAYS,
    keyValue: RELATED_KEY_VALUES | RELATED_KEY_VALUES_ARRAYS,
    transformer: TRANSFORMER<RELATED_ENTITY, TRANSFORMED_RELATED_ENTITY>,
    ...relations: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>>
): HANDLER_RELATED_ENTITY<STORE, PARENT_ENTITY>;
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
): HANDLER_RELATED_ENTITY<STORE, PARENT_ENTITY>;
export function relatedEntity<
    STORE,
    PARENT_ENTITY,
    RELATED_ENTITY,
    RELATED_KEY_IDS extends ID_FILTER_PROPS<PARENT_ENTITY, ID_TYPES>,
    RELATED_KEY_IDS_ARRAYS extends ID_FILTER_PROPS<PARENT_ENTITY, Array<ID_TYPES>>,
    RELATED_KEY_VALUES extends VALUES_FILTER_PROPS<PARENT_ENTITY, RELATED_ENTITY>,
    RELATED_KEY_VALUES_ARRAYS extends VALUES_FILTER_PROPS<PARENT_ENTITY, Array<RELATED_ENTITY>>,
    TRANSFORMED_RELATED_ENTITY
>(
    featureSelector: FEATURE_SELECTOR<STORE, RELATED_ENTITY>,
    keyId: RELATED_KEY_IDS | RELATED_KEY_IDS_ARRAYS,
    keyValue: RELATED_KEY_VALUES | RELATED_KEY_VALUES_ARRAYS,
    decide?: TRANSFORMER<RELATED_ENTITY, TRANSFORMED_RELATED_ENTITY> | HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>,
    ...relations: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>>
): HANDLER_RELATED_ENTITY<STORE, PARENT_ENTITY> {
    let transformer: undefined | TRANSFORMER<RELATED_ENTITY, TRANSFORMED_RELATED_ENTITY>;
    if (isBuiltInSelector<STORE, RELATED_ENTITY>(decide)) {
        relations = [decide, ...relations];
    } else {
        transformer = decide;
    }

    const callback = (
        cachePrefix: string,
        state: STORE,
        cacheRefs: HANDLER_CACHE<STORE, unknown>,
        source: PARENT_ENTITY,
    ) => {
        // a bit magic to relax generic types.
        const sourceKeyIdValue = source[keyId];
        const stateFeature = featureSelector(state);
        const stateItems = stateFeature ? stateFeature.entities : {};

        if (!sourceKeyIdValue) {
            return;
        }

        const relatedIds: Array<ID_TYPES> = [];
        const relatedItems: Array<RELATED_ENTITY> = [];
        const values: ID_TYPES | Array<ID_TYPES> = sourceKeyIdValue;
        if (Array.isArray(values)) {
            relatedIds.push(...values);
        } else {
            relatedIds.push(values);
        }

        for (const id of relatedIds) {
            const cacheRef = cacheRefs.find(
                ([prefix, selector, index]) => prefix === cachePrefix && selector === featureSelector && index === id,
            );
            if (cacheRef) {
                if (cacheRef.length) {
                    relatedItems.push(cacheRef[3] as RELATED_ENTITY);
                }
                continue;
            }

            if (!stateItems[id]) {
                cacheRefs.push([cachePrefix, featureSelector, id, stateItems[id]]);
                continue;
            }

            // we have to clone it because we are going to update it with relations.
            const cacheValue = {...stateItems[id]} as RELATED_ENTITY; // TODO find a better way for the spread.
            if (transformer) {
                // TODO IMPLEMENT
            }
            cacheRefs.push([cachePrefix, featureSelector, id, stateItems[id], cacheValue]);

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
    callback.ngrxEntityRelationShip = 'relatedEntity';

    return callback;
}
