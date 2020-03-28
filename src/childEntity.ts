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

export function childEntity<
    STORE,
    PARENT_ENTITY,
    RELATED_ENTITY,
    RELATED_KEY_IDS extends ID_FILTER_PROPS<RELATED_ENTITY, ID_TYPES>,
    RELATED_KEY_VALUES extends VALUES_FILTER_PROPS<PARENT_ENTITY, RELATED_ENTITY>
>(
    featureSelector: FEATURE_SELECTOR<STORE, RELATED_ENTITY>,
    keyId: RELATED_KEY_IDS,
    keyValue: RELATED_KEY_VALUES,
    ...relations: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>>
): HANDLER_RELATED_ENTITY<STORE, PARENT_ENTITY>;
export function childEntity<
    STORE,
    PARENT_ENTITY,
    RELATED_ENTITY,
    RELATED_KEY_IDS extends ID_FILTER_PROPS<RELATED_ENTITY, ID_TYPES>,
    RELATED_KEY_VALUES extends VALUES_FILTER_PROPS<PARENT_ENTITY, RELATED_ENTITY>
>(
    featureSelector: FEATURE_SELECTOR<STORE, RELATED_ENTITY>,
    keyId: RELATED_KEY_IDS,
    keyValue: RELATED_KEY_VALUES,
    transformer: TRANSFORMER<RELATED_ENTITY>,
    ...relations: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>>
): HANDLER_RELATED_ENTITY<STORE, PARENT_ENTITY>;
export function childEntity<
    STORE,
    PARENT_ENTITY,
    RELATED_ENTITY,
    RELATED_KEY_IDS extends ID_FILTER_PROPS<RELATED_ENTITY, ID_TYPES>,
    RELATED_KEY_VALUES extends VALUES_FILTER_PROPS<PARENT_ENTITY, RELATED_ENTITY>
>(
    featureSelector: FEATURE_SELECTOR<STORE, RELATED_ENTITY>,
    keyId: RELATED_KEY_IDS,
    keyValue: RELATED_KEY_VALUES,
    decide?: TRANSFORMER<RELATED_ENTITY> | HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>,
    ...relations: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>>
): HANDLER_RELATED_ENTITY<STORE, PARENT_ENTITY> {
    let transformer: undefined | TRANSFORMER<RELATED_ENTITY>;
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
        const relatedIds: Array<ID_TYPES> = [];
        const stateFeature = featureSelector(state);
        const stateItems = stateFeature ? stateFeature.entities : {};
        for (const stateItem of Object.values(stateItems)) {
            if (!stateItem || stateItem[keyId] !== (source as any).id) {
                continue;
            }
            relatedIds.push((stateItem as any).id);
        }

        const relatedItems: Array<RELATED_ENTITY> = [];

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
            const cacheValue = transformer
                ? transformer(stateItems[id] as RELATED_ENTITY)
                : ({...stateItems[id]} as RELATED_ENTITY);

            cacheRefs.push([cachePrefix, featureSelector, id, stateItems[id], cacheValue]);

            let incrementedPrefix = 0;
            for (const relation of relations) {
                incrementedPrefix += 1;
                relation(`${cachePrefix}${incrementedPrefix}`, state, cacheRefs, cacheValue);
            }
            relatedItems.push(cacheValue);
        }

        source[keyValue] = relatedItems[0] as any;
    };
    callback.ngrxEntityRelationship = 'childEntity';

    return callback;
}
