import {relatedEntity} from './relatedEntity';
import {FEATURE_SELECTOR, HANDLER_RELATED_ENTITY, ID_TYPES, isSelectorMeta, SELECTOR_META} from './types';

export function relatedEntitySelector<
    STORE,
    PARENT_ENTITY extends
        | {
              [KEY in RELATED_KEY_IDS | RELATED_KEY_VALUES]?: KEY extends RELATED_KEY_IDS
                  ? ID_TYPES
                  : KEY extends RELATED_KEY_VALUES
                  ? RELATED_ENTITY | null
                  : never;
          }
        | {
              [KEY in RELATED_KEY_IDS | RELATED_KEY_VALUES]?: KEY extends RELATED_KEY_IDS
                  ? Array<ID_TYPES>
                  : KEY extends RELATED_KEY_VALUES
                  ? Array<RELATED_ENTITY> | null
                  : never;
          },
    RELATED_ENTITY,
    RELATED_KEY_IDS extends keyof any = keyof any,
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

export function relatedEntitySelector<
    STORE,
    PARENT_ENTITY extends
        | {
              [KEY in RELATED_KEY_IDS | RELATED_KEY_VALUES]?: KEY extends RELATED_KEY_IDS
                  ? ID_TYPES
                  : KEY extends RELATED_KEY_VALUES
                  ? RELATED_ENTITY | null
                  : never;
          }
        | {
              [KEY in RELATED_KEY_IDS | RELATED_KEY_VALUES]?: KEY extends RELATED_KEY_IDS
                  ? Array<ID_TYPES>
                  : KEY extends RELATED_KEY_VALUES
                  ? Array<RELATED_ENTITY> | null
                  : never;
          },
    RELATED_ENTITY,
    RELATED_KEY_IDS extends keyof any,
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
        let currentMeta = meta;
        if (isSelectorMeta(relationships[0])) {
            currentMeta = relationships[0];
            relationships = relationships.slice(1);
        }
        return currentMeta
            ? relatedEntity<STORE, PARENT_ENTITY, RELATED_ENTITY, any, any, any, any>(
                  featureSelector,
                  keyId,
                  keyValue,
                  currentMeta,
                  ...relationships,
              )
            : relatedEntity<STORE, PARENT_ENTITY, RELATED_ENTITY, any, any, any, any>(
                  featureSelector,
                  keyId,
                  keyValue,
                  ...relationships,
              );
    }
    callback.ngrxEntityRelationship = 'relatedEntitySelector';

    return callback;
}
