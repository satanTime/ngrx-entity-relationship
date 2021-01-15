---
description: Subscriptions with GraphQL, Redux and NGRX
---

`toGraphQL` is not enough to generate a subscription query.
The library provides a helper function called `toSubscription` to solve the issue.

For example

```ts
const query = toSubscription(toGraphQL('users', action.selector));
```

will generate

```graphql
subscription {
  users {
    id
    # ...
  }
}
```

With `Apollo` service, it can be used like that

```ts
apollo.subscribe({
  query: gql(
    toSubscription(
      toGraphQL('users', action.selector),
    ),
  ),
}).subscribe(update => {
  // magic is here.
});
```
