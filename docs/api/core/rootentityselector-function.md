---
description: rootEntitySelector function
---

`rootEntitySelector` is a function which creates a predefined **root selector factory**.
The goal here is to simply the process of creating **root selectors** with [`rootEntity`](#rootentity-function).

```ts
declare function rootEntitySelector(
  entityStateSelector,
  transformer?,
);
```

It's parameters are the same as [`rootEntity`](#rootentity-function) has, but without relationships.

```ts
const user = rootEntitySelector(selectUserState);

// later.
const user1 = user();

// the same as.
const user2 = rootEntity(selectUserState);
```
