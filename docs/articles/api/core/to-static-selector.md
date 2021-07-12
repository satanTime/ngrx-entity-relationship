---
title: toStaticSelector
description: Information about toStaticSelector function and how to bind param to a root selector
sidebar_label: toStaticSelector
---

`toStaticSelector` helps to create a selector function from a root selector.
Its behavior very similar to [`toFactorySelector`](./to-factory-selector.md),
with the difference that the passed params are static and cannot be changed.

This function is useful for NGRX v12 and younger.

```ts
export class MyComponent {
  public readonly users$: Observable<User>;

  private readonly selectCurrentUser =
    toStaticSelector(
      rootUser(
        relUserCompany(
          relCompanyAddress(),
        ),
      ),
      selectCurrentUserId,
    );

  constructor(private store: Store) {
    this.users$ = this.store.select(
      this.selectCurrentUser,
    );
  }
}
```
