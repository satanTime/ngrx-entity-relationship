import createSpy = jasmine.createSpy;

import {rootEntitiesSelector} from '../src';

describe('rootEntitiesSelector', () => {
    it('marks callback with ngrxEntityRelationship key', () => {
        const actual = rootEntitiesSelector(createSpy());
        expect(actual).toEqual(jasmine.any(Function));
        expect(actual).toEqual(
            jasmine.objectContaining({
                ngrxEntityRelationship: 'rootEntitiesSelector',
            }),
        );
    });
});
