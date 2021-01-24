---
title: Installing reducer
description: ngrx-entity-relationship provides own reducer and actions to maintain normalized data in Redux and NGRX stores
sidebar_label: Installing reducer
---

All **root selectors** from the library can be used to update the store with data from backend responses.

For that `ngrxEntityRelationshipReducer` should be added as a meta reducer.
It reacts on [`reduceFlat`](linear.md) and [`reduceGraph`](graph.md) actions, and adds / updates their payload in the store.
If the entity exists in the store, then it will be replaced, not merged, unrelated entities will stay as they are.

## Redux

In **React** with **Redux** apps, we need to pass `rootReducer` to `ngrxEntityRelationshipReducer`,
and `ngrxEntityRelationshipReducer` to `createStore`.

```ts
// App.tsx
const store = createStore(
  ngrxEntityRelationshipReducer(
    rootReducer,
  ),
);
```

## NGRX

In **Angular** with **NGRX** apps, we need to provide `ngrxEntityRelationshipReducer` in `metaReducers` for our `StoreModule.forRoot`. 

```ts
// app.module.ts
StoreModule.forRoot(
  {
    /* ... */
  },
  {
    metaReducers: [
      // ...
      ngrxEntityRelationshipReducer, // <- add this
    ],
  },
);
```

---

You can read about different types of actions and how they normalize data in stores in the next sections.
