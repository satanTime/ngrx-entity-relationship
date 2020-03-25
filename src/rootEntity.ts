import {rootEntityFlags} from './rootEntityFlags';
import {FEATURE_SELECTOR, HANDLER_CACHE, HANDLER_RELATED_ENTITY, HANDLER_ROOT_ENTITY} from './types';

export function rootEntity<STORE, ENTITY>(
    featureSelector: FEATURE_SELECTOR<STORE, ENTITY>,
    ...relations: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>>
): HANDLER_ROOT_ENTITY<STORE, ENTITY, string | number> {
    const cacheMap = new Map<string | number, [HANDLER_CACHE<STORE, unknown>, unknown?]>();

    return (state: STORE, id: string | number) => {
        const cacheData = cacheMap.get(id);
        let cacheRefs: HANDLER_CACHE<STORE, unknown> = [];
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
                if (selector(state).entities[itemId] !== value) {
                    cached = false;
                    break;
                }
            }
            if (cached) {
                return cacheValue;
            }
            cacheRefs = [];
        }

        const featureState = featureSelector(state);
        if (!featureState || !featureState.entities[id]) {
            cacheRefs.push(['', featureSelector, id, featureState.entities[id]]);
            return;
        }

        // we have to clone it because we are going to update it with relations.
        cacheValue = {...featureState.entities[id]} as ENTITY; // TODO find a better way for the spread.
        cacheRefs.push(['', featureSelector, id, featureState.entities[id], cacheValue]);
        cacheMap.set(id, [cacheRefs, cacheValue]);

        let incrementedPrefix = 0;
        for (const relation of relations) {
            incrementedPrefix += 1;
            relation(`${incrementedPrefix}`, state, cacheRefs, cacheValue);
        }

        return cacheValue;
    };
}
