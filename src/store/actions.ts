import {ENTITY_SELECTOR} from '../types';

export enum ngrxEntityRelationshipActions {
    reduceFlat = '[NGRX-Entity-Relationship] Flat',
    reduceGraph = '[NGRX-Entity-Relationship] Graph',
}

class ReduceFlat {
    public readonly type: ngrxEntityRelationshipActions.reduceFlat = ngrxEntityRelationshipActions.reduceFlat;

    constructor(public readonly data: any, public readonly selector: ENTITY_SELECTOR) {}
}

// Because of redux it can't be a ReduceGraph instance.
const reduceFlat = (payload: {data: any; selector: ENTITY_SELECTOR}) => ({
    data: payload.data,
    selector: payload.selector,
    type: ngrxEntityRelationshipActions.reduceFlat,
});
reduceFlat.type = ngrxEntityRelationshipActions.reduceFlat;

class ReduceGraph {
    public readonly type: ngrxEntityRelationshipActions.reduceGraph = ngrxEntityRelationshipActions.reduceGraph;

    constructor(public readonly data: any, public readonly selector: ENTITY_SELECTOR) {}
}

// Because of redux it can't be a ReduceGraph instance.
const reduceGraph = (payload: {data: any; selector: ENTITY_SELECTOR}) => ({
    data: payload.data,
    selector: payload.selector,
    type: ngrxEntityRelationshipActions.reduceGraph,
});
reduceGraph.type = ngrxEntityRelationshipActions.reduceGraph;

export {ReduceFlat, reduceFlat, ReduceGraph, reduceGraph};
