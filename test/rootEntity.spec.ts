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

    it('returns cached value when rootEntityFlags.disabled is true', () => {
        pending();
    });

    it('returns cached value when no related entity has not been changed', () => {
        pending();
    });

    it('returns cached value when no related entity set has not been changed', () => {
        pending();
    });

    it('returns undefined if the related entity does not exist', () => {
        pending();
    });

    it('calls relationships with an incrementing prefix and arguments', () => {
        pending();
    });

    it('uses transformer', () => {
        pending();
    });

    it('uses transformer after relationships', () => {
        pending();
    });
});
