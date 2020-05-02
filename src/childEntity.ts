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
): HANDLER_RELATED_ENTITY<STORE, PARENT_ENTITY> {
    let relationships: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>> = [...arguments];
    relationships = relationships.slice(3);

    const {collection: collectionSelector, id: idSelector} = normalizeSelector(featureSelector);

    const callback = (
        cacheLevel: string,
        state: STORE,
        cache: CACHE<STORE>,
        source: PARENT_ENTITY,
        idParentSelector: ID_SELECTOR<PARENT_ENTITY>,
    ) => {
        const featureState = collectionSelector(state);
        const parentId = idParentSelector(source);

        let cacheDataLevel = cache.get(cacheLevel);
        if (!cacheDataLevel) {
            cacheDataLevel = new Map();
            cache.set(cacheLevel, cacheDataLevel);
        }

        // maybe we don't need to scan the entities.
        let [idChecks, id]: [CACHE_CHECKS_SET<STORE>, ID_TYPES | undefined] = cacheDataLevel.get(`!${parentId}`) || [
            new Map(),
            undefined,
        ];
        if (!verifyCache(state, idChecks)) {
            id = undefined;
            for (const entity of Object.values(featureState.entities)) {
                if (
                    !entity ||
                    entity[keyId] !== ((parentId as any) as RELATED_ENTITY[RELATED_KEY_IDS]) // todo fix any A8
                ) {
                    continue;
                }
                id = idSelector(entity);
                break;
            }
            idChecks = new Map();
            const idChecksEntities = new Map();
            idChecks.set(collectionSelector, idChecksEntities);
            idChecksEntities.set(null, featureState.entities);
            cacheDataLevel.set(`!${parentId}`, [idChecks, id]);
        }
        if (!id) {
            return `!${parentId}`;
        }

        const cacheHash = `#${id}`;
        let [checks, value]: [CACHE_CHECKS_SET<STORE>, UNKNOWN] = cacheDataLevel.get(cacheHash) || [
            new Map(),
            undefined,
        ];
        if (verifyCache(state, checks)) {
            source[keyValue] = value;
            return cacheHash;
        }

        // building a new value.
        value = undefined;
        checks = new Map();
        const checksEntities = new Map();
        checks.set(collectionSelector, checksEntities);
        checksEntities.set(null, featureState.entities);
        checksEntities.set(id, featureState.entities[id]);

        // we have to clone it because we are going to update it with relations.
        value = {...featureState.entities[id]} as RELATED_ENTITY;

        let cacheRelLevelIndex = 0;
        for (const relationship of relationships) {
            const cacheRelLevel = `${cacheLevel}:${cacheRelLevelIndex}`;
            const cacheRelHash = relationship(cacheRelLevel, state, cache, value, idSelector);
            cacheRelLevelIndex += 1;
            if (cacheRelHash) {
                mergeCache(cache.get(cacheRelLevel)?.get(cacheRelHash)?.[0], checks);
            }
        }
        cacheDataLevel.set(cacheHash, [checks, value]);
        source[keyValue] = value as PARENT_ENTITY[RELATED_KEY_VALUES];
        return cacheHash;
    };
    callback.ngrxEntityRelationship = 'childEntity';
    callback.collectionSelector = collectionSelector;
    callback.idSelector = idSelector;
    callback.relationships = relationships;
    callback.keyId = keyId;
    callback.keyValue = keyValue;
    callback.release = () => {
        for (const relationship of relationships) {
            relationship.release();
        }
    };

    return callback;
}
