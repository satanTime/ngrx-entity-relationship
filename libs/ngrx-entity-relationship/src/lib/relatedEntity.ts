import {
    CACHE,
    CACHE_CHECKS_SET,
    FEATURE_SELECTOR,
    HANDLER_RELATED_ENTITY,
    ID_FILTER_PROPS,
    ID_TYPES,
    isSelectorMeta,
    UNKNOWN,
    VALUES_FILTER_PROPS,
} from './types';
import {argsToArray, mergeCache, normalizeSelector, verifyCache} from './utils';

export function relatedEntity<
    STORE,
    PARENT_ENTITY,
    RELATED_ENTITY,
    RELATED_KEY_IDS extends ID_FILTER_PROPS<PARENT_ENTITY, ID_TYPES> = ID_FILTER_PROPS<PARENT_ENTITY, ID_TYPES>,
    RELATED_KEY_IDS_ARRAYS extends ID_FILTER_PROPS<PARENT_ENTITY, Array<ID_TYPES>> = ID_FILTER_PROPS<
        PARENT_ENTITY,
        Array<ID_TYPES>
    >,
    RELATED_KEY_VALUES extends VALUES_FILTER_PROPS<PARENT_ENTITY, RELATED_ENTITY> = VALUES_FILTER_PROPS<
        PARENT_ENTITY,
        RELATED_ENTITY
    >,
    RELATED_KEY_VALUES_ARRAYS extends VALUES_FILTER_PROPS<PARENT_ENTITY, Array<RELATED_ENTITY>> = VALUES_FILTER_PROPS<
        PARENT_ENTITY,
        Array<RELATED_ENTITY>
    >,
>(
    featureSelector: FEATURE_SELECTOR<STORE, RELATED_ENTITY>,
    keyId: RELATED_KEY_IDS | RELATED_KEY_IDS_ARRAYS,
    keyValue: RELATED_KEY_VALUES | RELATED_KEY_VALUES_ARRAYS,
    metaOrRelationship?: SELECTOR_META | HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>,
    ...relationships: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>>
): HANDLER_RELATED_ENTITY<STORE, PARENT_ENTITY>;

export function relatedEntity<
    STORE,
    PARENT_ENTITY,
    RELATED_ENTITY,
    RELATED_KEY_IDS extends ID_FILTER_PROPS<PARENT_ENTITY, ID_TYPES>,
    RELATED_KEY_IDS_ARRAYS extends ID_FILTER_PROPS<PARENT_ENTITY, Array<ID_TYPES>>,
    RELATED_KEY_VALUES extends VALUES_FILTER_PROPS<PARENT_ENTITY, RELATED_ENTITY>,
    RELATED_KEY_VALUES_ARRAYS extends VALUES_FILTER_PROPS<PARENT_ENTITY, Array<RELATED_ENTITY>>,
>(
    featureSelector: FEATURE_SELECTOR<STORE, RELATED_ENTITY>,
    keyId: RELATED_KEY_IDS | RELATED_KEY_IDS_ARRAYS,
    keyValue: RELATED_KEY_VALUES | RELATED_KEY_VALUES_ARRAYS,
): HANDLER_RELATED_ENTITY<STORE, PARENT_ENTITY> {
    let relationships: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>> = argsToArray(arguments);
    relationships = relationships.slice(3);

    let meta: SELECTOR_META = {};
    if (isSelectorMeta(relationships[0])) {
        meta = relationships[0];
        relationships = relationships.slice(1);
    }

    const {collection: collectionSelector, id: idSelector} = normalizeSelector(featureSelector);
    const emptyResult: Map<UNKNOWN, UNKNOWN> = new Map();

    const callback = (cacheLevel: string, state: STORE, cache: CACHE<STORE>, source: PARENT_ENTITY) => {
        // a bit magic to relax generic types.
        const sourceKeyIdValue = source[keyId];
        if (!sourceKeyIdValue) {
            return;
        }

        const featureState = collectionSelector(state);

        let cacheDataLevel = cache.get(cacheLevel);
        if (!cacheDataLevel) {
            cacheDataLevel = new Map();
            cache.set(cacheLevel, cacheDataLevel);
        }

        const ids: Array<ID_TYPES> = [];
        const values: ID_TYPES | Array<ID_TYPES> = sourceKeyIdValue as any; // Thanks a8.
        if (Array.isArray(values)) {
            for (const id of values) {
                if (id) {
                    ids.push(id);
                }
            }
            if (!ids.length) {
                source[keyValue] = emptyResult.get(values) as PARENT_ENTITY[RELATED_KEY_VALUES] &
                    PARENT_ENTITY[RELATED_KEY_VALUES_ARRAYS];
                if (!source[keyValue]) {
                    source[keyValue] = [] as PARENT_ENTITY[RELATED_KEY_VALUES] &
                        PARENT_ENTITY[RELATED_KEY_VALUES_ARRAYS];
                    emptyResult.set(values, source[keyValue]);
                }
                return;
            }
        } else {
            ids.push(values);
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
        value = undefined;
        checks = new Map();
        const checkIds = new Map();
        checks.set(collectionSelector, checkIds);
        checkIds.set(null, featureState.entities);
        for (const id of ids) {
            checkIds.set(id, featureState.entities[id]);
        }

        const valueEntities = [];
        for (const id of ids) {
            if (!featureState.entities[id]) {
                continue;
            }
            let [entityChecks, entityValue]: [CACHE_CHECKS_SET<STORE>, UNKNOWN] = cacheDataLevel.get(
                `${cacheHash}:${id}`,
            ) || [new Map(), undefined];
            if (verifyCache(state, entityChecks)) {
                // istanbul ignore else
                if (entityValue) {
                    valueEntities.push(entityValue);
                }
                continue;
            }
            // we have to clone it because we are going to update it with relationships.
            entityValue = {...featureState.entities[id]} as RELATED_ENTITY;
            entityChecks = new Map();
            const entityCheckIds = new Map();
            entityChecks.set(collectionSelector, entityCheckIds);
            entityCheckIds.set(null, featureState.entities);
            entityCheckIds.set(id, featureState.entities[id]);

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
            valueEntities.push(entityValue);
        }
        value = Array.isArray(source[keyId]) ? valueEntities : valueEntities[0];
        cacheDataLevel.set(cacheHash, [checks, value]);
        source[keyValue] = value as PARENT_ENTITY[RELATED_KEY_VALUES] & PARENT_ENTITY[RELATED_KEY_VALUES_ARRAYS];
        return cacheHash;
    };
    callback.ngrxEntityRelationship = 'relatedEntity';
    callback.collectionSelector = collectionSelector;
    callback.meta = meta;
    callback.idSelector = idSelector;
    callback.relationships = relationships;
    callback.keyId = keyId;
    callback.keyValue = keyValue;
    callback.release = () => {
        emptyResult.clear();
        for (const relationship of relationships) {
            relationship.release();
        }
    };

    return callback;
}
