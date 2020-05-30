import {ENTITY_SELECTOR} from '../types';

export enum ngrxEntityRelationshipActions {
    reduceFlat = '[NGRX-Entity-Relationship] Flat',
    reduceGraph = '[NGRX-Entity-Relationship] Graph',
}

class ReduceFlat {
    public readonly type: ngrxEntityRelationshipActions.reduceFlat = ngrxEntityRelationshipActions.reduceFlat;

    constructor(public readonly data: any, public readonly selector: ENTITY_SELECTOR) {}
}

const reduceFlat = (payload: {data: any; selector: ENTITY_SELECTOR}) => new ReduceFlat(payload.data, payload.selector);
reduceFlat.type = ngrxEntityRelationshipActions.reduceFlat;

class ReduceGraph {
    public readonly type: ngrxEntityRelationshipActions.reduceGraph = ngrxEntityRelationshipActions.reduceGraph;

    constructor(public readonly data: any, public readonly selector: ENTITY_SELECTOR) {}
}

const reduceGraph = (payload: {data: any; selector: ENTITY_SELECTOR}) =>
    new ReduceGraph(payload.data, payload.selector);
reduceGraph.type = ngrxEntityRelationshipActions.reduceGraph;

export {ReduceFlat, reduceFlat, ReduceGraph, reduceGraph};
