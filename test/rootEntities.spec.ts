import createSpy = jasmine.createSpy;

import {rootEntities} from '../src';

describe('rootEntities', () => {
    it('marks callback with ngrxEntityRelationship key', () => {
        const actual = rootEntities(createSpy());
        expect(actual).toEqual(jasmine.any(Function));
        expect(actual).toEqual(
            jasmine.objectContaining({
                ngrxEntityRelationship: 'rootEntities',
            }),
        );
    });
});
