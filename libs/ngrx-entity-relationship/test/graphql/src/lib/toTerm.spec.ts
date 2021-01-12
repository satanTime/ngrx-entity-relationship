import {toTerm} from '../../../../graphql/src/lib/toTerm';

describe('toTerm', () => {
    it('handles no params', () => {
        const actual = toTerm('query', '<query>');
        expect(actual).toEqual('query<query>');
    });

    it('handles params', () => {
        const params = {
            p1: 'ID',
            p2: 'ID!',
            p3: 'String!',
            p4: 'String',
            p5: 'Boolean!',
            p6: 'Boolean',
            p7: 'randomString',
        };
        const actual = toTerm('query', params, '<query>');
        expect(actual).toEqual(
            'query(p1:ID,p2:ID!,p3:String!,p4:String,p5:Boolean!,p6:Boolean,p7:randomString)<query>',
        );
    });

    it('handles null', () => {
        const actual = toTerm('query', null, '<query>');
        expect(actual).toEqual('query<query>');
    });
});
