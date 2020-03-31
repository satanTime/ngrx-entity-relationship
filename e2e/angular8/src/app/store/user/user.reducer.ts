import {Action, createReducer, on} from '@ngrx/store';
import {EntityState, EntityAdapter, createEntityAdapter} from '@ngrx/entity';
import {User} from './user.model';
import * as UserActions from './user.actions';

export interface State extends EntityState<User> {
    // additional entities state properties
    selectedUserId: number | null;
}

export const adapter: EntityAdapter<User> = createEntityAdapter<User>();

export const initialState: State = adapter.getInitialState({
    // additional entity state properties
    selectedUserId: null,
});

const userReducer = createReducer(
    initialState,
    on(UserActions.addUser, (state, {user}) => {
        return adapter.addOne(user, state);
    }),
    on(UserActions.setUser, (state, {user}) => {
        return adapter.upsertOne(user, state);
    }),
    on(UserActions.upsertUser, (state, {user}) => {
        return adapter.upsertOne(user, state);
    }),
    on(UserActions.addUsers, (state, {users}) => {
        return adapter.addMany(users, state);
    }),
    on(UserActions.upsertUsers, (state, {users}) => {
        return adapter.upsertMany(users, state);
    }),
    on(UserActions.updateUser, (state, {user}) => {
        return adapter.updateOne(user, state);
    }),
    on(UserActions.updateUsers, (state, {users}) => {
        return adapter.updateMany(users, state);
    }),
    on(UserActions.mapUsers, (state, {entityMap}) => {
        return adapter.map(entityMap, state);
    }),
    on(UserActions.deleteUser, (state, {id}) => {
        return adapter.removeOne(id, state);
    }),
    on(UserActions.deleteUsers, (state, {ids}) => {
        return adapter.removeMany(ids, state);
    }),
    on(UserActions.deleteUsersByPredicate, (state, {predicate}) => {
        return adapter.removeMany(predicate, state);
    }),
    on(UserActions.loadUsers, (state, {users}) => {
        return adapter.addAll(users, state);
    }),
    on(UserActions.clearUsers, state => {
        return adapter.removeAll({...state, selectedUserId: null});
    }),
);

export function userReducerFunc(state: State | undefined, action: Action) {
    return userReducer(state, action);
}

export const getSelectedUserId = (state: State) => state.selectedUserId;

// get the selectors
const {selectIds, selectEntities, selectAll, selectTotal} = adapter.getSelectors();

// select the array of user ids
export const selectUserIds = selectIds;

// select the dictionary of user entities
export const selectUserEntities = selectEntities;

// select the array of users
export const selectAllUsers = selectAll;

// select the total user count
export const selectUserTotal = selectTotal;
