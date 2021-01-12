import {relatedEntitySelector} from '../../../src/lib/relatedEntitySelector';
import {HANDLER_RELATED_ENTITY} from '../../../src/lib/types';

describe('relatedEntitySelector', () => {
    interface Entity {
        id: string;
        name: string;
        parent?: Entity;
        parentId?: string;
        children?: Array<Entity>;
    }

    it('marks callback with ngrxEntityRelationship key', () => {
        const actual: any = relatedEntitySelector<any, any, any, any, any>(jasmine.createSpy(), '', '');
        expect(actual).toEqual(jasmine.any(Function));
        expect(actual.ngrxEntityRelationship).toEqual('relatedEntitySelector');
    });

    it('calls relatedEntity with relations', () => {
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

        const entitySelector = relatedEntitySelector<typeof state, Entity, Entity, 'parentId', 'parent'>(
            v => v.feature,
            'parentId',
            'parent',
        );

        const selector = entitySelector(rel1, rel2);

        const entity: Entity = {
            id: 'id1',
            name: 'name1',
            parentId: 'id2',
        };
        state.feature.entities = {
            ...state.feature.entities,
            id2: {
                id: 'id2',
                name: 'name2',
            },
        };
        selector('randRelatedEntitySelector', state, new Map(), entity, selector.idSelector);
        expect(entity.parent).toEqual(
            jasmine.objectContaining({
                rel1: true,
                rel2: true,
            } as any),
        );
    });
});
