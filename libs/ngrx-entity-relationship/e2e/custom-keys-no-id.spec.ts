import {
    ngrxEntityRelationshipReducer,
    reduceGraph,
    relatedEntitySelector,
    rootEntitySelector,
    stateKeys,
} from 'ngrx-entity-relationship';

describe('custom-keys-no-id', () => {
    interface Item {
        id: string;
        name: string;
        parentId?: string;
        parent?: Item;
    }

    const state: {
        records: {
            byId: Record<string, Item | undefined>;
        };
    } = {
        records: {
            byId: {},
        },
    };

    const selectItemsState = (s: typeof state) => s.records;
    const featureSelector = stateKeys(selectItemsState, 'byId');

    const sItem = rootEntitySelector(featureSelector);
    const sItemParent = relatedEntitySelector(featureSelector, 'parentId', 'parent');

    const selector = sItem(sItemParent());

    it('handles custom values correctly', () => {
        const action = reduceGraph({
            data: [
                {
                    id: 'i1',
                    name: '1',
                    parentId: 'i2',
                    parent: {
                        id: 'i2',
                        name: '2',
                    },
                },
            ],
            selector,
        });

        const reducer = ngrxEntityRelationshipReducer<typeof state>(((s: typeof state) => s) as any);
        const testingState = reducer(state, action);

        // data has been reduced.
        expect(testingState).toEqual({
            records: {
                byId: {
                    i1: {
                        id: 'i1',
                        name: '1',
                        parentId: 'i2',
                    },
                    i2: {
                        id: 'i2',
                        name: '2',
                    },
                },
            },
        });

        // data has been reached.
        expect(selector(testingState, 'i1')).toEqual({
            id: 'i1',
            name: '1',
            parentId: 'i2',
            parent: {
                id: 'i2',
                name: '2',
            },
        });
    });
});
