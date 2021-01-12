import {toSubscription} from '../../../../graphql/src/lib/toSubscription';
import {toTerm} from '../../../../graphql/src/lib/toTerm';

describe('toSubscription', () => {
    it('forwards query to toTerm', () => {
        const expected = toTerm('subscription', '<query>');
        const actual = toSubscription('<query>');
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
        const expected = toTerm('subscription', params, '<query>');
        const actual = toSubscription(params, '<query>');
        expect(actual).toEqual(expected);
    });
});
