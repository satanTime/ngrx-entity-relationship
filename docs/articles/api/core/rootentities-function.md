---
title: rootEntities
description: Information about rootEntities function and how to create root selectors for arrays of entities
sidebar_label: rootEntities
---

`rootEntities` is a **root selector factory** which helps to fetch an array of entities.
It requires a **root selector factory** and
produces a **root selector** which selects an array of entities.
It can be used with **Redux** and **NGRX**.

```ts
declare function rootEntities(rootSelector);
```

- `rootSelector` - is a **root selector** which has been produced by [`rootEntity`](rootentity-function.md) function.

```ts
const selectUsers = rootEntities(selectUser);
```
