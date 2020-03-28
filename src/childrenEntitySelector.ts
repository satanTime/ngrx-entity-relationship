import {childrenEntity} from './childrenEntity';
import {
    FEATURE_SELECTOR,
    HANDLER_RELATED_ENTITY,
    ID_FILTER_PROPS,
    ID_TYPES,
    TRANSFORMER,
    VALUES_FILTER_PROPS,
} from './types';

export function childrenEntitySelector<
    STORE,
    PARENT_ENTITY extends any, // TODO add a proper detection of parent type based on rootEntity.
    RELATED_ENTITY,
    RELATED_KEY_IDS extends ID_FILTER_PROPS<RELATED_ENTITY, ID_TYPES>,
    RELATED_KEY_VALUES_ARRAYS extends VALUES_FILTER_PROPS<PARENT_ENTITY, Array<RELATED_ENTITY>>,
    TRANSFORMED_RELATED_ENTITY
>(
    featureSelector: FEATURE_SELECTOR<STORE, RELATED_ENTITY>,
    keyId: RELATED_KEY_IDS,
    keyValue: RELATED_KEY_VALUES_ARRAYS,
    transformer?: TRANSFORMER<RELATED_ENTITY, TRANSFORMED_RELATED_ENTITY>,
): (
    ...relations: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>>
) => HANDLER_RELATED_ENTITY<STORE, PARENT_ENTITY> {
    const callback = (...relations: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>>) =>
        transformer
            ? childrenEntity<
                  STORE,
                  PARENT_ENTITY,
                  RELATED_ENTITY,
                  RELATED_KEY_IDS,
                  RELATED_KEY_VALUES_ARRAYS,
                  TRANSFORMED_RELATED_ENTITY
              >(featureSelector, keyId, keyValue, transformer, ...relations)
            : childrenEntity<STORE, PARENT_ENTITY, RELATED_ENTITY, RELATED_KEY_IDS, RELATED_KEY_VALUES_ARRAYS>(
                  featureSelector,
                  keyId,
                  keyValue,
                  ...relations,
              );
    callback.ngrxEntityRelationShip = 'childrenEntitySelector';

    return callback;
}
