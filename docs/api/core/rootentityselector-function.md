---
description: Information about rootEntitySelector function and how to create preconfigured root selector factories based on rootEntity
---

`rootEntitySelector` is a function which creates a predefined **root selector factory**.
Its goal is to simply the process of creating **root selectors** with [`rootEntity`](rootentity-function.md).

```ts
declare function rootEntitySelector(
  entityStateSelector,
  transformer?,
);
```

Its parameters are the same as [`rootEntity`](rootentity-function.md) has, but without relationships.

```ts
const user = rootEntitySelector(selectUserState);

// later.
const user1 = user();

// the same as.
const user2 = rootEntity(selectUserState);
```
