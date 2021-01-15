---
description: rootEntities function
---

`rootEntities` is a **root selector factory** which helps to fetch an array of entities.
its call produces a **root selector** which can be used with **Redux** and **NGRX**.

```ts
declare function rootEntities(rootSelector);
```

- `rootSelector` - is a **root selector** which has been produced by `rootEntity` function.

```ts
const selectUsers = rootEntities(selectUser);
```
