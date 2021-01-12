import {ENTITY_SELECTOR} from 'ngrx-entity-relationship';

const resolveGraphQL = (
    selector: ENTITY_SELECTOR,
    options: {
        include: Array<keyof any>;
        prefix: string;
        level: number;
    },
) => {
    const prefix = options.prefix ? options.prefix.repeat(options.level) : '';
    let query = '';
    const included: Array<string | number> = [];
    for (const relationship of selector.relationships) {
        // istanbul ignore if
        if (typeof relationship.keyId !== 'string' && typeof relationship.keyId !== 'number') {
            continue;
        }
        // istanbul ignore if
        if (typeof relationship.keyValue !== 'string' && typeof relationship.keyValue !== 'number') {
            continue;
        }
        if (relationship.ngrxEntityRelationship === 'childrenEntities') {
            included.push(relationship.keyValue);
            query += `${prefix}${relationship.keyValue}`;
            query += `${prefix ? ' ' : ''}{${prefix ? '\n' : ''}${resolveGraphQL(relationship, {
                include: [relationship.keyId],
                prefix: options.prefix,
                level: options.level + 1,
            })}${prefix}}${prefix ? '\n' : ''}`;
        } else if (relationship.ngrxEntityRelationship === 'childEntity') {
            included.push(relationship.keyValue);
            query += `${prefix}${relationship.keyValue}`;
            query += `${prefix ? ' ' : ''}{${prefix ? '\n' : ''}${resolveGraphQL(relationship, {
                include: [relationship.keyId],
                prefix: options.prefix,
                level: options.level + 1,
            })}${prefix}}${prefix ? '\n' : ''}`;
        } else {
            included.push(relationship.keyId);
            included.push(relationship.keyValue);
            query += `${prefix}${relationship.keyId}`;
            query += `\n${prefix}${relationship.keyValue}`;
            query += `${prefix ? ' ' : ''}{${prefix ? '\n' : ''}${resolveGraphQL(relationship, {
                include: [],
                prefix: options.prefix,
                level: options.level + 1,
            })}${prefix}}${prefix ? '\n' : ''}`;
        }
    }
    for (const field of options.include) {
        // istanbul ignore if
        if (typeof field !== 'string' && typeof field !== 'number') {
            continue;
        }
        // istanbul ignore if
        if (included.indexOf(field) !== -1) {
            continue;
        }
        included.push(field);
        query += `${prefix}${field}\n`;
    }
    const fields = selector.meta.gqlFields || [];
    for (const field of fields) {
        if (included.indexOf(field) !== -1) {
            continue;
        }
        included.push(field);
        query += `${prefix}${field}\n`;
    }
    return query;
};

function encodeValue(data: any): string | undefined {
    if (typeof data === 'number') {
        return JSON.stringify(data);
    }
    if (typeof data === 'string') {
        return JSON.stringify(data);
    }
    if (typeof data === 'boolean') {
        return JSON.stringify(data);
    }
    if (data === null || data === undefined) {
        return JSON.stringify(null);
    }
    if (typeof data === 'function') {
        return undefined;
    }
    if (Array.isArray(data)) {
        return `[${data
            .map(encodeValue)
            .filter(v => v !== undefined)
            .join(',')}]`;
    }
    const fields: Array<string> = [];
    for (const key of Object.keys(data)) {
        const value = encodeValue(data[key]);
        if (value === undefined) {
            continue;
        }
        fields.push(`${key}:${value}`);
    }
    return `{${fields.join(',')}}`;
}

export function toGraphQL(...queries: Array<string>): string;
export function toGraphQL(query: string, params: object, selector: ENTITY_SELECTOR): string;
export function toGraphQL(query: string, selector: ENTITY_SELECTOR): string;

export function toGraphQL(...queries: Array<any>): string {
    const prefix = (window as any).ngrxGraphqlPrefix || '';
    let query = '';
    let selector: ENTITY_SELECTOR | undefined;
    let params: Record<string, any> | null | string | undefined;
    if (queries.length >= 2 && typeof queries[1] !== 'string') {
        if (queries[2] && typeof queries[2] !== 'string') {
            [query, params, selector] = queries;
        } else {
            [query, selector] = queries;
        }
    }

    const stringParams: Array<string> = [];
    if (params && typeof params === 'object') {
        for (const key of Object.keys(params)) {
            if (key === '$') {
                continue;
            }
            const value = encodeValue(params[key]);
            if (value === undefined) {
                continue;
            }
            stringParams.push(`${key}:${prefix ? ' ' : ''}${value}`);
        }
    }
    if (params && typeof params === 'object' && params.$ && typeof params.$ === 'object') {
        const params$ = params.$;
        for (const key of Object.keys(params$)) {
            if (typeof params$[key] !== 'string' || params$[key][0] !== '$') {
                throw new Error(`${key} should be a variable that starts with $ symbol`);
            }
            stringParams.push(`${key}:${prefix ? ' ' : ''}${params$[key]}`);
        }
    }
    params = stringParams.length ? `(${stringParams.join(`,${prefix ? ' ' : ''}`)})` : '';

    if (selector) {
        return `{\n${prefix}${query}${params}${prefix ? ' ' : ''}{\n${resolveGraphQL(selector, {
            include: [],
            prefix: `${prefix}`,
            level: 2,
        })}${prefix}}\n}`;
    }
    const parts: Array<string> = [];
    for (let part of queries) {
        if (typeof part !== 'string') {
            continue;
        }
        part = part.trim();
        if (part.substr(0, 1) === '{' && part.substr(part.length - 1, 1) === '}') {
            part = part.substr(1, part.length - 2);
        }
        parts.push(part.trim());
    }

    return `{${parts.join('\n')}}`;
}
