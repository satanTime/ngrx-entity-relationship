---
description: A list of warnings to avoid common issues
---

- The same entity selected directly from the store directly, and selected by a **root selector** are different objects.

  It allows avoiding side effects and circular references

- A **root selector** changes pointers of its entity only in case if the root or related entity has been updated in the store.

  Or if [`release`](../extra/releasing-cache.md) has been called before.

- A value of any related key can be `undefined`.
