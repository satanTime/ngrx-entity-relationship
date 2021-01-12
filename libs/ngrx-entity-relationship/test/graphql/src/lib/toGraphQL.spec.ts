import {toGraphQL} from '../../../../graphql/src/lib/toGraphQL';

describe('toGraphQL', () => {
    it('combines strings', () => {
        const actual = toGraphQL('1', '2', '3');
        expect(actual).toEqual('{1\n2\n3}');
    });
});
