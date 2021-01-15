---
description: relationships pipe operator
---

`relationships` is a RxJS pipe operator which is useful when we already have a stream of existing entities
and would like to extend them with relationships.

For that we need:

- the `store` object
- a **root selector** we want to apply
- an observable stream of entities

Let's pretend we have a `user$` stream which emits a user entity time to time.
Then we could extend it with the next operation.

```ts
const userWithRelationships$ = user$.pipe(
  // a user w/o relationships.
  relationships(store, selectUser),
  // now a user w/ relationships.
);
```

The same can be done for a stream that emits an array of users.
In this case the **root selector** for arrays should be used.

```ts
const usersWithRelationships$ = users$.pipe(
  // users w/o relationships.
  relationships(store, selectUsers),
  // now users w/ relationships.
);
```
