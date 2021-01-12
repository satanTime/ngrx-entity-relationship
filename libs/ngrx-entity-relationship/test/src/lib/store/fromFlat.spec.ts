import {relatedEntity} from '../../../../src/lib/relatedEntity';
import {rootEntity} from '../../../../src/lib/rootEntity';
import {fromFlat} from '../../../../src/lib/store/fromFlat';
import {injectEntity} from '../../../../src/lib/store/injectEntity';

describe('store/fromFlat', () => {
    let injectEntitySpy: jasmine.Spy;
    let injectEntityOrig: typeof injectEntity.func;

    beforeEach(() => {
        injectEntityOrig = injectEntity.func;
        injectEntitySpy = spyOn(injectEntity, 'func');
    });

    afterEach(() => {
        injectEntity.func = injectEntityOrig;
    });

    it('requires meta', () => {
        const state = Symbol();
        const data = undefined;
        const selector = rootEntity(() => undefined as any);
        selector.meta = undefined as any;
        expect(() => fromFlat.func(state, selector, data)).toThrowError('Flat key is not provided in meta');
    });

    it('requires meta.flatKey', () => {
        const state = Symbol();
        const data = undefined;
        const selector = rootEntity(() => undefined as any);
        selector.meta = {};
        expect(() => fromFlat.func(state, selector, data)).toThrowError('Flat key is not provided in meta');
    });

    it('makes graph data flat', () => {
        const entity1 = Symbol();
        const entity2 = Symbol();
        const entity3 = Symbol();
        const entity4 = Symbol();
        const data = {
            type1: [entity1, entity2],
            type2: [entity3],
            type3: entity4,
        };

        const state = Symbol();
        const state1 = Symbol();
        const state2 = Symbol();
        const state3 = Symbol();
        const state4 = Symbol();
        const state5 = Symbol();
        const state6 = Symbol();

        const selector = rootEntity<any, any>(
            () => undefined as any,
            {
                flatKey: 'type1',
            },
            relatedEntity<any, any, any>(
                () => undefined as any,
                'keyId',
                'keyValue',
                {
                    flatKey: 'type2',
                },
                relatedEntity<any, any, any>(
                    () => undefined as any,
                    'keyId',
                    'keyValue',
                    {
                        flatKey: 'type3',
                    },
                    relatedEntity<any, any, any>(() => undefined as any, 'keyId', 'keyValue', {
                        // should be ignored because it exists
                        flatKey: 'type1',
                    }),
                ),
            ),
        );

        injectEntitySpy.and.returnValues(state1, state2, state3, state4, state5, state6);

        const actual = fromFlat.func(state, selector, data);
        expect(actual).toBe(state6);
        expect(injectEntitySpy).toHaveBeenCalledTimes(6);
        expect(injectEntitySpy).toHaveBeenCalledWith(state, selector, entity1, {skipFields: ['keyValue']});
        expect(injectEntitySpy).toHaveBeenCalledWith(
            state1,
            selector.relationships[0].relationships[0].relationships[0],
            entity1,
            {skipFields: ['keyValue']},
        );
        expect(injectEntitySpy).toHaveBeenCalledWith(state2, selector, entity2, {skipFields: ['keyValue']});
        expect(injectEntitySpy).toHaveBeenCalledWith(
            state3,
            selector.relationships[0].relationships[0].relationships[0],
            entity2,
            {skipFields: ['keyValue']},
        );
        expect(injectEntitySpy).toHaveBeenCalledWith(state4, selector.relationships[0], entity3, {
            skipFields: ['keyValue'],
        });
        expect(injectEntitySpy).toHaveBeenCalledWith(state5, selector.relationships[0].relationships[0], entity4, {
            skipFields: ['keyValue'],
        });
    });

    it('ignores empty entities', () => {
        const state = Symbol();
        const data = {
            test: [undefined, false, null],
        };
        const selector = rootEntity(() => undefined as any);
        selector.meta = {
            flatKey: 'test',
        };
        const actual = fromFlat.func(state, selector, data);
        expect(actual).toBe(state);
        expect(injectEntitySpy).not.toHaveBeenCalled();
    });
});
