---
description: rootEntity function
---

`rootEntity` is a **root selector factory**,
its call produces a **root selector** which can be used with **Redux** and **NGRX**.

```ts
declare function rootEntity(
  entityStateSelector,
  transformer?,
  ...relationships
);
```

- `entityStateSelector` - is an **entity state selector** of a desired entity.

- `transformer` - is an optional function which can be useful if we need a post processing transformation,
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
