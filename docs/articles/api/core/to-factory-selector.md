---
title: toFactorySelector
description: Information about toFactorySelector function and how to create a factory selector function
sidebar_label: toFactorySelector
---

`toFactorySelector` helps to create a factory selector function from a root selector.
In this case, the produced selector can be passed directly to NGRX `store.select`.

This function is useful for NGRX v12 and younger.

```ts
export class MyComponent {
  public readonly users$: Observable<User>;

  private readonly selectUser =
    toFactorySelector(
      rootUser(
        relUserCompany(
          relCompanyAddress(),
        ),
      ),
    );

  constructor(private store: Store) {
    this.users$ = this.store.select(
      // let's select current user
      this.selectUser(
        selectCurrentUserId,
      ),
    );
  }
}
```
