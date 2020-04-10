import {createEntityAdapter} from '@ngrx/entity';

import {childEntitySelector} from '../src';
import {HANDLER_RELATED_ENTITY} from '../src/types';

describe('childEntitySelector', () => {
    type Entity = {
        id: string;
        name: string;
        parentId?: string | number;
        child?: Entity;
    };

    it('marks callback with ngrxEntityRelationship key', () => {
        const actual = childEntitySelector<any, any, any, any, any>(jasmine.createSpy(), undefined, undefined);
        expect(actual).toEqual(jasmine.any(Function));
        expect(actual).toEqual(
            jasmine.objectContaining({
                ngrxEntityRelationship: 'childEntitySelector',
            }),
        );
    });

    it('calls childEntity with relations', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
        };
        const rel1: HANDLER_RELATED_ENTITY<typeof state, Entity> & jasmine.Spy = <any>jasmine.createSpy('rel1');
        rel1.ngrxEntityRelationship = 'spy';
        rel1.and.callFake((_1, _2, _3, v) => (v.rel1 = true));

        const rel2: HANDLER_RELATED_ENTITY<typeof state, Entity> & jasmine.Spy = <any>jasmine.createSpy('rel2');
        rel2.ngrxEntityRelationship = 'spy';
        rel2.and.callFake((_1, _2, _3, v) => (v.rel2 = true));

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

        const cache = [];
        selector('randChildEntitySelector', state, cache, entity);
        expect(entity.child).toEqual(
            jasmine.objectContaining({
                rel1: true,
                rel2: true,
            }),
        );
    });
});
