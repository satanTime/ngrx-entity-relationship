import createSpy = jasmine.createSpy;

import {childEntitySelector} from '../src';

describe('childEntitySelector', () => {
    it('marks callback with ngrxEntityRelationship key', () => {
        const actual = childEntitySelector<any, any, any, any, any>(createSpy(), undefined, undefined);
        expect(actual).toEqual(jasmine.any(Function));
        expect(actual).toEqual(
            jasmine.objectContaining({
                ngrxEntityRelationship: 'childEntitySelector',
            }),
        );
    });
});
