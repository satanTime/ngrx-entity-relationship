import {rootEntitySelector} from '../src';
import {ENTITY_STATE, HANDLER_RELATED_ENTITY} from '../src/types';

describe('rootEntitySelector', () => {
    type Entity = {
        id: string;
        name: string;
        parent?: Entity;
        parentId?: string;
        children?: Array<Entity>;
    };

    it('marks callback with ngrxEntityRelationship key', () => {
        const actual = rootEntitySelector(jasmine.createSpy());
        expect(actual).toEqual(jasmine.any(Function));
        expect(actual).toEqual(
            jasmine.objectContaining({
                ngrxEntityRelationship: 'rootEntitySelector',
            }),
        );
    });

    it('calls rootEntity with transformer and relations', () => {
        const state: {feature: ENTITY_STATE<Entity>} = {
            feature: {
                entities: {},
            },
        };

        const transformer = jasmine.createSpy('transformer');
        transformer.and.callFake(entity => ({...entity, transformed: true}));

        const rel1: HANDLER_RELATED_ENTITY<typeof state, Entity> & jasmine.Spy = <any>jasmine.createSpy('rel1');
        rel1.ngrxEntityRelationship = 'spy';
        rel1.and.callFake((_1, _2, _3, entity) => (entity.rel1 = true));

        const rel2: HANDLER_RELATED_ENTITY<typeof state, Entity> & jasmine.Spy = <any>jasmine.createSpy('rel2');
        rel2.ngrxEntityRelationship = 'spy';
        rel2.and.callFake((_1, _2, _3, entity) => (entity.rel2 = true));

        const entitySelector = rootEntitySelector<
            typeof state,
            Entity,
            {
                rel1: true;
                rel2: true;
                transformed: true;
            }
        >(v => v.feature, transformer);

        const selector = entitySelector(rel1, rel2);

        state.feature.entities = {
            ...state.feature.entities,
            id1: {
                id: 'id1',
                name: 'name1',
            },
        };
        const actual = selector(state, 'id1');
        expect(actual).toEqual(
            jasmine.objectContaining({
                rel1: true,
                rel2: true,
                transformed: true,
            }),
        );
    });

    it('calls rootEntity with transformer to a different type', () => {
        const state: {feature: ENTITY_STATE<Entity>} = {
            feature: {
                entities: {},
            },
        };

        const transformer = () => 'transformed';

        const entitySelector = rootEntitySelector<typeof state, Entity, string>(v => v.feature, transformer);

        const selector = entitySelector();

        state.feature.entities = {
            ...state.feature.entities,
            id1: {
                id: 'id1',
                name: 'name1',
            },
        };
        const actual = selector(state, 'id1');
        expect(actual).toBe('transformed');
    });

    it('calls rootEntity with relations only', () => {
        const state: {feature: ENTITY_STATE<Entity>} = {
            feature: {
                entities: {},
            },
        };

        const rel1: HANDLER_RELATED_ENTITY<typeof state, Entity> & jasmine.Spy = <any>jasmine.createSpy('rel1');
        rel1.ngrxEntityRelationship = 'spy';
        rel1.and.callFake((_1, _2, _3, entity) => (entity.rel1 = true));

        const rel2: HANDLER_RELATED_ENTITY<typeof state, Entity> & jasmine.Spy = <any>jasmine.createSpy('rel2');
        rel2.ngrxEntityRelationship = 'spy';
        rel2.and.callFake((_1, _2, _3, entity) => (entity.rel2 = true));

        const entitySelector = rootEntitySelector<typeof state, Entity>(v => v.feature);

        const selector = entitySelector(rel1, rel2);

        state.feature.entities = {
            ...state.feature.entities,
            id1: {
                id: 'id1',
                name: 'name1',
            },
        };
        const actual = selector(state, 'id1');
        expect(actual).toEqual(
            jasmine.objectContaining({
                rel1: true,
                rel2: true,
            }),
        );
    });
});
