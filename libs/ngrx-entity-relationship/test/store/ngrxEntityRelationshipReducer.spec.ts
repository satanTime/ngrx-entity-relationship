import {ngrxEntityRelationshipActions, ngrxEntityRelationshipReducer} from 'ngrx-entity-relationship';
import {fromFlat} from 'ngrx-entity-relationship/lib/store/fromFlat';
import {fromGraph} from 'ngrx-entity-relationship/lib/store/fromGraph';

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
        const stateOriginal = Symbol();
        const stateFromGraph = Symbol();
        const stateReducer = Symbol();
        const reducer = jasmine.createSpy('reducer');
        const action = {
            type: ngrxEntityRelationshipActions.reduceGraph,
            selector: jasmine.createSpy('selector'),
            data: Symbol(),
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
        const stateOriginal = Symbol();
        const stateFromFlat = Symbol();
        const stateReducer = Symbol();
        const reducer = jasmine.createSpy('reducer');
        const action = {
            type: ngrxEntityRelationshipActions.reduceFlat,
            selector: jasmine.createSpy('selector'),
            data: Symbol(),
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
        const stateOriginal = Symbol();
        const stateReducer = Symbol();
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
