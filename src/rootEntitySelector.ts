import {rootEntity} from './rootEntity';
import {FEATURE_SELECTOR, HANDLER_RELATED_ENTITY, HANDLER_ROOT_ENTITY} from './types';

export function rootEntitySelector<STORE, ENTITY>(
  featureSelector: FEATURE_SELECTOR<STORE, ENTITY>,
): (...relations: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>>) => HANDLER_ROOT_ENTITY<STORE, ENTITY, string | number> {
  return (...relations: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>>) => rootEntity(featureSelector, ...relations);
}
