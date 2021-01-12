export function toTerm(term: 'query' | 'subscription' | 'mutation', ...args: Array<any>): string {
    const params: Array<string> = [];
    let toGraphQL = '';

    if (typeof args[0] === 'object') {
        for (const key of Object.keys(args[0] || {})) {
            params.push(`${key}:${args[0][key]}`);
        }
        toGraphQL = args[1];
    } else {
        toGraphQL = args[0];
    }

    return `${term}${params.length ? `(${params.join(',')})` : ''}${toGraphQL}`;
}
