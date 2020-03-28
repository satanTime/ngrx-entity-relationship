import {childEntity} from './childEntity';
import {
    FEATURE_SELECTOR,
    HANDLER_RELATED_ENTITY,
    ID_FILTER_PROPS,
    ID_TYPES,
    TRANSFORMER,
    VALUES_FILTER_PROPS,
} from './types';

export function childEntitySelector<
    STORE,
    PARENT_ENTITY extends any, // TODO add a proper detection of parent type based on rootEntity.
    RELATED_ENTITY,
    RELATED_KEY_IDS extends ID_FILTER_PROPS<RELATED_ENTITY, ID_TYPES>,
    RELATED_KEY_VALUES extends VALUES_FILTER_PROPS<PARENT_ENTITY, RELATED_ENTITY>,
    TRANSFORMED_RELATED_ENTITY
>(
    featureSelector: FEATURE_SELECTOR<STORE, RELATED_ENTITY>,
    keyId: RELATED_KEY_IDS,
    keyValue: RELATED_KEY_VALUES,
    transformer?: TRANSFORMER<RELATED_ENTITY, TRANSFORMED_RELATED_ENTITY>,
): (
    ...relations: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>>
) => HANDLER_RELATED_ENTITY<STORE, PARENT_ENTITY> {
    const callback = (...relations: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>>) =>
        transformer
            ? childEntity<
                  STORE,
                  PARENT_ENTITY,
                  RELATED_ENTITY,
                  RELATED_KEY_IDS,
                  RELATED_KEY_VALUES,
                  TRANSFORMED_RELATED_ENTITY
              >(featureSelector, keyId, keyValue, transformer, ...relations)
            : childEntity<STORE, PARENT_ENTITY, RELATED_ENTITY, RELATED_KEY_IDS, RELATED_KEY_VALUES>(
                  featureSelector,
                  keyId,
                  keyValue,
                  ...relations,
              );
    callback.ngrxEntityRelationShip = 'childEntitySelector';

    return callback;
}
