[![chat on gitter](https://img.shields.io/gitter/room/satanTime/ngrx-entity-relationship)](https://gitter.im/ngrx-entity-relationship/community)
[![npm version](https://img.shields.io/npm/v/ngrx-entity-relationship)](https://www.npmjs.com/package/ng-mocks)
[![build status](https://circleci.com/gh/satanTime/ngrx-entity-relationship.svg?style=shield)](https://app.circleci.com/pipelines/github/satanTime/ngrx-entity-relationship)
[![coverage status](https://img.shields.io/coveralls/github/satanTime/ngrx-entity-relationship/master)](https://coveralls.io/github/satanTime/ngrx-entity-relationship?branch=master)
[![language grade](https://img.shields.io/lgtm/grade/javascript/g/satanTime/ngrx-entity-relationship)](https://lgtm.com/projects/g/satanTime/ngrx-entity-relationship/context:javascript)

# ORM selectors for redux, @ngrx/entity and @ngrx/data and ease of relationships with entities

`ngrx-entity-relationship` helps to:

- select relational data from **Redux** or **NGRX** stores
- maintain store with normalized entities
- quickly build queries for **GraphQL**

**Important links**

- [Documentation with examples](https://ngrx-entity-relationship.sudo.eu)
- [GitHub repo](https://github.com/satanTime/ngrx-entity-relationship)
- [NPM package](https://www.npmjs.com/package/ngrx-entity-relationship)

* Live [Redux example on StackBlitz](https://stackblitz.com/edit/ngrx-entity-relationship-react?file=src/MyComponent.tsx)
* Live [Redux example on CodeSandbox](https://codesandbox.io/s/github/satanTime/ngrx-entity-relationship-react?file=/src/MyComponent.tsx)
* Live [NGRX example on StackBlitz](https://stackblitz.com/github/satanTime/ngrx-entity-relationship-angular?file=src/app/app.component.ts)
* Live [NGRX example on CodeSandbox](https://codesandbox.io/s/github/satanTime/ngrx-entity-relationship-angular?file=/src/app/app.component.ts)

- [chat on gitter](https://gitter.im/ngrx-entity-relationship/community)
- [ask a question on stackoverflow for Redux solution](https://stackoverflow.com/questions/ask?tags=ngrx-entity-relationship%20ngrx%20angular)
- [ask a question on stackoverflow for NGRX solution](https://stackoverflow.com/questions/ask?tags=ngrx-entity-relationship%20redux%20reactjs)
- [report an issue on GitHub](https://github.com/satanTime/ngrx-entity-relationship/issues/new)

## Very short introduction

The best way is to read [documentation](https://ngrx-entity-relationship.sudo.eu),
but there is an example below for a quick introduction.

If we want to select a user with its company and with the address of the company,
in order that the final object would look like that:

```ts
const user = {
  id: '1',
  firstName: 'John',
  lastName: 'Smith',
  companyId: '1',
  company: {
    id: '1',
    name: 'Magic',
    adminId: '2',
    addressId: '1',
    address: {
      id: '1',
      street: 'Main st.',
      city: 'Town',
      country: 'Land',
    },
  },
};
```

We need to use a selector built by `ngrx-entity-relationship` for **Redux** or **NGRX** like that:

```ts
const selectUser = rootUser(
  relUserCompany(
    relCompanyAddress(),
  ),
);
```

Profit.

## What you could do next

- [watch updates on github](https://github.com/satanTime/ngrx-entity-relationship)
- [give a star](https://github.com/satanTime/ngrx-entity-relationship)
- [share on twitter](https://twitter.com/intent/tweet?text=Check+ngrx-entity-relationship+package&url=https%3A%2F%2Fgithub.com%2FsatanTime%2Fngrx-entity-relationship)

Thank you!
