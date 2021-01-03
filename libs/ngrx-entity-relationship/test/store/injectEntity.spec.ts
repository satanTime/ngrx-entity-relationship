import {rootEntity} from 'ngrx-entity-relationship';
import {injectEntity} from 'ngrx-entity-relationship/lib/store/injectEntity';
import {patchState} from 'ngrx-entity-relationship/lib/store/patchState';

describe('store/patchState', () => {
    let patchStateSpy: jasmine.Spy;
    let patchStateOrig: typeof patchState.func;

    beforeEach(() => {
        patchStateOrig = patchState.func;
        patchStateSpy = spyOn(patchState, 'func');
    });

    afterEach(() => {
        patchState.func = patchStateOrig;
    });

    it('throws on primitives', () => {
        const state = Symbol();
        const selector = rootEntity(() => undefined);
        expect(() => injectEntity.func(state, selector, false)).toThrowError('Entity is not an object');
        expect(() => injectEntity.func(state, selector, 123)).toThrowError('Entity is not an object');
        expect(() => injectEntity.func(state, selector, 'str')).toThrowError('Entity is not an object');
        expect(() => injectEntity.func(state, selector, undefined)).toThrowError('Entity is not an object');
    });

    it('throws on unknown id selectors', () => {
        const state = Symbol();
        const entity = {};
        const selector = rootEntity(() => undefined);
        expect(() => injectEntity.func(state, selector, entity)).toThrowError('Cannot detect id of an entity');
    });

    it('avoids fields with relationships', () => {
        const state = {
            entity1: {
                ids: [],
                entities: {},
            },
        };
        const state1 = Symbol();
        const entity = {
            id: '1',
            rand: 'rand1',
            keyId1: '2',
            keyValue1: {
                id: '2',
            },
            keyId2: ['3'],
            keyValue2: [
                {
                    id: '3',
                },
            ],
        };
        const selector = rootEntity<typeof state, typeof entity>(s => s.entity1);
        patchStateSpy.and.returnValues(state1);

        const actual = injectEntity.func(state, selector, entity, {
            skipFields: ['keyValue1', 'keyValue2'],
        });
        expect(actual).toBe(state1);
        expect(patchStateSpy).toHaveBeenCalledWith(
            state,
            state.entity1,
            jasmine.objectContaining({
                entities: {
                    1: {
                        id: '1',
                        rand: 'rand1',
                        keyId1: '2',
                        keyId2: ['3'],
                    },
                },
            }),
        );
    });

    it('adds missed fields from an existing entity', () => {
        const state = {
            entity1: {
                ids: ['1'],
                entities: {
                    1: {
                        rand: 'rand0',
                        missed: true,
                    },
                },
            },
        };
        const state1 = Symbol();
        const entity = {
            id: '1',
            rand: 'rand1',
        };
        const selector = rootEntity<typeof state, any>(s => s.entity1);
        patchStateSpy.and.returnValues(state1);

        const actual = injectEntity.func(state, selector, entity);
        expect(actual).toBe(state1);
        expect(patchStateSpy).toHaveBeenCalledWith(
            state,
            state.entity1,
            jasmine.objectContaining({
                entities: {
                    1: {
                        id: '1',
                        rand: 'rand1',
                        missed: true,
                    },
                },
            }),
        );
    });

    it('adds id of a new entity to the store', () => {
        const state = {
            entity1: {
                ids: ['2'],
                entities: {},
            },
        };
        const state1 = Symbol();
        const entity = {
            id: '1',
            rand: 'rand1',
        };
        const selector = rootEntity<typeof state, typeof entity>(s => s.entity1);
        patchStateSpy.and.returnValues(state1);

        const actual = injectEntity.func(state, selector, entity);
        expect(actual).toBe(state1);
        expect(patchStateSpy).toHaveBeenCalledWith(
            state,
            state.entity1,
            jasmine.objectContaining({
                ids: ['2', '1'],
            }),
        );
    });

    it('adds a new entity to the store', () => {
        const state = {
            entity1: {
                ids: ['2'],
                entities: {
                    2: {
                        id: '2',
                        rand: 'rand2',
                    },
                },
            },
        };
        const state1 = Symbol();
        const entity = {
            id: '1',
            rand: 'rand1',
        };
        const selector = rootEntity<typeof state, typeof entity>(s => s.entity1);
        patchStateSpy.and.returnValues(state1);

        const actual = injectEntity.func(state, selector, entity);
        expect(actual).toBe(state1);
        expect(patchStateSpy).toHaveBeenCalledWith(
            state,
            state.entity1,
            jasmine.objectContaining({
                entities: {
                    2: state.entity1.entities[2],
                    1: entity,
                },
            }),
        );
    });

    it('respects the same entity', () => {
        const state = {
            entity1: {
                ids: ['1'],
                entities: {
                    1: {
                        id: '1',
                        rand: 'rand1',
                    },
                },
            },
        };
        const state1 = Symbol();
        const entity = {
            id: '1',
            rand: 'rand1',
        };
        const selector = rootEntity<typeof state, typeof entity>(s => s.entity1);
        patchStateSpy.and.returnValues(state1);

        const actual = injectEntity.func(state, selector, entity);
        expect(actual).toBe(state1);
        expect(patchStateSpy).toHaveBeenCalledWith(state, state.entity1, state.entity1);
    });
});
