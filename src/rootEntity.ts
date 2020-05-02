import {rootEntityFlags} from './rootEntityFlags';
import {
    CACHE,
    CACHE_CHECKS_SET,
    FEATURE_SELECTOR,
    HANDLER_RELATED_ENTITY,
    HANDLER_ROOT_ENTITY,
    ID_TYPES,
    isBuiltInSelector,
    TRANSFORMER,
    UNKNOWN,
} from './types';
import {mergeCache, normalizeSelector, verifyCache} from './utils';

export function rootEntity<STORE, ENTITY>(
    featureSelector: FEATURE_SELECTOR<STORE, ENTITY>,
    ...relations: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>>
): HANDLER_ROOT_ENTITY<STORE, ENTITY, ENTITY, ID_TYPES>;
export function rootEntity<STORE, ENTITY, TRANSFORMED>(
    featureSelector: FEATURE_SELECTOR<STORE, ENTITY>,
    transformer: TRANSFORMER<ENTITY, TRANSFORMED>,
    ...relations: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>>
): HANDLER_ROOT_ENTITY<STORE, ENTITY, TRANSFORMED, ID_TYPES>;
export function rootEntity<STORE, ENTITY, TRANSFORMED>(
    featureSelector: FEATURE_SELECTOR<STORE, ENTITY>,
    deside?: TRANSFORMER<ENTITY, TRANSFORMED> | HANDLER_RELATED_ENTITY<STORE, ENTITY>,
): HANDLER_ROOT_ENTITY<STORE, ENTITY, ENTITY | TRANSFORMED, ID_TYPES> {
    let relationships: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>> = [...arguments];
    relationships = relationships.slice(1);

    let transformer: undefined | TRANSFORMER<ENTITY, TRANSFORMED>;
    if (!isBuiltInSelector<STORE, ENTITY>(deside)) {
        transformer = deside;
        relationships = relationships.slice(1);
    }
    const {collection: collectionSelector, id: idSelector} = normalizeSelector(featureSelector);

    const cacheLevel = '0';
    const cache: CACHE<STORE> = new Map();

    const callback = (state: STORE, id: ID_TYPES) => {
        if (!id) {
            return;
        }

        const featureState = collectionSelector(state);
        let cacheDataLevel = cache.get(cacheLevel);
        if (!cacheDataLevel) {
            cacheDataLevel = new Map();
            cache.set(cacheLevel, cacheDataLevel);
        }

        const cacheHash = `#${id}`;
        let [checks, value]: [CACHE_CHECKS_SET<STORE>, UNKNOWN] = cacheDataLevel.get(cacheHash) || [
            new Map(),
            undefined,
        ];
        if (rootEntityFlags.disabled) {
            return value;
        }
        if (verifyCache(state, checks)) {
            return value;
        }

        // building a new value.
        value = undefined;
        checks = new Map();
        const checkIds = new Map();
        checks.set(collectionSelector, checkIds);
        checkIds.set(null, featureState.entities);
        checkIds.set(id, featureState.entities[id]);

        // the entity does not exist.
        if (!featureState.entities[id]) {
            cacheDataLevel.set(cacheHash, [checks, value]);
            return value;
        }

        // we have to clone it because we are going to update it with relations.
        value = {...featureState.entities[id]} as ENTITY;

        let cacheRelLevelIndex = 0;
        for (const relationship of relationships) {
            const cacheRelLevel = `${cacheLevel}:${cacheRelLevelIndex}`;
            const cacheRelHash = relationship(cacheRelLevel, state, cache, value, idSelector);
            cacheRelLevelIndex += 1;
            if (cacheRelHash) {
                mergeCache(cache.get(cacheRelLevel)?.get(cacheRelHash)?.[0], checks);
            }
        }

        value = transformer ? transformer(value) : value;
        cacheDataLevel.set(cacheHash, [checks, value]);
        return value;
    };
    callback.ngrxEntityRelationship = 'rootEntity';
    callback.collectionSelector = collectionSelector;
    callback.idSelector = idSelector;
    callback.relationships = relationships;
    callback.release = () => {
        cache.clear();
        for (const relationship of relationships) {
            relationship.release();
        }
    };

    return callback;
}
