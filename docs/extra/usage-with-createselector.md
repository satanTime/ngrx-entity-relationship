---
description: Usage with createSelector from NGRX
---

Imagine, there are two selectors:

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

- combine them together via `createSelector` function, but it is a bit uncomfortable

  ```ts
  export const selectCurrentUser = createSelector(
    s => s, // selecting the whole store
    selectCurrentUserId, // selecting the id of a current user
    selectUserWithCompany, // selecting the user with desired relationships
  );

  store.select(selectCurrentUser).subscribe(user => {
    // profit
  });
  ```

- pass an id selector as a parameter, quite short

  ```ts
  // selecting the user with desired relationships
  store
    .select(selectUserWithCompany, selectCurrentUserId)
    .subscribe(user => {
      // profit
    });
  ```
