import {rootEntity} from './rootEntity';
import {FEATURE_SELECTOR, HANDLER_RELATED_ENTITY, HANDLER_ROOT_ENTITY, ID_TYPES, TRANSFORMER} from './types';

export function rootEntitySelector<STORE, ENTITY>(
    featureSelector: FEATURE_SELECTOR<STORE, ENTITY>,
    transformer?: TRANSFORMER<ENTITY>,
): (...relations: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>>) => HANDLER_ROOT_ENTITY<STORE, ENTITY, ID_TYPES> {
    const callback = (...relations: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>>) =>
        transformer
            ? rootEntity(featureSelector, transformer, ...relations)
            : rootEntity(featureSelector, ...relations);
    callback.ngrxEntityRelationship = 'rootEntitySelector';

    return callback;
}
