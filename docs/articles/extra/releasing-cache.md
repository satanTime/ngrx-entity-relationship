---
title: Releasing cache
description: Information how to release cache from root selectors
sidebar_label: Releasing cache
---

Every function of the library which produces selectors returns a shape that has the `release` function.
Its behavior and purpose is the same as
[Memoized Selectors](https://ngrx.io/guide/store/selectors#resetting-memoized-selectors) from `@ngrx/store`.
Once you do not need a selector simply call `release` to reset the cached entity.

```ts
const selectUser = rootEntity(selectUserState);
store
  .select(selectUser, 1)
  .subsribe(user => {
    // ...some activity
    selectUser.release();
  });
```
