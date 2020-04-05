import createSpy = jasmine.createSpy;

import {relatedEntitySelector} from '../src';

describe('relatedEntitySelector', () => {
    it('marks callback with ngrxEntityRelationship key', () => {
        const actual = relatedEntitySelector<any, any, any, any, any>(createSpy(), '', '');
        expect(actual).toEqual(jasmine.any(Function));
        expect(actual).toEqual(
            jasmine.objectContaining({
                ngrxEntityRelationship: 'relatedEntitySelector',
            }),
        );
    });
});
