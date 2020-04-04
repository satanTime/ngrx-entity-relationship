import createSpy = jasmine.createSpy;

import {childrenEntities} from '../src';

describe('childrenEntities', () => {
    it('marks callback with ngrxEntityRelationship key', () => {
        const actual = childrenEntities<any, any, any, any, any>(createSpy(), '', '');
        expect(actual).toEqual(jasmine.any(Function));
        expect(actual).toEqual(
            jasmine.objectContaining({
                ngrxEntityRelationship: 'childrenEntities',
            }),
        );
    });
});
