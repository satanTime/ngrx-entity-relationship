---
description: A solution how to fix expected variable-declaration to have a typedef
---

The answer is in [Types](../api/types.md).

There are two common types:
[`HANDLER_ROOT_ENTITY`](../api/types.md#handler_entity-vs-handler_root_entity)
and [`HANDLER_ROOT_ENTITIES`](../api/types.md#handler_entities-vs-handler_root_entities),
but they are complicated and to solve the issue they can be replaced by
[`HANDLER_ENTITY`](../api/types.md#handler_entity-vs-handler_root_entity),
[`HANDLER_ENTITIES`](../api/types.md#handler_entities-vs-handler_root_entities).

```ts
const selectUser: HANDLER_ENTITY<User> = rootEntity(/*...*/);
const selectUsers: HANDLER_ENTITIES<User> = rootEntities(/*...*/);
```
