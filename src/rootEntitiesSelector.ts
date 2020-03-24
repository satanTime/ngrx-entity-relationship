import {rootEntities} from './rootEntities';
import {FEATURE_SELECTOR, HANDLER_RELATED_ENTITY, HANDLER_ROOT_ENTITIES} from './types';

export function rootEntitiesSelector<STORE, ENTITY>(
  featureSelector: FEATURE_SELECTOR<STORE, ENTITY>,
): (...relations: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>>) => HANDLER_ROOT_ENTITIES<STORE, ENTITY, string | number> {
  return (...relations: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>>) => rootEntities(featureSelector, ...relations);
}
