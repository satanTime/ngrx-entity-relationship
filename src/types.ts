import {EntityState} from '@ngrx/entity';
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

export type FEATURE_SELECTOR<S, E> =
    | STORE_SELECTOR<S, EntityState<E>>
    | {
          collection: STORE_SELECTOR<S, EntityState<E>>;
          id: string | number;
      }
    | {
          collection: STORE_SELECTOR<S, EntityState<E>>;
          id: ID_SELECTOR<E>;
      }
    | {
          selectors: {
              selectCollection: STORE_SELECTOR<S, EntityState<E>>;
          };
          selectId?: ID_SELECTOR<E>; // EntityCollectionService doesn't have it but EntityCollectionServiceBase does.
      };

export type HANDLER_CACHE<S, E> = Array<
    // thanks A6 and its TS that we can't use 'ENTITY?'
    | [string, STORE_SELECTOR<S, EntityState<E>>, ID_TYPES | null]
    | [string, STORE_SELECTOR<S, EntityState<E>>, ID_TYPES | null, E]
    | [string, STORE_SELECTOR<S, EntityState<E>>, ID_TYPES | null, E, E]
>;

export type HANDLER_ROOT_ENTITY<S, F, T, I> = {
    (state: S, id: I): undefined | T;
    ngrxEntityRelationship: string;
    idSelector: ID_SELECTOR<F>;
};

export type HANDLER_ROOT_ENTITIES<S, F, T, I> = {
    (state: S, id: Array<I>): Array<T>;
    ngrxEntityRelationship: string;
    idSelector: ID_SELECTOR<F>;
};

export type HANDLER_RELATED_ENTITY<S, E> = {
    (
        cachePrefix: string,
        state: S,
        cacheRefs: HANDLER_CACHE<S, UNKNOWN>,
        source: E,
        sourceIdSelector: ID_SELECTOR<any /* TODO has to be a related entity */>,
    ): void;
    ngrxEntityRelationship: string;
    idSelector: ID_SELECTOR<any /* TODO has to be a related entity */>;
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
