import {rootEntities, rootEntityFlags} from '../src';
import {HANDLER_ROOT_ENTITY, ID_TYPES} from '../src/types';

describe('rootEntities', () => {
    type Entity = {
        id: string;
        name: string;
        parent?: Entity;
        parentId?: string;
        children?: Array<Entity>;
    };

    afterEach(() => {
        rootEntityFlags.disabled = false;
    });

    it('marks callback with ngrxEntityRelationship key', () => {
        const actual = rootEntities(jasmine.createSpy() as any);
        expect(actual).toEqual(jasmine.any(Function));
        expect(actual).toEqual(
            jasmine.objectContaining({
                ngrxEntityRelationship: 'rootEntities',
            }),
        );
    });

    it('returns the same empty array on no ids', () => {
        const selectorRoot: HANDLER_ROOT_ENTITY<{}, Entity, ID_TYPES> & jasmine.Spy = <any>jasmine.createSpy();
        const selector = rootEntities(selectorRoot);

        const actual = selector({}, undefined);
        expect(actual).toEqual([]);
        expect(selector({}, null)).toBe(actual);
    });

    it('returns the same idSelector as rootEntity', () => {
        const selectorRoot: HANDLER_ROOT_ENTITY<{}, Entity, ID_TYPES> & jasmine.Spy = <any>jasmine.createSpy();
        selectorRoot.idSelector = <any>jasmine.createSpy();
        const selector = rootEntities(selectorRoot);
        expect(selector.idSelector).toBe(selectorRoot.idSelector);

        const actual = selector({}, undefined);
        expect(actual).toEqual([]);
        expect(selector({}, null)).toBe(actual);
    });

    it('returns the cached value when rootEntityFlags.disabled is true', () => {
        const state = {};
        const selectorRoot: HANDLER_ROOT_ENTITY<typeof state, Entity, ID_TYPES> & jasmine.Spy = <any>(
            jasmine.createSpy()
        );
        const selector = rootEntities(selectorRoot);

        const entity1state1 = Symbol();
        const entity1state2 = Symbol();
        const entity2state1 = Symbol();
        const entity2state2 = Symbol();
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
        const selectorRoot: HANDLER_ROOT_ENTITY<typeof state, Entity, ID_TYPES> & jasmine.Spy = <any>(
            jasmine.createSpy()
        );
        const selector = rootEntities(selectorRoot);

        const entity1 = Symbol();
        const entity2 = Symbol();
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

    it('returns the cached value when entities have not been changed', () => {
        const state = {};
        const selectorRoot: HANDLER_ROOT_ENTITY<typeof state, Entity, ID_TYPES> & jasmine.Spy = <any>(
            jasmine.createSpy()
        );
        const selector = rootEntities(selectorRoot);

        const entity1 = Symbol();
        const entity2 = Symbol();
        selectorRoot.and.returnValues(
            entity1,
            entity2,

            entity1,
            entity2,
        );

        const actual1 = selector(state, [1, 2]);
        expect(actual1).toEqual([entity1, entity2]);

        const actual2 = selector(state, [1, 2]);
        expect(actual2).toBe(actual1);
    });
});
