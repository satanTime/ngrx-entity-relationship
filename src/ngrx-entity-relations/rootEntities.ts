import {rootEntity} from './rootEntity';
import {FEATURE_SELECTOR, HANDLER_RELATED_ENTITY, HANDLER_ROOT_ENTITIES, HANDLER_ROOT_ENTITY} from './types';

export function rootEntities<
  STORE,
  ENTITY,
>(
  featureSelector: FEATURE_SELECTOR<STORE, ENTITY>,
  ...relations: Array<HANDLER_RELATED_ENTITY<STORE, ENTITY>>
): HANDLER_ROOT_ENTITIES<STORE, ENTITY> {
  const cacheMap = new Map<string, Array<ENTITY>>();
  const itemSelector = rootEntity<STORE, ENTITY>(featureSelector, ...relations);

  return (state: STORE, ids: Array<string>) => {
    const cacheKey = ids.join(',');
    if (!cacheMap.has(cacheKey)) {
      cacheMap.set(cacheKey, []);
    }
    const cacheValue = cacheMap.get(cacheKey);

    const value: Array<ENTITY> = [];
    for (const itemId of ids) {
      const item = itemSelector(state, itemId);
      if (!item) {
        continue;
      }
      value.push(item);
    }

    let index = 0;
    let equal = cacheValue && value.length === cacheValue.length;
    for (const item of value) {
      if (!cacheValue || !cacheValue[index] || cacheValue[index] !== item) {
        equal = false;
        break;
      }
      index += 1;
    }
    if (equal) {
      return cacheValue;
    }

    cacheMap.set(cacheKey, value);
    return value;
  };
}
