---
title: Usage with createSelector
description: Information how to create combined selectors via createSelector from NGRX
sidebar_label: Usage with createSelector
---

Imagine, there are two selectors in our **Angular** with **NGRX** app:

- a selector that returns the id of a current user

  ```ts
  export const selectCurrentUserId = createSelector(
    selectUserState,
    feature => feature.currentUserId,
  );
  ```

- a **root selector** for users with relationships

  ```ts
  export const selectUserWithCompany = rootEntity(
    selectUserState,
    relatedEntity(
      selectCompanyFeature,
      'companyId',
      'company',
    ),
  );
  ```

Then we have 3 options:

- usage of `switchMap`, but it is ugly

  ```ts
  // selecting the id of a current user
  store
    .select(selectCurrentUserId)
    .pipe(
      // selecting the user with desired relationships
      switchMap(id => store.select(selectUserWithCompany, id)),
    )
    .subscribe(user => {
      // profit
    });
  ```

- combine the selectors together via `createSelector` function, but it is a bit uncomfortable

  ```ts
  export const selectCurrentUser = createSelector(
    // selecting the whole store
    s => s,
    // selecting the id of a current user
    selectCurrentUserId,
    // selecting the user with desired relationships
    selectUserWithCompany,
  );

  store.select(selectCurrentUser).subscribe(user => {
    // profit
  });
  ```

- pass an id selector as a parameter, what is the best choice and quite short

  ```ts
  // selecting the user with desired relationships
  store
    .select(selectUserWithCompany, selectCurrentUserId)
    .subscribe(user => {
      // profit
    });
  ```
