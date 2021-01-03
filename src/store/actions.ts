import {ENTITY_SELECTOR} from '../types';

export enum ngrxEntityRelationshipActions {
    reduceFlat = '[NGRX-Entity-Relationship] Flat',
    reduceGraph = '[NGRX-Entity-Relationship] Graph',
}

export class ReduceFlat {
    public readonly type: ngrxEntityRelationshipActions.reduceFlat = ngrxEntityRelationshipActions.reduceFlat;

    constructor(public readonly data: any, public readonly selector: ENTITY_SELECTOR) {}
}

// Because of redux it can't be a ReduceGraph instance.
export const reduceFlat = (payload: {data: any; selector: ENTITY_SELECTOR}) => ({
    data: payload.data,
    selector: payload.selector,
    type: ngrxEntityRelationshipActions.reduceFlat,
});
reduceFlat.type = ngrxEntityRelationshipActions.reduceFlat;

export class ReduceGraph {
    public readonly type: ngrxEntityRelationshipActions.reduceGraph = ngrxEntityRelationshipActions.reduceGraph;

    constructor(public readonly data: any, public readonly selector: ENTITY_SELECTOR) {}
}

// Because of redux it can't be a ReduceGraph instance.
export const reduceGraph = (payload: {data: any; selector: ENTITY_SELECTOR}) => ({
    data: payload.data,
    selector: payload.selector,
    type: ngrxEntityRelationshipActions.reduceGraph,
});
reduceGraph.type = ngrxEntityRelationshipActions.reduceGraph;
