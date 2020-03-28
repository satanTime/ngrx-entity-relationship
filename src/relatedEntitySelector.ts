import {relatedEntity} from './relatedEntity';
import {
    FEATURE_SELECTOR,
    HANDLER_RELATED_ENTITY,
    ID_FILTER_PROPS,
    ID_TYPES,
    TRANSFORMER,
    VALUES_FILTER_PROPS,
} from './types';

export function relatedEntitySelector<
    STORE,
    PARENT_ENTITY extends any, // TODO add a proper detection of parent type based on rootEntity.
    RELATED_ENTITY,
    RELATED_KEY_IDS extends ID_FILTER_PROPS<PARENT_ENTITY, ID_TYPES>,
    RELATED_KEY_IDS_ARRAYS extends ID_FILTER_PROPS<PARENT_ENTITY, Array<ID_TYPES>>,
    RELATED_KEY_VALUES extends VALUES_FILTER_PROPS<PARENT_ENTITY, RELATED_ENTITY>,
    RELATED_KEY_VALUES_ARRAYS extends VALUES_FILTER_PROPS<PARENT_ENTITY, Array<RELATED_ENTITY>>,
    TRANSFORMED_RELATED_ENTITY
>(
    featureSelector: FEATURE_SELECTOR<STORE, RELATED_ENTITY>,
    keyId: RELATED_KEY_IDS | RELATED_KEY_IDS_ARRAYS,
    keyValue: RELATED_KEY_VALUES | RELATED_KEY_VALUES_ARRAYS,
    transformer?: TRANSFORMER<RELATED_ENTITY, TRANSFORMED_RELATED_ENTITY>,
): (
    ...relations: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>>
) => HANDLER_RELATED_ENTITY<STORE, PARENT_ENTITY> {
    const callback = (...relations: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>>) =>
        transformer
            ? relatedEntity<
                  STORE,
                  PARENT_ENTITY,
                  RELATED_ENTITY,
                  RELATED_KEY_IDS,
                  RELATED_KEY_IDS_ARRAYS,
                  RELATED_KEY_VALUES,
                  RELATED_KEY_VALUES_ARRAYS,
                  TRANSFORMED_RELATED_ENTITY
              >(featureSelector, keyId, keyValue, transformer, ...relations)
            : relatedEntity<
                  STORE,
                  PARENT_ENTITY,
                  RELATED_ENTITY,
                  RELATED_KEY_IDS,
                  RELATED_KEY_IDS_ARRAYS,
                  RELATED_KEY_VALUES,
                  RELATED_KEY_VALUES_ARRAYS
              >(featureSelector, keyId, keyValue, ...relations);
    callback.ngrxEntityRelationShip = 'relatedEntitySelector';

    return callback;
}
