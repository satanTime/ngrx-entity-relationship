import {
    argsToArray,
    mergeCache,
    normalizeSelector,
    objectValues,
    verifyCache,
} from 'ngrx-entity-relationship/dist/utils';

describe('utils', () => {
    describe('normalizeSelector', () => {
        it('throws an error in console about circular dependencies', () => {
            expect(() => normalizeSelector(undefined)).toThrowError(
                new RegExp('https://github.com/satanTime/ngrx-entity-relationship#circular-dependency'),
            );
        });

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

    describe('verifyCache', () => {
        it('returns false on empty checks', () => {
            const state = {};
            const checks = new Map();
            expect(verifyCache(state, checks)).toBe(false);
        });

        it('returns true on equal nulls only check', () => {
            const state = {
                feature: {
                    entities: {},
                },
            };
            const checks = new Map();
            const selector = v => v.feature;
            const selectorEntities = new Map();

            checks.set(selector, selectorEntities);
            selectorEntities.set(null, state.feature.entities);

            expect(verifyCache(state, checks)).toBe(true);
        });

        it('returns false on changed nulls only check', () => {
            const state = {
                feature: {
                    entities: {},
                },
            };
            const checks = new Map();
            const selector = v => v.feature;
            const selectorEntities = new Map();

            checks.set(selector, selectorEntities);
            selectorEntities.set(null, {...state.feature.entities});

            expect(verifyCache(state, checks)).toBe(false);
        });

        it('returns true on equal items only check', () => {
            const state = {
                feature: {
                    entities: {
                        id1: {
                            id: 'id1',
                        },
                    },
                },
            };
            const checks = new Map();
            const selector = v => v.feature;
            const selectorEntities = new Map();

            checks.set(selector, selectorEntities);
            selectorEntities.set('id1', state.feature.entities.id1);

            expect(verifyCache(state, checks)).toBe(true);
        });

        it('returns false on changed items only check', () => {
            const state = {
                feature: {
                    entities: {
                        id1: {
                            id: 'id1',
                        },
                    },
                },
            };
            const checks = new Map();
            const selector = v => v.feature;
            const selectorEntities = new Map();

            checks.set(selector, selectorEntities);
            selectorEntities.set('id1', {...state.feature.entities.id1});

            expect(verifyCache(state, checks)).toBe(false);
        });

        it('ignores item check if null check passes', () => {
            const state = {
                feature: {
                    entities: {
                        id1: {
                            id: 'id1',
                        },
                    },
                },
            };
            const checks = new Map();
            const selector = v => v.feature;
            const selectorEntities = new Map();

            checks.set(selector, selectorEntities);
            selectorEntities.set(null, state.feature.entities);
            selectorEntities.set('id1', {...state.feature.entities.id1});

            // it didn't check entity, even it is different from store.
            // because store requires tree being shacked.
            expect(verifyCache(state, checks)).toBe(true);
        });

        it('checks items if null check failed', () => {
            const state = {
                feature: {
                    entities: {
                        id1: {
                            id: 'id1',
                        },
                    },
                },
            };
            const checks = new Map();
            const selector = v => v.feature;
            const selectorEntities = new Map();

            checks.set(selector, selectorEntities);
            selectorEntities.set(null, {...state.feature.entities});
            selectorEntities.set('id1', state.feature.entities.id1);

            expect(verifyCache(state, checks)).toBe(true);
        });

        it('checks several groups', () => {
            const state = {
                feature1: {
                    entities: {
                        id1: {
                            id: 'id1',
                        },
                    },
                },
                feature2: {
                    entities: {
                        id1: {
                            id: 'id1',
                        },
                    },
                },
            };
            const checks = new Map();
            const selector1 = v => v.feature1;
            const selector1Entities = new Map();
            const selector2 = v => v.feature1;
            const selector2Entities = new Map();

            checks.set(selector1, selector1Entities);
            selector1Entities.set(null, state.feature1.entities);
            selector1Entities.set('id1', state.feature1.entities.id1);

            checks.set(selector2, selector2Entities);
            selector2Entities.set(null, {...state.feature2.entities});
            selector2Entities.set('id1', {...state.feature2.entities.id1});

            expect(verifyCache(state, checks)).toBe(false);
        });
    });

    describe('mergeCache', () => {
        it('does nothing on undefined from', () => {
            const from = undefined;
            const to = new Map();
            spyOn(to, 'get');
            spyOn(to, 'set');
            spyOn(to, 'has');
            mergeCache(from, to);
            expect(to.get).not.toHaveBeenCalled();
            expect(to.set).not.toHaveBeenCalled();
            expect(to.has).not.toHaveBeenCalled();
        });

        it('adds new selectors to destination', () => {
            const from = new Map();
            const to = new Map();

            const selector = v => v.feature;
            from.set(selector, new Map());

            expect(to.has(selector)).toBe(false);
            mergeCache(from, to);
            expect(to.has(selector)).toBe(true);
        });

        it('updates existing selectors with new values', () => {
            const from = new Map();
            const to = new Map();

            const selector = v => v.feature;
            const selector1Entities = new Map();
            selector1Entities.set('id1', 'id1value');

            from.set(selector, selector1Entities);
            to.set(selector, new Map());

            expect(to.get(selector).has('id1')).toBe(false);
            mergeCache(from, to);
            expect(to.get(selector).get('id1')).toBe('id1value');
        });

        it('skips existing values in destination', () => {
            const from = new Map();
            const to = new Map();

            const selector = v => v.feature;
            const selector1Entities = new Map();
            selector1Entities.set('id1', 'id1value');

            from.set(selector, selector1Entities);
            to.set(selector, new Map());
            to.get(selector).set('id1', 'id1exists');

            expect(to.get(selector).get('id1')).toBe('id1exists');
            mergeCache(from, to);
            expect(to.get(selector).get('id1')).toBe('id1exists');
        });
    });

    describe('argsToArray', () => {
        it('converts an object to an array', () => {
            const data = {
                [0]: 1,
                [1]: 2,
                length: 2,
                test: 123,
            };
            const actual = argsToArray(data);
            expect(actual).toEqual([1, 2]);
        });
    });

    describe('objectValues', () => {
        it('extracts only values', () => {
            const data = {
                [0]: 1,
                [1]: 2,
                length: 2,
                test: 123,
            };
            const actual = objectValues(data);
            expect(actual).toEqual([1, 2, 2, 123]);
        });
    });
});
