import {toStaticSelector} from '../../../src/lib/toStaticSelector';

describe('toStaticSelector', () => {
    it('creates a factory function', () => {
        const selector = jasmine.createSpy('selector').and.returnValue('result');
        const storeSelector = toStaticSelector(selector, 'param');
        const state = {};

        const actual = storeSelector(state);
        expect(actual).toEqual('result');
        expect(selector).toHaveBeenCalledWith(state, 'param');
    });

    it('provides a release function', () => {
        const selector = jasmine.createSpy('selector').and.returnValue('return');
        const factory = toStaticSelector(selector, 'param');
        expect(factory.release).not.toThrow();
    });

    it('provides a release function which delegates the call', () => {
        const selector: {
            (state: unknown, ids: unknown): unknown;
            release?: () => void;
        } = jasmine.createSpy('selector').and.returnValue('return');
        (selector as any).release = jasmine.createSpy('selector.release');
        const factory = toStaticSelector(selector, 'param');
        expect(factory.release).not.toThrow();
        expect(selector.release).toHaveBeenCalled();
    });
});
