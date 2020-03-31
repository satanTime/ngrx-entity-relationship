import createSpy = jasmine.createSpy;

import {relatedEntity} from '../src';

describe('relatedEntity', () => {
    it('marks callback with ngrxEntityRelationship key', () => {
        const actual = relatedEntity<any, any, any, any, any, any, any>(createSpy(), '', '');
        expect(actual).toEqual(jasmine.any(Function));
        expect(actual).toEqual(
            jasmine.objectContaining({
                ngrxEntityRelationship: 'relatedEntity',
            }),
        );
    });
});
