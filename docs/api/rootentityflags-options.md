---
description: Special options in rootEntityFlags for more precise behavior
---

There is a flag `rootEntityFlags.disabled` that may be useful to disable selectors during updates of entities
in order to avoid unwanted triggers of them.
Simply set it to `true` before you start an update and back to `false` afterwards.

**When you set it back to `false` you need to shake the store to get updated entities in related selectors**.
