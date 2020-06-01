import {rootEntity} from './rootEntity';
import {
    FEATURE_SELECTOR,
    HANDLER_RELATED_ENTITY,
    HANDLER_ROOT_ENTITY,
    ID_TYPES,
    isSelectorMeta,
    TRANSFORMER,
} from './types';

export function rootEntitySelector<STORE, ENTITY, TRANSFORMED>(
    featureSelector: FEATURE_SELECTOR<STORE, ENTITY>,
    transformer: TRANSFORMER<ENTITY, TRANSFORMED>,
    meta: SELECTOR_META,
): (
    metaOrRelationship?: SELECTOR_META | HANDLER_RELATED_ENTITY<STORE, ENTITY>,
    ...relationships: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>>
) => HANDLER_ROOT_ENTITY<STORE, ENTITY, TRANSFORMED, ID_TYPES>;

export function rootEntitySelector<STORE, ENTITY, TRANSFORMED>(
    featureSelector: FEATURE_SELECTOR<STORE, ENTITY>,
    transformer: TRANSFORMER<ENTITY, TRANSFORMED>,
): (
    metaOrRelationship?: SELECTOR_META | HANDLER_RELATED_ENTITY<STORE, ENTITY>,
    ...relationships: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>>
) => HANDLER_ROOT_ENTITY<STORE, ENTITY, TRANSFORMED, ID_TYPES>;

export function rootEntitySelector<STORE, ENTITY>(
    featureSelector: FEATURE_SELECTOR<STORE, ENTITY>,
    meta: SELECTOR_META,
): (
    metaOrRelationship?: SELECTOR_META | HANDLER_RELATED_ENTITY<STORE, ENTITY>,
    ...relationships: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>>
) => HANDLER_ROOT_ENTITY<STORE, ENTITY, ENTITY, ID_TYPES>;

export function rootEntitySelector<STORE, ENTITY>(
    featureSelector: FEATURE_SELECTOR<STORE, ENTITY>,
): (
    metaOrRelationship?: SELECTOR_META | HANDLER_RELATED_ENTITY<STORE, ENTITY>,
    ...relationships: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>>
) => HANDLER_ROOT_ENTITY<STORE, ENTITY, ENTITY, ID_TYPES>;

export function rootEntitySelector<STORE, ENTITY, TRANSFORMED>(
    featureSelector: FEATURE_SELECTOR<STORE, ENTITY>,
    guess1?: SELECTOR_META | TRANSFORMER<ENTITY, TRANSFORMED>,
    guess2?: SELECTOR_META,
): (
    meta?: SELECTOR_META,
    ...relationships: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>>
) => HANDLER_ROOT_ENTITY<STORE, ENTITY, ENTITY | TRANSFORMED, ID_TYPES> {
    function callback(
        metaOverride?: SELECTOR_META,
    ): HANDLER_ROOT_ENTITY<STORE, ENTITY, ENTITY | TRANSFORMED, ID_TYPES> {
        let relationships: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>> = [...arguments];
        const transformer = isSelectorMeta(guess1) ? undefined : guess1;
        let currentMeta = isSelectorMeta(guess1) ? guess1 : guess2;
        if (isSelectorMeta(metaOverride)) {
            currentMeta = metaOverride;
            relationships = relationships.slice(1);
        }
        return transformer && currentMeta
            ? rootEntity(featureSelector, transformer, currentMeta, ...relationships)
            : transformer
            ? rootEntity(featureSelector, transformer, ...relationships)
            : currentMeta
            ? rootEntity(featureSelector, currentMeta, ...relationships)
            : rootEntity(featureSelector, ...relationships);
    }
    callback.ngrxEntityRelationship = 'rootEntitySelector';

    return callback;
}
