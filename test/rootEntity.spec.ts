import createSpy = jasmine.createSpy;

import {rootEntity} from '../src';

describe('rootEntity', () => {
    it('marks callback with ngrxEntityRelationship key', () => {
        const actual = rootEntity(createSpy());
        expect(actual).toEqual(jasmine.any(Function));
        expect(actual).toEqual(
            jasmine.objectContaining({
                ngrxEntityRelationship: 'rootEntity',
            }),
        );
    });
});
