import {EntityState} from '@ngrx/entity';

export type FILTER_PROPS<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
}[keyof Base];
type TYPE_FEATURE_NAME<STORE, ENTITY> = FILTER_PROPS<STORE, EntityState<ENTITY>>;
type TYPE_ENTITY<STORE, FEATURE_NAME extends keyof STORE> = STORE[FEATURE_NAME] extends EntityState<infer U>
  ? U
  : never;
type CACHE<STORE, STORE_KEY extends keyof STORE> = Array<
  [STORE_KEY, string, TYPE_ENTITY<STORE, STORE_KEY>?, TYPE_ENTITY<STORE, STORE_KEY>?]
  >;
type HANDLER_ITEM_ROOT<S, E> = (state: S, id?: string) => E | undefined;
type HANDLER_ITEM_RELATED<S, E> = (state: S, cacheRefs: CACHE<S, keyof S>, source: E) => void;

export const rootEntitySelector = <STORE, FEATURE extends TYPE_FEATURE_NAME<STORE, unknown>>(
  feature: FEATURE,
  ...relations: Array<HANDLER_ITEM_RELATED<STORE, TYPE_ENTITY<STORE, FEATURE>>>
): HANDLER_ITEM_ROOT<STORE, TYPE_ENTITY<STORE, FEATURE>> => {
  const cacheMap = new Map<string, [CACHE<STORE, keyof STORE>, TYPE_ENTITY<STORE, FEATURE>?]>();

  return (
    state: STORE & Record<FEATURE, EntityState<TYPE_ENTITY<STORE, FEATURE>>>,
    id?: string,
  ) => {
    if (!id) {
      return;
    }
    if (typeof feature !== 'string') {
      return;
    }
    if (!cacheMap.has(id)) {
      cacheMap.set(id, [[]]);
    }
    const cacheData = cacheMap.get(id);
    let cacheRefs: CACHE<STORE, keyof STORE> = [];
    let cacheValue: undefined | TYPE_ENTITY<STORE, FEATURE>;
    if (cacheData && cacheData[0]) {
      cacheRefs = cacheData[0];
    }
    if (cacheData && cacheData[1]) {
      cacheValue = cacheData[1];
    }

    // if (state.v2core && state.v2core.flags && state.v2core.flags.selectorsSuspend) {
    //   return cacheValue;
    // }

    if (cacheRefs.length) {
      let cached = true;
      for (const [bucket, itemId, value] of cacheRefs) {
        if (state[bucket].entities[itemId] !== value) {
          cached = false;
          break;
        }
      }
      if (cached) {
        return cacheValue;
      }
      cacheRefs = [];
    }

    if (!state[feature] || !state[feature].entities[id]) {
      cacheRefs.push([feature, id, state[feature].entities[id]]);
      return;
    }

    // cacheValue = classToClass(state[feature].items[id]);
    cacheValue = state[feature].entities[id];
    cacheRefs.push([feature, id, state[feature].entities[id], cacheValue]);
    cacheMap.set(id, [cacheRefs, cacheValue]);

    for (const relation of relations) {
      relation(state, cacheRefs, cacheValue);
    }

    return cacheValue;
  };
};

// export const entitiesSelector = <STORE, FEATURE extends TYPE_FEATURE_NAME<STORE, unknown>>(
//   feature: FEATURE,
//   ...relations: Array<HANDLER_ITEM_RELATED<STORE, TYPE_ENTITY<STORE, FEATURE>>>
// ): HANDLER_ITEM_ROOT<STORE, Array<TYPE_ENTITY<STORE, FEATURE>>> => {
//   const cacheMap = new Map<string, Array<TYPE_ENTITY<STORE, FEATURE>>>();
//
//   const itemSelector = rootItemSelector<STORE, FEATURE>(feature, ...relations);
//
//   return (state: STORE & Record<FEATURE, EntityState<TYPE_ENTITY<STORE, FEATURE>>>, id?: string) => {
//     if (!id) {
//       return;
//     }
//     if (!state[feature] || !state[feature].lists || !state[feature].lists[id]) {
//       return;
//     }
//     if (!cacheMap.has(id)) {
//       cacheMap.set(id, []);
//     }
//     const cacheValue = cacheMap.get(id);
//
//     const value: Array<TYPE_ENTITY<STORE, FEATURE>> = [];
//     for (const itemId of state[feature].lists[id]) {
//       const item = itemSelector(state, itemId);
//       if (!item) {
//         continue;
//       }
//       value.push(item);
//     }
//
//     let index = 0;
//     let equal = cacheValue && value.length === cacheValue.length;
//     for (const item of value) {
//       if (!cacheValue || !cacheValue[index] || cacheValue[index] !== item) {
//         equal = false;
//         break;
//       }
//       index += 1;
//     }
//     if (equal) {
//       return cacheValue;
//     }
//
//     cacheMap.set(id, value);
//     return value;
//   };
// };

