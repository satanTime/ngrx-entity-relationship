---
description: Mutations with GraphQL, Redux and NGRX
---

`toGraphQL` is not enough to generate a mutation query.
The library provides a helper function called `toMutation` which solves the issue.

For example

```ts
const query = toMutation(
  toGraphQL(
    'updateUser',
    {
      id: 'id1',
      data: {
        firstName: 'updatedFirstName',
        lastName: 'lastFirstName',
      },
    },
    action.selector,
  ),
);
```

will generate

```graphql
mutation {
  updateUser(
    id: "id1"
    data: {
      firstName: "updatedFirstName",
      lastName: "lastFirstName"
    }
  ) {
    id
    # and all other fields with relationships.
  }
}
```

With `Apollo` service, it can be used like that

```ts
apollo.mutate({
  mutation: gql(
    toMutation(
      toGraphQL(
        'updateUser',
        {
          id: 'id1',
          data: {
            firstName: 'updatedFirstName',
            lastName: 'lastFirstName',
          },
        },
        action.selector,
      ),
    ),
  ),
}).subscribe(update => {
  // magic is here.
});
```
