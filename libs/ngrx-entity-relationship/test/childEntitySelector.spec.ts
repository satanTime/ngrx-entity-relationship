import {childEntitySelector, HANDLER_RELATED_ENTITY} from 'ngrx-entity-relationship';

describe('childEntitySelector', () => {
    interface Entity {
        id: string;
        name: string;
        parentId?: string | number;
        child?: Entity;
    }

    it('marks callback with ngrxEntityRelationship key', () => {
        const actual: any = childEntitySelector<any, any, any, any, any>(jasmine.createSpy(), undefined, undefined);
        expect(actual).toEqual(jasmine.any(Function));
        expect(actual.ngrxEntityRelationship).toEqual('childEntitySelector');
    });

    it('calls childEntity with relations', () => {
        const state = {
            feature: {
                ids: [],
                entities: {},
            },
        };
        const rel1 = (jasmine
            .createSpy('rel1')
            .and.callFake((_1, _2, _3, v) => (v.rel1 = true)) as any) as HANDLER_RELATED_ENTITY<typeof state, Entity>;
        rel1.ngrxEntityRelationship = 'spy';

        const rel2 = (jasmine
            .createSpy('rel2')
            .and.callFake((_1, _2, _3, v) => (v.rel2 = true)) as any) as HANDLER_RELATED_ENTITY<typeof state, Entity>;
        rel2.ngrxEntityRelationship = 'spy';

        const entitySelector = childEntitySelector<typeof state, Entity, Entity, 'parentId', 'child'>(
            v => v.feature,
            'parentId',
            'child',
        );

        const selector = entitySelector(rel1, rel2);

        const entity: Entity = {
            id: 'id1',
            name: 'name1',
        };

        state.feature.entities = {
            ...state.feature.entities,
            id2: {
                id: 'id2',
                name: 'name2',
                parentId: 'id1',
            },
        };

        const cache = new Map();
        selector('', state, cache, entity, selector.idSelector);
        expect(entity.child).toEqual(
            jasmine.objectContaining({
                rel1: true,
                rel2: true,
            } as any),
        );
    });
});
