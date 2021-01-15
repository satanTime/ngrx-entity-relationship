---
description: Gathering information about selectors
---

Besides the `release` function, every selector from the library provides information about itself:

- `ngrxEntityRelationship` - name of its function: `rootEntity`, `rootEntities`, `relatedEntity`, `childEntity` and `childrenEntities`.
- `collectionSelector` - the related entity state selector.
- `idSelector` - a function which returns ids of entities.
- `relationships` - an array of passed **relationship selectors**.

There are two more keys in case of **relationship selectors**:

- `keyId` - a name of the keyId field.
- `keyValue` - a name of the keyValue field.
