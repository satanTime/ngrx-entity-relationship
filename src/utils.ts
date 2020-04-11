import {EntityState} from '@ngrx/entity';

import {FEATURE_SELECTOR, ID_SELECTOR, STORE_SELECTOR} from './types';

export function normalizeSelector<S, E>(
    selector: FEATURE_SELECTOR<S, E>,
): {
    collection: STORE_SELECTOR<S, EntityState<E>>;
    id: ID_SELECTOR<E>;
} {
    const local: any = selector;

    let collection: STORE_SELECTOR<S, EntityState<E>>;
    if (typeof local === 'function') {
        collection = local;
    } else if (local.selectors) {
        collection = local.selectors.selectCollection;
    } else {
        collection = local.collection;
    }

    let id: ID_SELECTOR<E>;
    if (typeof local === 'function') {
        id = (v: any) => (v ? v.id : undefined);
    } else if (local.selectId) {
        id = local.selectId;
    } else if (typeof local.id === 'string') {
        id = (v: any) => (v ? v[local.id] : undefined);
    } else if (typeof local.id === 'number') {
        id = (v: any) => (v ? v[local.id] : undefined);
    } else {
        id = local.id;
    }

    return {
        collection,
        id,
    };
}
