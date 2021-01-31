import {rootEntity} from '../../../../src/lib/rootEntity';
import {
    ngrxEntityRelationshipActions,
    reduceFlat,
    ReduceFlat,
    reduceGraph,
    ReduceGraph,
} from '../../../../src/lib/store/actions';

describe('store/actions', () => {
    it('ReduceFlat', () => {
        const data = {p: Math.random()};
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
        const data = {p: Math.random()};
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
        const data = {p: Math.random()};
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
        const data = {p: Math.random()};
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
