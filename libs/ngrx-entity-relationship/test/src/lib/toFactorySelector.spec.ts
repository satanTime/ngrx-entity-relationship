import {toFactorySelector} from '../../../src/lib/toFactorySelector';

describe('toFactorySelector', () => {
    it('creates a factory function', () => {
        const selector = jasmine.createSpy('selector').and.returnValue('result');
        const factory = toFactorySelector(selector);
        const storeSelector = factory('param');
        const state = {};

        const actual = storeSelector(state);
        expect(actual).toEqual('result');
        expect(selector).toHaveBeenCalledWith(state, 'param');
    });

    it('provides a release function', () => {
        const selector = jasmine.createSpy('selector').and.returnValue('return');
        const factory = toFactorySelector(selector);
        expect(factory.release).not.toThrow();
    });

    it('provides a release function which delegates the call', () => {
        const selector: {
            (state: unknown, ids: unknown): unknown;
            release?: () => void;
        } = jasmine.createSpy('selector').and.returnValue('return');
        (selector as any).release = jasmine.createSpy('selector.release');
        const factory = toFactorySelector(selector);
        expect(factory.release).not.toThrow();
        expect(selector.release).toHaveBeenCalled();
    });
});
