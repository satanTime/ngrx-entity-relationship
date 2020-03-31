import createSpy = jasmine.createSpy;

import {rootEntitySelector} from '../src';

describe('rootEntitySelector', () => {
    it('marks callback with ngrxEntityRelationship key', () => {
        const actual = rootEntitySelector(createSpy());
        expect(actual).toEqual(jasmine.any(Function));
        expect(actual).toEqual(
            jasmine.objectContaining({
                ngrxEntityRelationship: 'rootEntitySelector',
            }),
        );
    });
});
