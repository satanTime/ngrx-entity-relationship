import {childEntity} from './childEntity';
import {FEATURE_SELECTOR, FILTER_PROPS, HANDLER_RELATED_ENTITY} from './types';

export function childEntitySelector<
    STORE,
    PARENT_ENTITY extends any, // TODO add a proper detection of parent type based on rootEntity.
    RELATED_ENTITY,
    RELATED_KEY_IDS extends NonNullable<FILTER_PROPS<RELATED_ENTITY, string | number | undefined | null>>,
    RELATED_KEY_VALUES extends NonNullable<FILTER_PROPS<PARENT_ENTITY, RELATED_ENTITY | undefined | null>>
>(
    featureSelector: FEATURE_SELECTOR<STORE, RELATED_ENTITY>,
    keyId: RELATED_KEY_IDS,
    keyValue: RELATED_KEY_VALUES,
): (
    ...relations: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>>
) => HANDLER_RELATED_ENTITY<STORE, PARENT_ENTITY> {
    return (...relations: Array<HANDLER_RELATED_ENTITY<STORE, RELATED_ENTITY>>) =>
        childEntity(featureSelector, keyId, keyValue, ...relations);
}
