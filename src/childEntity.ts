import {
    FEATURE_SELECTOR,
    HANDLER_CACHE,
    HANDLER_RELATED_ENTITY,
    ID_FILTER_PROPS,
    ID_TYPES,
    UNKNOWN,
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
    ...relationships: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>>
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
        let relatedId: undefined | ID_TYPES;
        const stateFeature = funcSelector(state);
        const stateItems = stateFeature ? stateFeature.entities : {};
        for (const stateItem of Object.values(stateItems)) {
            if (!stateItem || stateItem[keyId] !== (source as any).id) {
                continue;
            }
            relatedId = (stateItem as any).id;
            break;
        }
        if (!relatedId) {
            cacheRefs.push([cachePrefix, funcSelector, null, stateItems]);
            return;
        }

        // we have to clone it because we are going to update it with relations.
        const cacheValue = {...stateItems[relatedId]} as RELATED_ENTITY;
        cacheRefs.push([cachePrefix, funcSelector, relatedId, stateItems[relatedId], cacheValue]);

        let incrementedPrefix = 0;
        for (const relationship of relationships) {
            incrementedPrefix += 1;
            relationship(`${cachePrefix}:${incrementedPrefix}`, state, cacheRefs, cacheValue);
        }
        source[keyValue] = (cacheValue as any) as PARENT_ENTITY[RELATED_KEY_VALUES];
    };
    callback.ngrxEntityRelationship = 'childEntity';

    return callback;
}
