import { createAction, props } from '@ngrx/store';
import { Update, EntityMap, Predicate } from '@ngrx/entity';

import { User } from './user.model';

export const loadUsers = createAction('[User/API] Load Users', props<{ users: User[] }>());
export const addUser = createAction('[User/API] Add User', props<{ user: User }>());
export const setUser = createAction('[User/API] Set User', props<{ user: User }>());
export const upsertUser = createAction('[User/API] Upsert User', props<{ user: User }>());
export const addUsers = createAction('[User/API] Add Users', props<{ users: User[] }>());
export const upsertUsers = createAction('[User/API] Upsert Users', props<{ users: User[] }>());
export const updateUser = createAction('[User/API] Update User', props<{ user: Update<User> }>());
export const updateUsers = createAction('[User/API] Update Users', props<{ users: Update<User>[] }>());
export const mapUsers = createAction('[User/API] Map Users', props<{ entityMap: EntityMap<User> }>());
export const deleteUser = createAction('[User/API] Delete User', props<{ id: string }>());
export const deleteUsers = createAction('[User/API] Delete Users', props<{ ids: string[] }>());
export const deleteUsersByPredicate = createAction('[User/API] Delete Users By Predicate', props<{ predicate: Predicate<User> }>());
export const clearUsers = createAction('[User/API] Clear Users');
