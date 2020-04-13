import {relatedEntity} from './relatedEntity';
import {FEATURE_SELECTOR, HANDLER_RELATED_ENTITY, ID_TYPES} from './types';

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
): (
    ...relations: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>>
) => HANDLER_RELATED_ENTITY<STORE, PARENT_ENTITY> {
    function callback(): HANDLER_RELATED_ENTITY<STORE, PARENT_ENTITY> {
        const relations: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>> = [...arguments];
        return relatedEntity<STORE, PARENT_ENTITY, RELATED_ENTITY, any, any, any, any>(
            featureSelector,
            keyId,
            keyValue,
            ...relations,
        );
    }
    callback.ngrxEntityRelationship = 'relatedEntitySelector';

    return callback;
}
