module.exports = {
    docs: [
        {
            type: 'doc',
            id: 'index',
        },
        {
            type: 'category',
            collapsed: false,
            label: 'Get started',
            items: [
                'guide/quick',
                {
                    type: 'category',
                    label: 'Normalization',
                    items: [
                        'normalization/reducer',
                        'normalization/linear',
                        'normalization/graph',
                    ],
                },
                {
                    type: 'category',
                    label: 'GraphQL',
                    items: [
                        'guide/graphql/quick',
                        'guide/graphql/ngrx',
                    ],
                },
                'guide/transform-entities',
                'guide/ngrx-data',
            ],
        },
        {
            type: 'category',
            label: 'API',
            items: [
                'api/types',
                {
                    type: 'category',
                    collapsed: false,
                    label: 'Building selectors',
                    items: [
                        'api/core/entity-state-selector',
                        'api/core/rootentity-function',
                        'api/core/rootentityselector-function',
                        'api/core/rootentities-function',
                        'api/core/relatedentity-function',
                        'api/core/relatedentityselector-function',
                        'api/core/childentity-function',
                        'api/core/childentityselector-function',
                        'api/core/childrenentities-function',
                        'api/core/childrenentitiesselector-function',
                    ],
                },
                {
                    type: 'category',
                    label: 'GraphQL',
                    items: [
                        'api/graphql/subscriptions',
                        'api/graphql/mutations',
                        'api/graphql/queries',
                    ],
                },
                {
                    type: 'category',
                    label: 'RxJS',
                    items: [
                        'api/rxjs/relationships',
                    ],
                },
            ],
        },
        {
            type: 'category',
            label: 'Extra',
            items: [
                'extra/releasing-cache',
                'extra/selector-meta-information',
                'api/rootentityflags-options',
                'extra/usage-with-createselector',
            ],
        },
        {
            type: 'category',
            label: 'Troubleshooting',
            items: [
                'help/warnings',
                'help/circular-dependency',
                'help/typedef',
            ],
        },
    ],
};
