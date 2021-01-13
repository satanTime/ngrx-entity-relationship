import {toTerm} from './toTerm';

export function toMutation(toGraphQL: string): string;
export function toMutation(
    variables: {
        [key: string]: 'ID' | 'ID!' | 'String!' | 'String' | 'Boolean!' | 'Boolean' | string;
    },
    toGraphQL: string,
): string;
export function toMutation(...args: Array<any>): string {
    return toTerm('mutation', ...args);
}
