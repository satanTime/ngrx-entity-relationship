import {rootEntity} from './rootEntity';
import {FEATURE_SELECTOR, HANDLER_RELATED_ENTITY, HANDLER_ROOT_ENTITY, ID_TYPES, TRANSFORMER} from './types';

export function rootEntitySelector<STORE, ENTITY, TRANSFORMED>(
    featureSelector: FEATURE_SELECTOR<STORE, ENTITY>,
    transformer: TRANSFORMER<ENTITY, TRANSFORMED>,
): (
    ...relations: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>>
) => HANDLER_ROOT_ENTITY<STORE, ENTITY, TRANSFORMED, ID_TYPES>;

export function rootEntitySelector<STORE, ENTITY>(
    featureSelector: FEATURE_SELECTOR<STORE, ENTITY>,
): (...relations: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>>) => HANDLER_ROOT_ENTITY<STORE, ENTITY, ENTITY, ID_TYPES>;

export function rootEntitySelector<STORE, ENTITY, TRANSFORMED>(
    featureSelector: FEATURE_SELECTOR<STORE, ENTITY>,
    transformer?: TRANSFORMER<ENTITY, TRANSFORMED>,
): (
    ...relations: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>>
) => HANDLER_ROOT_ENTITY<STORE, ENTITY, ENTITY | TRANSFORMED, ID_TYPES> {
    function callback(): HANDLER_ROOT_ENTITY<STORE, ENTITY, ENTITY | TRANSFORMED, ID_TYPES> {
        const relations: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>> = [...arguments];
        return transformer
            ? rootEntity(featureSelector, transformer, ...relations)
            : rootEntity(featureSelector, ...relations);
    }
    callback.ngrxEntityRelationship = 'rootEntitySelector';

    return callback;
}
