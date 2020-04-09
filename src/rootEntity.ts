import {rootEntityFlags} from './rootEntityFlags';
import {
    FEATURE_SELECTOR,
    HANDLER_CACHE,
    HANDLER_RELATED_ENTITY,
    HANDLER_ROOT_ENTITY,
    ID_TYPES,
    isBuiltInSelector,
    TRANSFORMER,
    UNKNOWN,
} from './types';

export function rootEntity<STORE, ENTITY>(
    featureSelector: FEATURE_SELECTOR<STORE, ENTITY>,
    ...relations: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>>
): HANDLER_ROOT_ENTITY<STORE, ENTITY, ID_TYPES>;
export function rootEntity<STORE, ENTITY>(
    featureSelector: FEATURE_SELECTOR<STORE, ENTITY>,
    transformer: TRANSFORMER<ENTITY>,
    ...relations: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>>
): HANDLER_ROOT_ENTITY<STORE, ENTITY, ID_TYPES>;
export function rootEntity<STORE, ENTITY>(
    featureSelector: FEATURE_SELECTOR<STORE, ENTITY>,
    deside?: TRANSFORMER<ENTITY> | HANDLER_RELATED_ENTITY<STORE, ENTITY>,
    ...relationships: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>>
): HANDLER_ROOT_ENTITY<STORE, ENTITY, ID_TYPES> {
    let transformer: undefined | TRANSFORMER<ENTITY>;
    if (isBuiltInSelector<STORE, ENTITY>(deside)) {
        relationships = [deside, ...relationships];
    } else {
        transformer = deside;
    }
    const funcSelector =
        typeof featureSelector === 'function' ? featureSelector : featureSelector.selectors.selectCollection;

    const cacheMap = new Map<ID_TYPES, [HANDLER_CACHE<STORE, UNKNOWN>, UNKNOWN?]>();

    const callback = (state: STORE, id: ID_TYPES) => {
        const cacheData = cacheMap.get(id);
        let cacheRefs: HANDLER_CACHE<STORE, UNKNOWN> = [];
        let cacheValue: undefined | ENTITY;
        if (cacheData && cacheData[0]) {
            cacheRefs = cacheData[0];
        }
        if (cacheData && cacheData[1]) {
            cacheValue = cacheData[1] as ENTITY;
        }

        if (rootEntityFlags.disabled) {
            return cacheValue;
        }

        if (cacheRefs.length) {
            let cached = true;
            for (const [, selector, itemId, value] of cacheRefs) {
                if (!itemId && selector(state).entities !== value) {
                    cached = false;
                    break;
                }
                if (itemId && selector(state).entities[itemId] !== value) {
                    cached = false;
                    break;
                }
            }
            if (cached) {
                return cacheValue;
            }
            cacheRefs = [];
        }

        const featureState = funcSelector(state);
        if (!featureState || !featureState.entities[id]) {
            cacheRefs.push(['', funcSelector, id, featureState.entities[id]]);
            return;
        }

        // we have to clone it because we are going to update it with relations.
        cacheValue = {...featureState.entities[id]} as ENTITY;

        let incrementedPrefix = 0;
        for (const relationship of relationships) {
            incrementedPrefix += 1;
            relationship(`${incrementedPrefix}`, state, cacheRefs, cacheValue);
        }

        cacheValue = transformer ? transformer(cacheValue) : cacheValue;
        cacheRefs.push(['', funcSelector, id, featureState.entities[id], cacheValue]);
        cacheMap.set(id, [cacheRefs, cacheValue]);

        return cacheValue;
    };
    callback.ngrxEntityRelationship = 'rootEntity';

    return callback;
}
