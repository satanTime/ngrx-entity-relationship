import {relatedEntity, rootEntity} from 'ngrx-entity-relationship';
import {fromGraph} from 'ngrx-entity-relationship/dist/store/fromGraph';
import {injectEntity} from 'ngrx-entity-relationship/dist/store/injectEntity';

describe('store/fromGraph', () => {
    let injectEntitySpy: jasmine.Spy;
    let injectEntityOrig: typeof injectEntity.func;

    beforeEach(() => {
        injectEntityOrig = injectEntity.func;
        injectEntitySpy = spyOn(injectEntity, 'func');
    });

    afterEach(() => {
        injectEntity.func = injectEntityOrig;
    });

    it('makes graph data flat', () => {
        const entity1 = {
            name: 'entity1',
        };
        const entity2 = {
            name: 'entity2',
        };
        const entity3 = {
            name: 'entity3',
        };
        const entity4 = {
            name: 'entity4',
        };
        const data = [
            {
                ...entity1,
                keyValue1: [
                    {
                        ...entity3,
                        keyValue2: entity4,
                    },
                ],
            },
            entity2,
        ];

        const state = Symbol();
        const state1 = Symbol();
        const state2 = Symbol();
        const state3 = Symbol();
        const state4 = Symbol();

        const selector = rootEntity<any, any>(
            () => undefined,
            relatedEntity<any, any, any>(
                () => undefined,
                'keyId1',
                'keyValue1',
                relatedEntity<any, any, any>(() => undefined, 'keyId2', 'keyValue2'),
            ),
        );

        injectEntitySpy.and.returnValues(state1, state2, state3, state4);

        const actual = fromGraph.func(state, selector, data);
        expect(actual).toBe(state4);
        expect(injectEntitySpy).toHaveBeenCalledTimes(4);
        expect(injectEntitySpy).toHaveBeenCalledWith(
            state,
            selector,
            jasmine.objectContaining({
                name: 'entity1',
                keyValue1: jasmine.anything(),
            }),
            {skipFields: ['keyValue1']},
        );
        expect(injectEntitySpy).toHaveBeenCalledWith(
            state1,
            selector.relationships[0],
            jasmine.objectContaining({
                name: 'entity3',
                keyValue2: jasmine.anything(),
            }),
            {skipFields: ['keyValue2']},
        );
        expect(injectEntitySpy).toHaveBeenCalledWith(
            state2,
            selector.relationships[0].relationships[0],
            jasmine.objectContaining({
                name: 'entity4',
            }),
            {skipFields: []},
        );
        expect(injectEntitySpy).toHaveBeenCalledWith(
            state3,
            selector,
            jasmine.objectContaining({
                name: 'entity2',
            }),
            {skipFields: ['keyValue1']},
        );
    });

    it('ignores empty entities', () => {
        const state = Symbol();
        const state1 = Symbol();
        const data = [
            undefined,
            false,
            null,
            {
                keyValue: [undefined, false, null],
            },
        ];
        const selector = rootEntity<any, any>(
            () => undefined,
            relatedEntity<any, any, any>(() => undefined, 'keyId', 'keyValue'),
        );

        injectEntitySpy.and.returnValues(state1);

        const actual = fromGraph.func(state, selector, data);
        expect(actual).toBe(state1);
        expect(injectEntitySpy).toHaveBeenCalledTimes(1);
        expect(injectEntitySpy).toHaveBeenCalledWith(state, selector, jasmine.anything(), jasmine.anything());
    });
});
