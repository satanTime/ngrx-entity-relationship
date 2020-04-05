import {childrenEntities} from './childrenEntities';
import {FEATURE_SELECTOR, HANDLER_RELATED_ENTITY, ID_FILTER_PROPS, ID_TYPES} from './types';

export function childrenEntitiesSelector<
    STORE,
    PARENT_ENTITY extends {
        [KEY in RELATED_KEY_VALUES_ARRAYS]?: Array<RELATED_ENTITY>;
    },
    RELATED_ENTITY,
    RELATED_KEY_IDS extends ID_FILTER_PROPS<RELATED_ENTITY, ID_TYPES>,
    RELATED_KEY_VALUES_ARRAYS extends keyof any
>(
    featureSelector: FEATURE_SELECTOR<STORE, RELATED_ENTITY>,
    keyId: RELATED_KEY_IDS,
    keyValue: RELATED_KEY_VALUES_ARRAYS,
): (
    ...relations: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>>
) => HANDLER_RELATED_ENTITY<STORE, PARENT_ENTITY> {
    const callback = (...relations: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>>) =>
        childrenEntities<STORE, PARENT_ENTITY, RELATED_ENTITY, RELATED_KEY_IDS, any>(
            featureSelector,
            keyId,
            keyValue,
            ...relations,
        );
    callback.ngrxEntityRelationship = 'childrenEntitiesSelector';

    return callback;
}
