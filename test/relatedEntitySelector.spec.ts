import {relatedEntitySelector} from '../src';

describe('relatedEntitySelector', () => {
    it('marks callback with ngrxEntityRelationship key', () => {
        const actual = relatedEntitySelector<any, any, any, any, any>(jasmine.createSpy(), '', '');
        expect(actual).toEqual(jasmine.any(Function));
        expect(actual).toEqual(
            jasmine.objectContaining({
                ngrxEntityRelationship: 'relatedEntitySelector',
            }),
        );
    });
});
