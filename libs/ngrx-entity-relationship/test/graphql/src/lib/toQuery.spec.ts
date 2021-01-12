import {toQuery} from '../../../../graphql/src/lib/toQuery';
import {toTerm} from '../../../../graphql/src/lib/toTerm';

describe('toQuery', () => {
    it('forwards query to toTerm', () => {
        const expected = toTerm('query', '<query>');
        const actual = toQuery('<query>');
        expect(actual).toEqual(expected);
    });

    it('forwards params and query to toTerm', () => {
        const params = {
            p1: 'ID',
            p2: 'ID!',
            p3: 'String!',
            p4: 'String',
            p5: 'Boolean!',
            p6: 'Boolean',
            p7: 'randomString',
        };
        const expected = toTerm('query', params, '<query>');
        const actual = toQuery(params, '<query>');
        expect(actual).toEqual(expected);
    });
});
