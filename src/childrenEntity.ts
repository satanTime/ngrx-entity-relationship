import {FEATURE_SELECTOR, FILTER_PROPS, HANDLER_CACHE, HANDLER_RELATED_ENTITY} from './types';

export function childrenEntity<
    STORE,
    PARENT_ENTITY,
    RELATED_ENTITY,
    RELATED_KEY_IDS extends NonNullable<FILTER_PROPS<RELATED_ENTITY, string | number | undefined | null>>,
    RELATED_KEY_VALUES_ARRAYS extends NonNullable<FILTER_PROPS<PARENT_ENTITY, Array<RELATED_ENTITY> | undefined | null>>
>(
    featureSelector: FEATURE_SELECTOR<STORE, RELATED_ENTITY>,
    keyId: RELATED_KEY_IDS,
    keyValue: RELATED_KEY_VALUES_ARRAYS,
    ...relations: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>>
): HANDLER_RELATED_ENTITY<STORE, PARENT_ENTITY> {
    return (cachePrefix: string, state: STORE, cacheRefs: HANDLER_CACHE<STORE, unknown>, source: PARENT_ENTITY) => {
        // a bit magic to relax generic types.
        const relatedIds: Array<string | number> = [];
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
            const cacheValue = {...stateItems[id]} as RELATED_ENTITY; // TODO find a better way for the spread.
            cacheRefs.push([cachePrefix, featureSelector, id, stateItems[id], cacheValue]);

            let incrementedPrefix = 0;
            for (const relation of relations) {
                incrementedPrefix += 1;
                relation(`${cachePrefix}${incrementedPrefix}`, state, cacheRefs, cacheValue);
            }
            relatedItems.push(cacheValue);
        }

        source[keyValue] = relatedItems as any;
    };
}