export const relatedEntitySelector = <
  STORE,
  FEATURE extends TYPE_FEATURE_NAME<STORE, unknown>,
  PARENT_ENTITY,
  RELATED_ENTITY extends TYPE_ENTITY<STORE, FEATURE>,
  RELATED_KEY_IDS extends NonNullable<FILTER_PROPS<PARENT_ENTITY, string | undefined | null>>,
  RELATED_KEY_IDS_ARRAYS extends NonNullable<FILTER_PROPS<PARENT_ENTITY, Array<string> | undefined | null>>,
  RELATED_KEY_VALUES extends NonNullable<FILTER_PROPS<PARENT_ENTITY, RELATED_ENTITY | undefined | null>>,
  RELATED_KEY_VALUES_ARRAYS extends NonNullable<FILTER_PROPS<PARENT_ENTITY, Array<RELATED_ENTITY> | undefined | null>>
  >(
  feature: FEATURE,
  keyId: RELATED_KEY_IDS | RELATED_KEY_IDS_ARRAYS,
  keyValue: RELATED_KEY_VALUES | RELATED_KEY_VALUES_ARRAYS,
  ...relations: Array<HANDLER_ITEM_RELATED<STORE, TYPE_ENTITY<STORE, FEATURE>>>
): HANDLER_ITEM_RELATED<STORE, PARENT_ENTITY> => {
  return (state: STORE, cacheRefs: CACHE<STORE, keyof STORE>, source: PARENT_ENTITY) => {
    // a bit magic to relax generic types.
    const sourceKeyIdValue = source[keyId];
    const stateFeature: EntityState<RELATED_ENTITY> = state[feature];
    const stateItems = stateFeature ? stateFeature.entities : {};

    if (!sourceKeyIdValue) {
      return;
    }
    if (typeof feature !== 'string') {
      return;
    }

    const relatedIds: Array<string> = [];
    const relatedItems: Array<RELATED_ENTITY> = [];
    const values: string | Array<string> = sourceKeyIdValue;
    if (Array.isArray(values)) {
      relatedIds.push(...values);
    } else {
      relatedIds.push(values);
    }

    for (const id of relatedIds) {
      const cacheRef = cacheRefs.find(([bucket, index]) => bucket === feature && index === id);
      if (cacheRef) {
        if (cacheRef.length) {
          relatedItems.push(cacheRef[3] as RELATED_ENTITY);
        }
        continue;
      }

      if (!stateItems[id]) {
        cacheRefs.push([feature, id, stateItems[id]]);
        continue;
      }
      // const cacheValue = classToClass(stateItems[id]);
      const cacheValue = stateItems[id];
      cacheRefs.push([feature, id, stateItems[id], cacheValue]);
      for (const relation of relations) {
        relation(state, cacheRefs, cacheValue);
      }
      relatedItems.push(cacheValue);
    }

    const isKeyValueArray = (value: unknown, marker: unknown): value is RELATED_KEY_VALUES_ARRAYS => {
      return typeof value === 'string' && Array.isArray(marker);
    };
    const isKeyValueSingle = (value: unknown, marker: unknown): value is RELATED_KEY_VALUES => {
      return typeof value === 'string' && !Array.isArray(marker);
    };

    if (isKeyValueArray(keyValue, source[keyId])) {
      source[keyValue] = relatedItems as PARENT_ENTITY[RELATED_KEY_VALUES_ARRAYS];
    } else if (isKeyValueSingle(keyValue, source[keyId]) && relatedItems) {
      source[keyValue] = relatedItems[0] as PARENT_ENTITY[RELATED_KEY_VALUES];
    }
  };
};
