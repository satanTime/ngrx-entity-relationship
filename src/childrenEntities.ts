import {
    FEATURE_SELECTOR,
    HANDLER_CACHE,
    HANDLER_RELATED_ENTITY,
    ID_FILTER_PROPS,
    ID_SELECTOR,
    ID_TYPES,
    UNKNOWN,
    VALUES_FILTER_PROPS,
} from './types';
import {normalizeSelector} from './utils';

export function childrenEntities<
    STORE,
    PARENT_ENTITY,
    RELATED_ENTITY,
    RELATED_KEY_IDS extends ID_FILTER_PROPS<RELATED_ENTITY, ID_TYPES>,
    RELATED_KEY_VALUES_ARRAYS extends VALUES_FILTER_PROPS<PARENT_ENTITY, Array<RELATED_ENTITY>>
>(
    featureSelector: FEATURE_SELECTOR<STORE, RELATED_ENTITY>,
    keyId: RELATED_KEY_IDS,
    keyValue: RELATED_KEY_VALUES_ARRAYS,
    ...relationships: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>>
): HANDLER_RELATED_ENTITY<STORE, PARENT_ENTITY> {
    const {collection: funcSelector, id: idSelector} = normalizeSelector(featureSelector);

    const callback = (
        cachePrefix: string,
        state: STORE,
        cacheRefs: HANDLER_CACHE<STORE, UNKNOWN>,
        source: PARENT_ENTITY,
        idParentSelector: ID_SELECTOR<PARENT_ENTITY>,
    ) => {
        // a bit magic to relax generic types.
        const relatedIds: Array<ID_TYPES> = [];
        const stateItems = funcSelector(state).entities;
        for (const stateItem of Object.values(stateItems)) {
            if (!stateItem || stateItem[keyId] !== (idParentSelector(source) as any) /* todo fix any A8 */) {
                continue;
            }
            relatedIds.push(idSelector(stateItem));
        }

        const relatedItems: Array<RELATED_ENTITY> = [];

        for (const id of relatedIds) {
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

        cacheRefs.push([cachePrefix, funcSelector, null, stateItems]);
        source[keyValue] = relatedItems as PARENT_ENTITY[RELATED_KEY_VALUES_ARRAYS];
    };
    callback.ngrxEntityRelationship = 'childrenEntities';
    callback.idSelector = idSelector;

    return callback;
}
