import {Observable} from 'rxjs';

export type UNKNOWN = any;

export type STORE_SELECTOR<T, V> = (state: T) => V;

export type ID_SELECTOR<E> = (entity: E) => ID_TYPES;

export type STORE_INSTANCE<T> = {
    select<K, Props>(mapFn: (state: T, props: Props) => K, props: Props): Observable<K>;
};

export type FILTER_PROPS<Base, Condition> = {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
}[keyof Base];

export type ENTITY_STATE<E> = {
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

export type HANDLER_ROOT_ENTITY<S, F, T, I> = {
    (state: S, id: I): undefined | T;
    ngrxEntityRelationship: string;
    idSelector: ID_SELECTOR<F>;
    release(): void;
};

export type HANDLER_ROOT_ENTITIES<S, F, T, I> = {
    (state: S, id: Array<I>): Array<T>;
    ngrxEntityRelationship: string;
    idSelector: ID_SELECTOR<F>;
    release(): void;
};

export type HANDLER_RELATED_ENTITY<S, E> = {
    (
        cachePrefix: string,
        state: S,
        cacheRefs: CACHE<S>,
        source: E,
        sourceIdSelector: ID_SELECTOR<any /* TODO has to be a related entity */>,
    ): string | undefined;
    ngrxEntityRelationship: string;
    idSelector: ID_SELECTOR<any /* TODO has to be a related entity */>;
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
