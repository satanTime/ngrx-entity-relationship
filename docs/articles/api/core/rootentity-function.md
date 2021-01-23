---
title: rootEntity
description: Information about rootEntity function and how to create root selectors
sidebar_label: rootEntity
---

`rootEntity` is a **root selector factory**,
its call produces a **root selector** which can be used with **Redux** and **NGRX** in order to select related entities.

```ts
declare function rootEntity(
  entityStateSelector,
  transformer?,
  ...relationships
);
```

- `entityStateSelector` - is an [**entity state selector**](entity-state-selector.md) of a desired entity.

- `transformer` - is an optional function which can be useful if we need a [post processing transformation](../../guide/transform-entities.md),
  for example, to a class instance, basically an entity can be transformed to anything.

  ```ts
  const userClassInstance =
    rootEntity(selector, entity =>
      plainToClass(UserClass, entity),
    );
  // selected entity will be an instance of UserClass.

  const userJsonString =
    rootEntity(
      selector,
      entity => JSON.stringify(entity),
    );
  // selected entity will be a JSON string.
  ```

- `relationships` - is an optional parameter which accepts **relationship selectors** for the root entity.
