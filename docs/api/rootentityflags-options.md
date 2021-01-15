---
description: rootEntityFlags options
---

There is a flag `rootEntityFlags.disabled` that may be useful for disabling selectors during updates of entities
in order to avoid unwanted triggers of selectors.
Simply set it to `true` before you start update and back to `false` afterwards.

**When you set it back to `false` you need to shake the store to get updated entities in selectors**.
