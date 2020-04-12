import {
    CACHE,
    CACHE_CHECKS_SET,
    FEATURE_SELECTOR,
    HANDLER_RELATED_ENTITY,
    ID_FILTER_PROPS,
    ID_SELECTOR,
    ID_TYPES,
    UNKNOWN,
    VALUES_FILTER_PROPS,
} from './types';
import {mergeCache, normalizeSelector, verifyCache} from './utils';

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
): HANDLER_RELATED_ENTITY<STORE, PARENT_ENTITY>;

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
): HANDLER_RELATED_ENTITY<STORE, PARENT_ENTITY> {
    let relationships: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>> = [...arguments];
    relationships = relationships.slice(3);

    const {collection: funcSelector, id: idSelector} = normalizeSelector(featureSelector);
    const emptyResult: Map<UNKNOWN, UNKNOWN> = new Map();

    const callback = (
        cacheLevel: string,
        state: STORE,
        cache: CACHE<STORE>,
        source: PARENT_ENTITY,
        idParentSelector: ID_SELECTOR<PARENT_ENTITY>,
    ) => {
        const featureState = funcSelector(state);
        const parentId = idParentSelector(source);

        let cacheDataLevel = cache.get(cacheLevel);
        if (!cacheDataLevel) {
            cacheDataLevel = new Map();
            cache.set(cacheLevel, cacheDataLevel);
        }

        // maybe we don't need to scan the entities.
        let [idsChecks, ids]: [CACHE_CHECKS_SET<STORE>, Array<ID_TYPES>] = cacheDataLevel.get(`!${parentId}`) || [
            new Map(),
            [],
        ];
        if (!verifyCache(state, idsChecks)) {
            ids = [];
            for (const entity of Object.values(featureState.entities)) {
                if (
                    !entity ||
                    entity[keyId] !== ((parentId as any) as RELATED_ENTITY[RELATED_KEY_IDS]) // todo fix any A8
                ) {
                    continue;
                }
                const id = idSelector(entity);
                if (id) {
                    ids.push(id);
                }
            }
            idsChecks = new Map();
            idsChecks.set(funcSelector, new Map());
            idsChecks.get(funcSelector)?.set(null, featureState.entities);
            cacheDataLevel.set(`!${parentId}`, [idsChecks, ids]);
        }
        if (!ids.length) {
            source[keyValue] = emptyResult.get(parentId);
            if (!source[keyValue]) {
                source[keyValue] = [] as PARENT_ENTITY[RELATED_KEY_VALUES_ARRAYS];
                emptyResult.set(parentId, source[keyValue]);
            }
            return `!${parentId}`;
        }

        const cacheHash = `#${ids.join(',')}`;
        let [checks, value]: [CACHE_CHECKS_SET<STORE>, UNKNOWN] = cacheDataLevel.get(cacheHash) || [
            new Map(),
            undefined,
        ];
        if (verifyCache(state, checks)) {
            source[keyValue] = value;
            return cacheHash;
        }

        // building a new value.
        value = [];
        checks = new Map();
        checks.set(funcSelector, new Map());
        checks.get(funcSelector)?.set(null, featureState.entities);
        for (const id of ids) {
            checks.get(funcSelector)?.set(id, featureState.entities[id]);
        }

        for (const id of ids) {
            let [entityChecks, entityValue]: [CACHE_CHECKS_SET<STORE>, UNKNOWN] = cacheDataLevel.get(
                `${cacheHash}:${id}`,
            ) || [new Map(), undefined];
            if (verifyCache(state, entityChecks)) {
                if (entityValue) {
                    value.push(entityValue);
                }
                continue;
            }
            // we have to clone it because we are going to update it with relations.
            entityValue = {...featureState.entities[id]} as RELATED_ENTITY;
            entityChecks = new Map();
            entityChecks.set(funcSelector, new Map());
            entityChecks.get(funcSelector)?.set(null, featureState.entities);
            entityChecks.get(funcSelector)?.set(id, featureState.entities[id]);

            let cacheRelLevelIndex = 0;
            for (const relationship of relationships) {
                const cacheRelLevel = `${cacheLevel}:${cacheRelLevelIndex}`;
                const cacheRelHash = relationship(cacheRelLevel, state, cache, entityValue, idSelector);
                cacheRelLevelIndex += 1;
                if (cacheRelHash) {
                    mergeCache(cache.get(cacheRelLevel)?.get(cacheRelHash)?.[0], checks);
                    mergeCache(cache.get(cacheRelLevel)?.get(cacheRelHash)?.[0], entityChecks);
                }
            }
            cacheDataLevel.set(`${cacheHash}:${id}`, [entityChecks, entityValue]);
            value.push(entityValue);
        }
        cacheDataLevel.set(cacheHash, [checks, value]);
        source[keyValue] = value as PARENT_ENTITY[RELATED_KEY_VALUES_ARRAYS];
        return cacheHash;
    };
    callback.ngrxEntityRelationship = 'childrenEntities';
    callback.idSelector = idSelector;
    callback.release = () => {
        emptyResult.clear();
        for (const relationship of relationships || []) {
            relationship.release();
        }
    };

    return callback;
}
