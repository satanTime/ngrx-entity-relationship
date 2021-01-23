---
title: TS typedef
description: Predefined types for typescript to simplify definition of typedef for root selectors
sidebar_label: TS typedef
---

On the one hand, `ngrx-entity-relationship` has rich and complex `typedefs` which allow to notify about issues in
definition of **root selectors** and their **relationships** during transpilation process.

On the other hand, it makes manual definition of `typdefs` for **root selectors** annoying.

## HANDLER_ENTITY vs HANDLER_ROOT_ENTITY

For **root selectors** which select single entities, it is better to use `HANDLER_ENTITY`
instead of `HANDLER_ROOT_ENTITY`:

```ts
const selectUser1: HANDLER_ENTITY<User> = rootEntity(/*...*/);
// instead of
const selectUser2: HANDLER_ROOT_ENTITY<
  StoreState,
  User,
  User,
  string
> = rootEntity(/*...*/);
```

## HANDLER_ENTITIES vs HANDLER_ROOT_ENTITIES

For **root selectors** which select arrays of entities, it is better to use `HANDLER_ENTITIES`
instead of `HANDLER_ROOT_ENTITIES`:

```ts
const selectUsers1: HANDLER_ENTITIES<User> = rootEntities(/*...*/);
// instead of
const selectUsers2: HANDLER_ROOT_ENTITIES<
  StoreState,
  User,
  User,
  string
> = rootEntities(/*...*/);
```
