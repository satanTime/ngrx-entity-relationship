import createSpy = jasmine.createSpy;

import {childEntity} from '../src';

describe('childEntity', () => {
    it('marks callback with ngrxEntityRelationship key', () => {
        const actual = childEntity<any, any, any, any, any>(createSpy(), '', '');
        expect(actual).toEqual(jasmine.any(Function));
        expect(actual).toEqual(
            jasmine.objectContaining({
                ngrxEntityRelationship: 'childEntity',
            }),
        );
    });
});
