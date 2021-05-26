import {ENTITY_STATE, ENTITY_STATE_CUSTOM, STORE_SELECTOR} from './types';

export function stateKeys<
    SELECTOR extends STORE_SELECTOR<any, any>,
    STORE extends SELECTOR extends STORE_SELECTOR<infer U, any> ? U : never,
    SLICE extends SELECTOR extends STORE_SELECTOR<any, infer U> ? U : never,
    E_KEY extends keyof SLICE,
    ENTITY extends SLICE extends ENTITY_STATE_CUSTOM<E_KEY, 'ids', infer U> ? U : never,
>(selector: SELECTOR, entitiesKey: E_KEY): STORE_SELECTOR<STORE, ENTITY_STATE<ENTITY>>;

export function stateKeys<
    SELECTOR extends STORE_SELECTOR<any, any>,
    STORE extends SELECTOR extends STORE_SELECTOR<infer U, any> ? U : never,
    SLICE extends SELECTOR extends STORE_SELECTOR<any, infer U> ? U : never,
    E_KEY extends keyof SLICE,
    I_KEY extends keyof SLICE,
    ENTITY extends SLICE extends ENTITY_STATE_CUSTOM<E_KEY, I_KEY, infer U> ? U : never,
>(selector: SELECTOR, entitiesKey: E_KEY, idsKey: I_KEY): STORE_SELECTOR<STORE, ENTITY_STATE<ENTITY>>;

export function stateKeys<
    SELECTOR extends STORE_SELECTOR<any, any>,
    STORE extends SELECTOR extends STORE_SELECTOR<infer U, any> ? U : never,
    SLICE extends SELECTOR extends STORE_SELECTOR<any, infer U> ? U : never,
    E_KEY extends keyof SLICE,
    I_KEY extends keyof SLICE,
    ENTITY extends SLICE extends ENTITY_STATE_CUSTOM<E_KEY, I_KEY, infer U> ? U : never,
>(selector: SELECTOR, entitiesKey: E_KEY, idsKey?: I_KEY): STORE_SELECTOR<STORE, ENTITY_STATE<ENTITY>> {
    const callback: STORE_SELECTOR<STORE, ENTITY_STATE<ENTITY>> = (s: STORE): ENTITY_STATE<ENTITY> => {
        const slice = selector(s);
        return {
            ids: idsKey ? slice[idsKey] : slice.ids,
            entities: slice[entitiesKey],
        };
    };
    callback.idsKey = idsKey;
    callback.entitiesKey = entitiesKey;
    callback.originalSelector = selector;

    return callback;
}
