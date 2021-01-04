import {
    ngrxEntityRelationshipActions,
    ReduceFlat,
    reduceFlat,
    ReduceGraph,
    reduceGraph,
    rootEntity,
} from 'ngrx-entity-relationship';

describe('store/actions', () => {
    it('ReduceFlat', () => {
        const data = Symbol();
        const selector = rootEntity(() => undefined as any);
        const actual = new ReduceFlat(data, selector);
        expect(actual).toEqual(jasmine.any(ReduceFlat));
        expect(actual).toEqual(
            jasmine.objectContaining({
                type: ngrxEntityRelationshipActions.reduceFlat,
                data,
                selector,
            }) as any,
        );
    });

    it('reduceFlat', () => {
        const data = Symbol();
        const selector = rootEntity(() => undefined as any);
        const actual = reduceFlat({data, selector});
        expect(actual).not.toEqual(jasmine.any(ReduceFlat));
        expect(actual).toEqual(
            jasmine.objectContaining({
                type: ngrxEntityRelationshipActions.reduceFlat,
                data,
                selector,
            }) as any,
        );
    });

    it('ReduceGraph', () => {
        const data = Symbol();
        const selector = rootEntity(() => undefined as any);
        const actual = new ReduceGraph(data, selector);
        expect(actual).toEqual(jasmine.any(ReduceGraph));
        expect(actual).toEqual(
            jasmine.objectContaining({
                type: ngrxEntityRelationshipActions.reduceGraph,
                data,
                selector,
            }) as any,
        );
    });

    it('reduceGraph', () => {
        const data = Symbol();
        const selector = rootEntity(() => undefined as any);
        const actual = reduceGraph({data, selector});
        expect(actual).not.toEqual(jasmine.any(ReduceGraph));
        expect(actual).toEqual(
            jasmine.objectContaining({
                type: ngrxEntityRelationshipActions.reduceGraph,
                data,
                selector,
            }) as any,
        );
    });
});
