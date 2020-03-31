import createSpy = jasmine.createSpy;

import {childrenEntitySelector} from '../src';

describe('childrenEntitySelector', () => {
    it('marks callback with ngrxEntityRelationship key', () => {
        const actual = childrenEntitySelector<any, any, any, any, any>(createSpy(), '', '');
        expect(actual).toEqual(jasmine.any(Function));
        expect(actual).toEqual(
            jasmine.objectContaining({
                ngrxEntityRelationship: 'childrenEntitySelector',
            }),
        );
    });
});
