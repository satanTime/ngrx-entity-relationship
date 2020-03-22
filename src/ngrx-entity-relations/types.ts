import {EntityState} from '@ngrx/entity';

export type FILTER_PROPS<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
}[keyof Base];

export type FEATURE_SELECTOR<STORE, ENTITY> = (store: STORE) => EntityState<ENTITY>;

export type HANDLER_CACHE<STORE, ENTITY> = Array<[
  string,
  FEATURE_SELECTOR<STORE, ENTITY>,
  string,
  ENTITY?,
  ENTITY?,
]>;

export type HANDLER_ROOT_ENTITY<S, E> = (
  state: S,
  id: string,
) => E | undefined;

export type HANDLER_ROOT_ENTITIES<S, E> = (
  state: S,
  id: Array<string>,
) => Array<E>;

export type HANDLER_RELATED_ENTITY<S, E> = (
  cachePrefix: string,
  state: S,
  cacheRefs: HANDLER_CACHE<S, unknown>,
  source: E,
) => void;
