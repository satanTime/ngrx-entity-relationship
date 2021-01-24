---
title: Fetching data with NGRX effects
description: An example how to use GraphQL with HttpClient or Apollo Service in Angular and NGRX applications
sidebar_label: Fetching via NGRX effects
---

The goal of the article is to demonstrate how to fetch only desired data from **GraphQL** backend with relationships,
and normalize data from the **GraphQL** response in the **NGRX** store via a single action dispatch. 

For that we need:

- the **root selector** [`selectUser`](quick.md) from the previous article
- configured [`ngrxEntityRelationshipReducer`](../../normalization/reducer.md) reducer
- [`toGraphQL`](../../normalization/graph.md) action

For instance, our backend is available at `http://localhost:3000/graphql`,
and we have a **NGRX** effect that listens on the `UserActionTypes.LOAD` action.

In the code below we need to notice 2 things:

- `toGraphQL('users', selectUser)` will generate a **GraphQL** query with all relationships from `selectUser`,
  so if we remove / add relationships in `selectUser`, we do not need to worry about the **GraphQL** query,
  it will be adjusted automatically.

- Thanks to `reduceGraph`, we do not need to worry how to put all the entities from the **GraphQL** response into the **NGRX** store.
  The entities will be normalized and stored in their store nodes respectively.

## HttpClient

We need to send a get http request to our **GraphQL** backend with the `query` parameter,
and its response should be passed into the `reduceGraph` action which we need to dispatch in order to process entities by the reducer.

```ts
@Injectable()
export class EntityEffects {
  @Effect()
  public readonly dataGraph$ = this.actions$.pipe(
    ofType(UserActionTypes.LOAD),
    switchMap(() =>
      this.http
        .get<{data: {users: Array<User>}}>(
          'http://localhost:3000/graphql',
          {
            params: {
              // toGraphQL generates the query
              query: toGraphQL('users', selectUser),
            },
          },
        )
        .pipe(
          // dispatching reduceGraph to reduce the data
          map(response =>
            reduceGraph({
              data: response.data.users,
              selector: selectUser,
            }),
          ),
        ),
    ),
  );

  constructor(
    protected readonly actions$: Actions,
    protected readonly http: HttpClient,
  ) {}
}
```

## Apollo Service

We need to call `.query` method of the **Apollo service**,
and pass there an object with the `query` parameter.
Please notice, that the `query` parameter accepts `toGraphQL` queries only when they are wrapped with the `gql` function. 

Its response should be passed into the `reduceGraph` action which we need to dispatch in order to process entities by the reducer.

```ts
@Injectable()
export class EntityEffects {
  @Effect()
  public readonly dataGraph$ = this.actions$.pipe(
    ofType(UserActionTypes.LOAD),
    switchMap(() =>
      this.apollo
        .query<{users: Array<User>}>({
          // toGraphQL generates the query
          query: gql(toGraphQL('users', selectUser)),
        })
        .pipe(
          // reduces data, requires meta reducer from ngrx-entity-relationship.
          map(response =>
            reduceGraph({
              data: response.data.users,
              selector: selectUser,
            }),
          ),
        ),
    ),
  );

  constructor(
    protected readonly actions$: Actions,
    protected readonly apollo: Apollo,
  ) {}
}
```
