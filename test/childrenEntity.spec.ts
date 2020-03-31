import createSpy = jasmine.createSpy;

import {childrenEntity} from '../src';

describe('childrenEntity', () => {
    it('marks callback with ngrxEntityRelationship key', () => {
        const actual = childrenEntity<any, any, any, any, any>(createSpy(), '', '');
        expect(actual).toEqual(jasmine.any(Function));
        expect(actual).toEqual(
            jasmine.objectContaining({
                ngrxEntityRelationship: 'childrenEntity',
            }),
        );
    });
});
