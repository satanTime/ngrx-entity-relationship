import {ACTION} from '../types';

import {ngrxEntityRelationshipActions} from './actions';
import {fromFlat} from './fromFlat';
import {fromGraph} from './fromGraph';

export function ngrxEntityRelationshipReducer<T>(
    reducer: (state: T | undefined, action: ACTION) => T,
): (state: T, action: ACTION) => T {
    return (state: T, action: any) => {
        if (action.type === ngrxEntityRelationshipActions.reduceGraph) {
            return reducer(fromGraph.func(state, action.selector, action.data), action);
        }
        if (action.type === ngrxEntityRelationshipActions.reduceFlat) {
            return reducer(fromFlat.func(state, action.selector, action.data), action);
        }
        return reducer(state, action);
    };
}
