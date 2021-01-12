import {toTerm} from './toTerm';

export function toSubscription(toGraphQL: string): string;
export function toSubscription(
    variables: {
        [key: string]: 'ID' | 'ID!' | 'String!' | 'String' | 'Boolean!' | 'Boolean' | string;
    },
    toGraphQL: string,
): string;
export function toSubscription(...args: Array<any>): string {
    return toTerm('subscription', ...args);
}
