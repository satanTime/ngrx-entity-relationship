import {EntityState} from '@ngrx/entity';

import {CACHE_CHECKS_SET, FEATURE_SELECTOR, ID_SELECTOR, STORE_SELECTOR} from './types';

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

export function verifyCache<S>(state: S, checks: CACHE_CHECKS_SET<S>): boolean {
    if (!checks.size) {
        return false;
    }
    for (const [checkSelector, checkEntities] of checks.entries()) {
        if (checkEntities.has(null) && checkSelector(state).entities === checkEntities.get(null)) {
            continue;
        }
        if (
            checkEntities.has(null) &&
            checkSelector(state).entities !== checkEntities.get(null) &&
            checkEntities.size === 1
        ) {
            return false;
        }
        const checkState = checkSelector(state);
        for (const [checkId, checkValue] of checkEntities.entries()) {
            if (checkId === null) {
                continue;
            }
            if (checkState.entities[checkId] !== checkValue) {
                return false;
            }
        }
    }
    return true;
}

export function mergeCache<S>(from: CACHE_CHECKS_SET<S> | undefined, to: CACHE_CHECKS_SET<S>): void {
    if (!from) {
        return;
    }
    for (const [fromSelector, fromEntities] of from.entries()) {
        const toMap = to.get(fromSelector) || new Map();
        for (const [fromId, fromEntity] of fromEntities) {
            if (toMap.has(fromId)) {
                continue;
            }
            toMap.set(fromId, fromEntity);
        }
        if (!to.has(fromSelector)) {
            to.set(fromSelector, toMap);
        }
    }
}
