import {relatedEntity} from './relatedEntity';
import {FEATURE_SELECTOR, HANDLER_RELATED_ENTITY, ID_TYPES, TRANSFORMER} from './types';

export function relatedEntitySelector<
    STORE,
    PARENT_ENTITY extends
        | {
              [KEY in RELATED_KEY_IDS | RELATED_KEY_VALUES]?: KEY extends RELATED_KEY_IDS
                  ? ID_TYPES
                  : KEY extends RELATED_KEY_VALUES
                  ? RELATED_ENTITY
                  : never;
          }
        | {
              [KEY in RELATED_KEY_IDS | RELATED_KEY_VALUES]?: KEY extends RELATED_KEY_IDS
                  ? Array<ID_TYPES>
                  : KEY extends RELATED_KEY_VALUES
                  ? Array<RELATED_ENTITY>
                  : never;
          },
    RELATED_ENTITY,
    RELATED_KEY_IDS extends keyof any,
    RELATED_KEY_VALUES extends keyof any
>(
    featureSelector: FEATURE_SELECTOR<STORE, RELATED_ENTITY>,
    keyId: RELATED_KEY_IDS,
    keyValue: RELATED_KEY_VALUES,
    transformer?: TRANSFORMER<RELATED_ENTITY>,
): (
    ...relations: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>>
) => HANDLER_RELATED_ENTITY<STORE, PARENT_ENTITY> {
    const callback = (...relations: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>>) =>
        transformer
            ? relatedEntity<STORE, PARENT_ENTITY, RELATED_ENTITY, any, any, any, any>(
                  featureSelector,
                  keyId,
                  keyValue,
                  transformer,
                  ...relations,
              )
            : relatedEntity<STORE, PARENT_ENTITY, RELATED_ENTITY, any, any, any, any>(
                  featureSelector,
                  keyId,
                  keyValue,
                  ...relations,
              );
    callback.ngrxEntityRelationship = 'relatedEntitySelector';

    return callback;
}
