import {relatedEntity, rootEntities, rootEntity, selectByIds} from 'ngrx-entity-relationship';

describe('select-by-ids', () => {
    interface Item {
        id: string;
        name: string;
        parentId?: string;
        parent?: Item;
    }

    const state: {
        records: {
            ids: Array<string>;
            entities: Record<string, Item | undefined>;
        };
    } = {
        records: {
            ids: ['i1', 'i2'],
            entities: {
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
    };
    const stateSelector = (s: typeof state) => s.records;
    const record = rootEntity(stateSelector, relatedEntity(stateSelector, 'parentId', 'parent'));
    const records = rootEntities(record);

    it('selects right entity', () => {
        const selector = selectByIds(record, 'i2');
        expect(selector(state)).toEqual({
            id: 'i2',
            name: '2',
        });
    });

    it('selects right entities', () => {
        const selector = selectByIds(records, ['i1']);
        expect(selector(state)).toEqual([
            {
                id: 'i1',
                name: '1',
                parentId: 'i2',
                parent: {
                    id: 'i2',
                    name: '2',
                },
            },
        ]);
    });
});
