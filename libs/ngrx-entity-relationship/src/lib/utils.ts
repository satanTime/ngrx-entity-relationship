import {
    CACHE_CHECKS,
    CACHE_CHECKS_SET,
    ENTITY_STATE,
    FEATURE_SELECTOR,
    ID_SELECTOR,
    ID_TYPES,
    STORE_SELECTOR,
    UNKNOWN,
} from './types';

export function normalizeSelector<S, E>(
    selector: FEATURE_SELECTOR<S, E>,
): {
    collection: STORE_SELECTOR<S, ENTITY_STATE<E>>;
    id: ID_SELECTOR<E>;
} {
    const local: any = selector;
    if (local === undefined) {
        throw new Error(
            `selector is undefined. Circular dependencies have been detected. You need to put selectors that use ` +
                `nrx-entity-relationship functions into a separate file: ` +
                `https://github.com/satanTime/ngrx-entity-relationship#circular-dependency`,
        );
    }

    let collection: STORE_SELECTOR<S, ENTITY_STATE<E>>;
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
    const checksData: Array<[STORE_SELECTOR<S, ENTITY_STATE<UNKNOWN>>, CACHE_CHECKS]> = [];
    checks.forEach((v, k) => checksData.push([k, v]));
    for (const [checkSelector, checkEntities] of checksData) {
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

        const checkEntitiesData: Array<[ID_TYPES | null, UNKNOWN]> = [];
        checkEntities.forEach((v, k) => checkEntitiesData.push([k, v]));
        for (const [checkId, checkValue] of checkEntitiesData) {
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
    const fromData: Array<[STORE_SELECTOR<S, ENTITY_STATE<UNKNOWN>>, CACHE_CHECKS]> = [];
    from.forEach((v, k) => fromData.push([k, v]));
    for (const [fromSelector, fromEntities] of fromData) {
        const toMap = to.get(fromSelector) || new Map();

        const fromEntitiesData: Array<[ID_TYPES | null, UNKNOWN]> = [];
        fromEntities.forEach((v, k) => fromEntitiesData.push([k, v]));
        for (const [fromId, fromEntity] of fromEntitiesData) {
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

export function argsToArray<T>(args: {length: number} & {[key: number]: T}): Array<T> {
    const result = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < args.length; i += 1) {
        result.push(args[i]);
    }
    return result;
}

export function isObject(value: UNKNOWN): value is object {
    return !!value && typeof value === 'object';
}

export function objectKeys<T extends object, K extends keyof T>(value: T): Array<K> {
    return <Array<K>>Object.keys(value);
}

export function objectValues<T extends object, K extends T[keyof T]>(value: T): Array<K> {
    const keys = objectKeys(value);
    return <Array<K>>keys.map(key => value[key]);
}
