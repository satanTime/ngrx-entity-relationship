import {rootEntities} from '../../../src/lib/rootEntities';
import {rootEntity} from '../../../src/lib/rootEntity';
import {rootEntityFlags} from '../../../src/lib/rootEntityFlags';
import {FEATURE_SELECTOR, HANDLER_ROOT_ENTITY, ID_SELECTOR, ID_TYPES} from '../../../src/lib/types';

describe('rootEntities', () => {
    interface Entity {
        id: string;
        name: string;
        parent?: Entity;
        parentId?: string;
        children?: Array<Entity>;
    }

    afterEach(() => {
        rootEntityFlags.disabled = false;
    });

    it('marks callback with ngrxEntityRelationship key', () => {
        const rootSelector: any = jasmine.createSpy();
        rootSelector.relationships = Symbol();
        rootSelector.collectionSelector = Symbol();
        rootSelector.idSelector = Symbol();
        const actual = rootEntities(rootSelector);
        expect(actual).toEqual(jasmine.any(Function));
        expect(actual.ngrxEntityRelationship).toEqual('rootEntities');
        expect(actual.collectionSelector).toBe(rootSelector.collectionSelector);
        expect(actual.idSelector).toBe(rootSelector.idSelector);
        expect(actual.relationships).toBe(rootSelector.relationships);
    });

    it('returns the same empty array on no ids', () => {
        const selectorRoot = (jasmine.createSpy() as any) as HANDLER_ROOT_ENTITY<{}, Entity, Entity, ID_TYPES>;
        const selector = rootEntities(selectorRoot);

        const actual = selector({}, undefined);
        expect(actual).toEqual([]);
        expect(selector({}, null)).toBe(actual);
    });

    it('returns the same idSelector as rootEntity', () => {
        const selectorRoot = (jasmine.createSpy() as any) as HANDLER_ROOT_ENTITY<{}, Entity, Entity, ID_TYPES>;
        selectorRoot.idSelector = (jasmine.createSpy() as any) as ID_SELECTOR<Entity>;
        const selector = rootEntities(selectorRoot);
        expect(selector.idSelector).toBe(selectorRoot.idSelector);

        const actual = selector({}, undefined);
        expect(actual).toEqual([]);
        expect(selector({}, null)).toBe(actual);
    });

    it('returns the cached value when rootEntityFlags.disabled is true', () => {
        const state = {};
        const selectorRoot: HANDLER_ROOT_ENTITY<typeof state, Entity, Entity, ID_TYPES> &
            jasmine.Spy = jasmine.createSpy() as any;
        const selector = rootEntities(selectorRoot);

        const entity1state1 = (Symbol() as any) as Entity;
        const entity1state2 = (Symbol() as any) as Entity;
        const entity2state1 = (Symbol() as any) as Entity;
        const entity2state2 = (Symbol() as any) as Entity;
        selectorRoot.and.returnValues(
            entity1state1,
            entity2state1,

            entity1state1,
            entity2state2,

            entity1state2,
            entity2state2,
        );

        // first state.
        selectorRoot.calls.reset();
        const actual1 = selector(state, [1, 2]);
        expect(selectorRoot).toHaveBeenCalledTimes(2);
        expect(selectorRoot.calls.argsFor(0)).toEqual([state, 1]);
        expect(selectorRoot.calls.argsFor(1)).toEqual([state, 2]);
        expect(actual1).toEqual([entity1state1, entity2state1]);

        // state has been changed.
        selectorRoot.calls.reset();
        const actual2 = selector(state, [1, 2]);
        expect(selectorRoot).toHaveBeenCalledTimes(2);
        expect(selectorRoot.calls.argsFor(0)).toEqual([state, 1]);
        expect(selectorRoot.calls.argsFor(1)).toEqual([state, 2]);
        expect(actual2).toEqual([entity1state1, entity2state2]);
        expect(actual2).not.toBe(actual1);

        // state has been changed but the selection is disabled.
        selectorRoot.calls.reset();
        rootEntityFlags.disabled = true;
        const actual3 = selector(state, [1, 2]);
        expect(actual3).toBe(actual2);
        expect(selectorRoot).not.toHaveBeenCalled();

        // selection is enabled again.
        selectorRoot.calls.reset();
        rootEntityFlags.disabled = false;
        const actual4 = selector(state, [1, 2]);
        expect(selectorRoot).toHaveBeenCalledTimes(2);
        expect(selectorRoot.calls.argsFor(0)).toEqual([state, 1]);
        expect(selectorRoot.calls.argsFor(1)).toEqual([state, 2]);
        expect(actual4).toEqual([entity1state2, entity2state2]);
        expect(actual4).not.toBe(actual2);
    });

    it('collects only existing entities', () => {
        const state = {};
        const selectorRoot: HANDLER_ROOT_ENTITY<typeof state, Entity, Entity, ID_TYPES> &
            jasmine.Spy = jasmine.createSpy() as any;
        const selector = rootEntities(selectorRoot);

        const entity1 = (Symbol() as any) as Entity;
        const entity2 = (Symbol() as any) as Entity;
        selectorRoot.and.returnValues(
            entity1,
            undefined,

            undefined,
            entity2,

            undefined,
            undefined,

            entity1,
            entity2,
        );

        const actual1 = selector(state, [1, 2]);
        expect(actual1).toEqual([entity1]);

        const actual2 = selector(state, [1, 2]);
        expect(actual2).toEqual([entity2]);

        const actual3 = selector(state, [1, 2]);
        expect(actual3).toEqual([]);

        const actual4 = selector(state, [1, 2]);
        expect(actual4).toEqual([entity1, entity2]);
    });

    it('returns the cached value when entities have not been changed unless the cache release', () => {
        const state = {};
        const selectorRoot: HANDLER_ROOT_ENTITY<typeof state, Entity, Entity, ID_TYPES> &
            jasmine.Spy = jasmine.createSpy() as any;
        selectorRoot.release = jasmine.createSpy('selectorRoot.release');
        const selector = rootEntities(selectorRoot);

        const entity1 = (Symbol() as any) as Entity;
        const entity2 = (Symbol() as any) as Entity;
        selectorRoot.and.returnValues(
            entity1,
            entity2,

            entity1,
            entity2,

            entity1,
            entity2,
        );

        const actual1 = selector(state, [1, 2]);
        expect(actual1).toEqual([entity1, entity2]);

        const actual2 = selector(state, [1, 2]);
        expect(actual2).toBe(actual1);

        selector.release();
        const actual3 = selector(state, [1, 2]);
        expect(actual3).not.toBe(actual2);
        expect(actual3).toEqual(actual2);
    });

    it('detects another selector as the id parameter', () => {
        const state = {};
        const selectorIds = jasmine.createSpy().and.returnValue([1, 2]);
        const selectorRoot = (jasmine.createSpy() as any) as HANDLER_ROOT_ENTITY<
            typeof state,
            Entity,
            Entity,
            ID_TYPES
        >;
        const selector = rootEntities(selectorRoot);
        selector(state, selectorIds);
        expect(selectorIds).toHaveBeenCalledWith(state);
        expect(selectorRoot).toHaveBeenCalledWith(state, 1);
        expect(selectorRoot).toHaveBeenCalledWith(state, 2);
    });

    it('returns an array of transformed entities', () => {
        const state = {};

        const entity1 = Symbol();
        const entity2 = Symbol();

        const funcSelector = (jasmine.createSpy().and.returnValue({
            entities: {
                1: entity1,
                2: entity2,
            },
        }) as any) as FEATURE_SELECTOR<typeof state, Entity>;
        const selectorRoot = rootEntity(funcSelector, () => 'transformed');
        const selector = rootEntities(selectorRoot);

        const actual = selector(state, [1, 2]);
        expect(actual).toEqual(['transformed', 'transformed']);
    });

    it('calls rootEntity.release on own release call', () => {
        const selectorRoot = (jasmine.createSpy() as any) as HANDLER_ROOT_ENTITY<{}, Entity, Entity, ID_TYPES>;
        selectorRoot.release = jasmine.createSpy('selectorRoot.release');

        expect(selectorRoot.release).not.toHaveBeenCalled();
        rootEntities(selectorRoot).release();
        expect(selectorRoot.release).toHaveBeenCalled();
    });
});
