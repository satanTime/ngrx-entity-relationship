import {toTerm} from './toTerm';

export function toQuery(toGraphQL: string): string;
export function toQuery(
    variables: {
        [key: string]: 'ID' | 'ID!' | 'String!' | 'String' | 'Boolean!' | 'Boolean' | string;
    },
    toGraphQL: string,
): string;
export function toQuery(...args: Array<any>): string {
    return toTerm('query', ...args);
}
