import {childEntitySelector} from '../src';

describe('childEntitySelector', () => {
    it('marks callback with ngrxEntityRelationship key', () => {
        const actual = childEntitySelector<any, any, any, any, any>(jasmine.createSpy(), undefined, undefined);
        expect(actual).toEqual(jasmine.any(Function));
        expect(actual).toEqual(
            jasmine.objectContaining({
                ngrxEntityRelationship: 'childEntitySelector',
            }),
        );
    });
});
