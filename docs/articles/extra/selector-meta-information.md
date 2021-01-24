---
title: Selector META information
description: Information about metadata of selectors and how to gather it
sidebar_label: Selector META information
---

Every selector from the library provides information about itself:

- `ngrxEntityRelationship` - name of its function:
  [`rootEntity`](../api/core/rootentity-function.md),
  [`rootEntities`](../api/core/rootentities-function.md),
  [`relatedEntity`](../api/core/relatedentity-function.md),
  [`childEntity`](../api/core/childentity-function.md)
  and [`childrenEntities`](../api/core/childrenentities-function.md).
- `collectionSelector` - the related [**entity state selector**](../api/core/entity-state-selector.md).
- `idSelector` - a function which returns ids of entities.
- `relationships` - an array of passed **relationship selectors**.

There are two more keys in case of **relationship selectors**:

- `keyId` - a name of the keyId field.
- `keyValue` - a name of the keyValue field.
