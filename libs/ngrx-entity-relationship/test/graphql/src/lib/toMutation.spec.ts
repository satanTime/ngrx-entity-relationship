import {toMutation} from '../../../../graphql/src/lib/toMutation';
import {toTerm} from '../../../../graphql/src/lib/toTerm';

describe('toMutation', () => {
    it('forwards query to toTerm', () => {
        const expected = toTerm('mutation', '<query>');
        const actual = toMutation('<query>');
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
        const expected = toTerm('mutation', params, '<query>');
        const actual = toMutation(params, '<query>');
        expect(actual).toEqual(expected);
    });
});
