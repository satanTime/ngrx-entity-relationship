import {childrenEntitiesSelector} from '../src';

describe('childrenEntitiesSelector', () => {
    it('marks callback with ngrxEntityRelationship key', () => {
        const actual = childrenEntitiesSelector<any, any, any, any, any>(jasmine.createSpy(), '', '');
        expect(actual).toEqual(jasmine.any(Function));
        expect(actual).toEqual(
            jasmine.objectContaining({
                ngrxEntityRelationship: 'childrenEntitiesSelector',
            }),
        );
    });
});
