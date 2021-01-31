import {ngrxEntityRelationshipActions} from '../../../../src/lib/store/actions';
import {fromFlat} from '../../../../src/lib/store/fromFlat';
import {fromGraph} from '../../../../src/lib/store/fromGraph';
import {ngrxEntityRelationshipReducer} from '../../../../src/lib/store/ngrxEntityRelationshipReducer';

describe('store/ngrxEntityRelationshipReducer', () => {
    let fromGraphSpy: jasmine.Spy;
    let fromFlatSpy: jasmine.Spy;

    let fromGraphOrig: typeof fromGraph.func;
    let fromFlatOrig: typeof fromFlat.func;

    beforeEach(() => {
        fromGraphOrig = fromGraph.func;
        fromFlatOrig = fromFlat.func;

        fromGraphSpy = spyOn(fromGraph, 'func');
        fromFlatSpy = spyOn(fromFlat, 'func');
    });

    afterEach(() => {
        fromGraph.func = fromGraphOrig;
        fromFlat.func = fromFlatOrig;
    });

    it('handles reduceGraph', () => {
        const stateOriginal = {p: Math.random()};
        const stateFromGraph = {p: Math.random()};
        const stateReducer = {p: Math.random()};
        const reducer = jasmine.createSpy('reducer');
        const action = {
            type: ngrxEntityRelationshipActions.reduceGraph,
            selector: jasmine.createSpy('selector'),
            data: {p: Math.random()},
        };
        fromGraphSpy.and.returnValue(stateFromGraph);
        reducer.and.returnValue(stateReducer);

        const actual = ngrxEntityRelationshipReducer(reducer)(stateOriginal, action);
        expect(actual).toBe(stateReducer);
        expect(fromGraphSpy).toHaveBeenCalledWith(stateOriginal, action.selector, action.data);
        expect(fromFlatSpy).not.toHaveBeenCalled();
        expect(reducer).toHaveBeenCalledWith(stateFromGraph, action);
    });

    it('handles reduceFlat', () => {
        const stateOriginal = {p: Math.random()};
        const stateFromFlat = {p: Math.random()};
        const stateReducer = {p: Math.random()};
        const reducer = jasmine.createSpy('reducer');
        const action = {
            type: ngrxEntityRelationshipActions.reduceFlat,
            selector: jasmine.createSpy('selector'),
            data: {p: Math.random()},
        };
        fromFlatSpy.and.returnValue(stateFromFlat);
        reducer.and.returnValue(stateReducer);

        const actual = ngrxEntityRelationshipReducer(reducer)(stateOriginal, action);
        expect(actual).toBe(stateReducer);
        expect(fromGraphSpy).not.toHaveBeenCalled();
        expect(fromFlatSpy).toHaveBeenCalledWith(stateOriginal, action.selector, action.data);
        expect(reducer).toHaveBeenCalledWith(stateFromFlat, action);
    });

    it('skips the rest', () => {
        const stateOriginal = {p: Math.random()};
        const stateReducer = {p: Math.random()};
        const reducer = jasmine.createSpy('reducer');
        const action = {
            type: 'random',
        };
        reducer.and.returnValue(stateReducer);

        const actual = ngrxEntityRelationshipReducer(reducer)(stateOriginal, action);
        expect(actual).toBe(stateReducer);
        expect(fromFlatSpy).not.toHaveBeenCalled();
        expect(fromGraphSpy).not.toHaveBeenCalled();
        expect(reducer).toHaveBeenCalledWith(stateOriginal, action);
    });
});
