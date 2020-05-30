import {childEntity} from './childEntity';
import {
    FEATURE_SELECTOR,
    HANDLER_RELATED_ENTITY,
    ID_FILTER_PROPS,
    ID_TYPES,
    isSelectorMeta,
    SELECTOR_META,
} from './types';

export function childEntitySelector<
    STORE,
    PARENT_ENTITY extends {
        [KEY in RELATED_KEY_VALUES]?: RELATED_ENTITY;
    },
    RELATED_ENTITY,
    RELATED_KEY_IDS extends ID_FILTER_PROPS<RELATED_ENTITY, ID_TYPES> = ID_FILTER_PROPS<RELATED_ENTITY, ID_TYPES>,
    RELATED_KEY_VALUES extends keyof any = keyof any
>(
    featureSelector: FEATURE_SELECTOR<STORE, RELATED_ENTITY>,
    keyId: RELATED_KEY_IDS,
    keyValue: RELATED_KEY_VALUES,
    meta?: SELECTOR_META,
): (
    metaOrRelationship?: SELECTOR_META | HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>,
    ...relationships: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>>
) => HANDLER_RELATED_ENTITY<STORE, PARENT_ENTITY>;

export function childEntitySelector<
    STORE,
    PARENT_ENTITY extends {
        [KEY in RELATED_KEY_VALUES]?: RELATED_ENTITY;
    },
    RELATED_ENTITY,
    RELATED_KEY_IDS extends ID_FILTER_PROPS<RELATED_ENTITY, ID_TYPES>,
    RELATED_KEY_VALUES extends keyof any
>(
    featureSelector: FEATURE_SELECTOR<STORE, RELATED_ENTITY>,
    keyId: RELATED_KEY_IDS,
    keyValue: RELATED_KEY_VALUES,
    meta?: SELECTOR_META,
): (
    metaOrRelationship?: SELECTOR_META | HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>,
    ...relationships: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>>
) => HANDLER_RELATED_ENTITY<STORE, PARENT_ENTITY> {
    function callback(): HANDLER_RELATED_ENTITY<STORE, PARENT_ENTITY> {
        let relationships: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>> = [...arguments];
        let currentMeta = isSelectorMeta(meta) ? meta : undefined;
        if (isSelectorMeta(relationships[0])) {
            currentMeta = relationships[0];
            relationships = relationships.slice(1);
        }
        return currentMeta
            ? childEntity<STORE, PARENT_ENTITY, RELATED_ENTITY, RELATED_KEY_IDS, any>(
                  featureSelector,
                  keyId,
                  keyValue,
                  currentMeta,
                  ...relationships,
              )
            : childEntity<STORE, PARENT_ENTITY, RELATED_ENTITY, RELATED_KEY_IDS, any>(
                  featureSelector,
                  keyId,
                  keyValue,
                  ...relationships,
              );
    }
    callback.ngrxEntityRelationship = 'childEntitySelector';

    return callback;
}
