import {
    ngrxEntityRelationshipReducer,
    reduceGraph,
    relatedEntitySelector,
    rootEntitySelector,
    stateKeys,
} from 'ngrx-entity-relationship';

describe('custom-keys', () => {
    interface Item {
        id: string;
        name: string;
        parentId?: string;
        parent?: Item;
    }

    const state: {
        records: {
            allIds: Array<string>;
            byId: Record<string, Item | undefined>;
        };
    } = {
        records: {
            allIds: [],
            byId: {},
        },
    };

    const selectItemsState = (s: typeof state) => s.records;
    const featureSelector = stateKeys(selectItemsState, 'byId', 'allIds');

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

        const reducer = ngrxEntityRelationshipReducer<typeof state>(s => s);
        const testingState = reducer(state, action);

        // data has been reduced.
        expect(testingState).toEqual({
            records: {
                allIds: ['i1', 'i2'],
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
