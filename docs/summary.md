# Table of contents

- [Introduction](README.md)

## Links

- [GitHub repo](https://github.com/satanTime/ngrx-entity-relationship)
- [NPM package](https://www.npmjs.com/package/ngrx-entity-relationship)

## Get started

- [Quick guide](guide/quick.md)
- Normalization
  - [Installing reducer](normalization/reducer.md)
  - [Normalizing linear data](normalization/linear.md)
  - [Normalizing graph data](normalization/graph.md)
- GraphQL
  - [Building GraphQL queries](guide/graphql/quick.md)
  - [Fetching via NGRX effects](guide/graphql/ngrx.md)
- [Transform entities](guide/transform-entities.md)
- [@ngrx/data](guide/ngrx-data.md)

## API

- [TS typedef](api/types.md)
- Building selectors
  - [Entity state selector](api/core/entity-state-selector.md)
  - [rootEntity](api/core/rootentity-function.md)
  - [rootEntitySelector](api/core/rootentityselector-function.md)
  - [rootEntities](api/core/rootentities-function.md)
  - [relatedEntity](api/core/relatedentity-function.md)
  - [relatedEntitySelector](api/core/relatedentityselector-function.md)
  - [childEntity](api/core/childentity-function.md)
  - [childEntitySelector](api/core/childentityselector-function.md)
  - [childrenEntities](api/core/childrenentities-function.md)
  - [childrenEntitiesSelector](api/core/childrenentitiesselector-function.md)
- GraphQL
  - [Subscriptions](api/graphql/subscriptions.md)
  - [Mutations](api/graphql/mutations.md)
  - [Queries](api/graphql/queries.md)
- RxJS
  - [relationships pipe operator](api/rxjs/relationships.md)
- Extra
  - [Releasing cache](extra/releasing-cache.md)
  - [Selector META information](extra/selector-meta-information.md)
  - [rootEntityFlags options](api/rootentityflags-options.md)
  - [Usage with createSelector](extra/usage-with-createselector.md)

## Troubleshooting

- [Warnings](help/warnings.md)
- [Circular dependency](help/circular-dependency.md)
- [Expected to have a typedef](help/typedef.md)
