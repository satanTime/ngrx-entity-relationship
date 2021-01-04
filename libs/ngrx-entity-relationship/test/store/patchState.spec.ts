import {patchState} from '../../src/lib/store/patchState';

describe('store/patchState', () => {
    it('touches only objects', () => {
        const state = {
            key1: Symbol(),
            key3: {
                key4: Symbol(),
            },
        };
        const destination = Symbol();

        const actual = patchState.func(state, state.key1, destination);
        expect(actual).toBe(state);
        expect(actual.key1).not.toBe(destination);
    });

    it('handles duplicates', () => {
        const state = {
            key1: Symbol(),
            key3: {
                key4: Symbol(),
            },
        };

        const actual = patchState.func(state, state.key3, state.key3);
        expect(actual).toBe(state);
    });

    it('ignores nulls', () => {
        const state = {
            key1: Symbol(),
            key3: {
                key4: Symbol(),
            },
        };
        const destination = Symbol();

        const actual = patchState.func(null, state, destination);
        expect(actual).toBe(null);
    });

    it('ignores primitives', () => {
        const state = {
            key1: Symbol(),
            key3: {
                key4: Symbol(),
            },
        };
        const destination = Symbol();

        const actual = patchState.func('hello', state, destination);
        expect(actual).toBe('hello');
    });

    it('find and replaces root', () => {
        const state = {
            key1: {
                key2: Symbol(),
            },
            key3: {
                key4: Symbol(),
            },
        };
        const destination = {
            key5: Symbol(),
        };

        const actual = patchState.func(state, state.key1, destination);
        expect(actual).not.toBe(state);
        expect(actual.key3).toBe(state.key3);
        expect(actual.key1).toBe(destination as any);
    });

    it('find and replaces child', () => {
        const state = {
            key1: {
                key2: Symbol(),
            },
            key3: {
                key4: {
                    key5: Symbol(),
                },
                key6: {
                    key7: Symbol(),
                },
            },
        };
        const destination = {
            key8: Symbol(),
        };

        const actual = patchState.func(state, state.key3.key4, destination);
        expect(actual).not.toBe(state);
        expect(actual.key1).toBe(state.key1);
        expect(actual.key3).not.toBe(state.key3);
        expect(actual.key3.key4).toBe(destination as any);
        expect(actual.key3.key6).toBe(state.key3.key6);
    });
});
