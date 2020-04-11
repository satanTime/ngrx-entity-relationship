import {normalizeSelector} from '../src/utils';

describe('utils', () => {
    describe('normalizeSelector', () => {
        it('respects a default selector and returns id field', () => {
            const featureSelector = jasmine.createSpy('featureSelector');
            const {collection, id} = normalizeSelector(featureSelector);

            expect(collection).toBe(featureSelector);
            expect(id({id: 'myId'})).toBe('myId');
            expect(id({myField: 'myId'})).toBeUndefined();
            expect(id(undefined)).toBeUndefined();
        });

        it('respects EntityCollectionServiceBase', () => {
            const featureSelector = jasmine.createSpy('featureSelector');
            const idSelector = jasmine.createSpy('idSelector');
            const {collection, id} = normalizeSelector({
                selectors: {
                    selectCollection: featureSelector,
                },
                selectId: idSelector,
            });

            expect(collection).toBe(featureSelector);
            expect(id).toBe(idSelector);
        });

        it('respects custom feature selector and id field of string', () => {
            const featureSelector = jasmine.createSpy('featureSelector');
            const {collection, id} = normalizeSelector({
                collection: featureSelector,
                id: 'myField',
            });

            expect(collection).toBe(featureSelector);
            expect(id({myField: 'myId'})).toBe('myId');
            expect(id({id: 'myId'})).toBeUndefined();
            expect(id(undefined)).toBeUndefined();
        });

        it('respects custom feature selector and id field of number', () => {
            const featureSelector = jasmine.createSpy('featureSelector');
            const {collection, id} = normalizeSelector({
                collection: featureSelector,
                id: 5,
            });

            expect(collection).toBe(featureSelector);
            expect(id({5: 'myId'})).toBe('myId');
            expect(id({4: 'myId'})).toBeUndefined();
            expect(id(undefined)).toBeUndefined();
        });

        it('respects custom feature selector and id selector', () => {
            const featureSelector = jasmine.createSpy('featureSelector');
            const idSelector = jasmine.createSpy('idSelector');
            const {collection, id} = normalizeSelector({
                collection: featureSelector,
                id: idSelector,
            });

            expect(collection).toBe(featureSelector);
            expect(id).toBe(idSelector);
        });
    });
});
