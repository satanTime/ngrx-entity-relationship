import {Observable} from 'rxjs';

declare global {
    // tslint:disable-next-line:class-name
    export interface SELECTOR_META {
        flatKey?: string;
    }
}

export type UNKNOWN = any;

export type STORE_SELECTOR<T, V> = (state: T) => V;

export type ID_SELECTOR<E> = (entity: E) => ID_TYPES;

export type STORE_INSTANCE<T> = {
    select<K, Props>(mapFn: (state: T, props: Props) => K, props: Props): Observable<K>;
};

export type ACTION = {
    type: string;
};

export type FILTER_PROPS<Base, Condition> = {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
}[keyof Base];

export type ENTITY_STATE<E> = {
    ids: Array<ID_TYPES>;
    entities: {
        [id in ID_TYPES]: E | undefined;
    };
};

export type FEATURE_SELECTOR<S, E> =
    | STORE_SELECTOR<S, ENTITY_STATE<E>>
    | {
          collection: STORE_SELECTOR<S, ENTITY_STATE<E>>;
          id: string | number;
      }
    | {
          collection: STORE_SELECTOR<S, ENTITY_STATE<E>>;
          id: ID_SELECTOR<E>;
      }
    | {
          selectors: {
              selectCollection: STORE_SELECTOR<S, ENTITY_STATE<E>>;
          };
          selectId?: ID_SELECTOR<E>; // EntityCollectionService doesn't have it but EntityCollectionServiceBase does.
      };

export type CACHE_CHECKS = Map<ID_TYPES | null, UNKNOWN>;
export type CACHE_CHECKS_SET<S> = Map<STORE_SELECTOR<S, ENTITY_STATE<UNKNOWN>>, CACHE_CHECKS>;
export type CACHE<S> = Map<string, Map<string | null, [CACHE_CHECKS_SET<S>, UNKNOWN]>>;

export type ENTITY_SELECTOR<S = any, E = any> = {
    ngrxEntityRelationship: string;
    meta: SELECTOR_META;
    collectionSelector: STORE_SELECTOR<S, ENTITY_STATE<E>>;
    idSelector: ID_SELECTOR<E>;
    relationships: Array<HANDLER_RELATED_ENTITY<S, E>>;
};

export type HANDLER_ROOT_ENTITY<S, E, T, I> = ENTITY_SELECTOR<S, E> & {
    (state: S, id: I): undefined | T;
    release(): void;
};

export type HANDLER_ROOT_ENTITIES<S, E, T, I> = ENTITY_SELECTOR<S, E> & {
    (state: S, id: Array<I>): Array<T>;
    release(): void;
};

export type HANDLER_RELATED_ENTITY<S, E> = ENTITY_SELECTOR<S /* TODO has to be a related entity */> & {
    (
        cachePrefix: string,
        state: S,
        cacheRefs: CACHE<S>,
        source: E,
        sourceIdSelector: ID_SELECTOR<any /* TODO has to be a related entity */>,
    ): string | undefined;
    keyId: keyof any;
    keyValue: keyof any;
    release(): void;
};

export type EMPTY_TYPES = undefined | null;

export type ID_TYPES = string | number;

export type ID_FILTER_PROPS<RELATED_ENTITY, TYPES> = NonNullable<FILTER_PROPS<RELATED_ENTITY, TYPES | EMPTY_TYPES>>;

export type VALUES_FILTER_PROPS<PARENT_ENTITY, RELATED_ENTITY> = NonNullable<
    FILTER_PROPS<PARENT_ENTITY, RELATED_ENTITY | EMPTY_TYPES>
>;

export type TRANSFORMER<F, T> = (entity: F) => T;

export const isBuiltInSelector = <S, E>(value: UNKNOWN): value is HANDLER_RELATED_ENTITY<S, E> => {
    return value && value.ngrxEntityRelationship;
};

export const isSelectorMeta = (value: UNKNOWN): value is SELECTOR_META => {
    return typeof value === 'object' && value !== null;
};
