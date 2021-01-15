---
description: Queries with GraphQL, Redux and NGRX
---

`toGraphQL` is not enough to generate a query with variables.
The library provides a function called `toQuery` which solves the issue.

All [`toQuery`](#queries-with-graphql-redux-and-ngrx),
[`toSubscription`](#subscriptions-with-graphql-redux-and-ngrx)
and [`toMutation`](#mutations-with-graphql-redux-and-ngrx) support variables.
They can be passed as the first parameter.
`toGraphQL` supports `$` to define variables instead of values.

```ts
apollo.mutate({
  // the same for toQuery and toSubscription too.
  mutation: gql(
    toMutation(
      {
        // definition of variables and their types.
        data: 'UpdateUserInput!',
      },
      toGraphQL(
        'updateUser',
        {
          // a normal parameter with its value.
          id: 'id1',
          // under $ parameters and their variables can be defined.
          $: {
            data: '$data',
          },
        },
        action.selector,
      ),
    ),
  ),
  variables: {
    data: {
      firstName: 'updatedFirstName',
      lastName: 'lastFirstName',
    },
  },
}).subscribe(update => {
  // magic is here.
});
```

will generate

```graphql
mutation($data: UpdateUserInput!) {
  updateUser(id: "id1", data: $data) {
    id
    # and all other fields with relationships.
  }
}
```
