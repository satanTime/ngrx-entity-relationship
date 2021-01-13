import {
    childEntitySelector,
    childrenEntitiesSelector,
    FEATURE_SELECTOR,
    relatedEntitySelector,
    rootEntitySelector,
} from 'ngrx-entity-relationship';
import {toGraphQL} from 'ngrx-entity-relationship/graphql';

const normalizeQuery = (query: string) => {
    return query.replace(/\s+/gim, ' ').replace(/\s*([\[\]{}():,])\s*/gim, '$1');
};
interface User {
    id: string;
    firstName: string;
    lastName: string;
    company?: Company;
    companyId?: string;
    employees?: Array<User>;
    employeesId?: Array<string>;
}
interface Company {
    id: string;
    name: string;
    staff?: Array<User>;
    admin?: User;
    adminId?: string;
    2?: Address;
}
interface Address {
    id: string;
    street: string;
    city: string;
    country: string;
    1?: string;
}

const userFeature: FEATURE_SELECTOR<any, User> = (() => undefined) as any;
const companyFeature: FEATURE_SELECTOR<any, Company> = (() => undefined) as any;
const addressFeature: FEATURE_SELECTOR<any, Address> = (() => undefined) as any;

const user = rootEntitySelector(userFeature, {
    gqlFields: ['id', 'firstName', 'lastName'],
});
const userCompany = relatedEntitySelector(companyFeature, 'companyId', 'company', {
    gqlFields: ['id', 'name'],
});
const companyAddress = childEntitySelector(addressFeature, 1, 2, {
    gqlFields: ['id', 'street', 'city', 'country', 1],
});
const companyStuff = childrenEntitiesSelector(userFeature, 'companyId', 'staff');

const selectUser = user(userCompany(companyAddress(), companyStuff()));

const selector = `
{
    companyId
    company {
        2 {
            1
            id
            street
            city
            country
        }
        staff {
            companyId
        }
        id
        name
    }
    id
    firstName
    lastName
}
`;

afterEach(() => ((window as any).ngrxGraphqlPrefix = undefined));

test('combines strings', () => {
    const actual = toGraphQL('1', '2', '3');
    expect(actual).toEqual('{1\n2\n3}');
});

test('generates query w/o params', () => {
    const query = toGraphQL('users', selectUser);
    expect(normalizeQuery(query)).toEqual(
        normalizeQuery(`
    {
        users ${selector}
    }
    `),
    );
});

test('generates query w/ injected string params', () => {
    const query = toGraphQL('user(id: "1")', selectUser);
    expect(normalizeQuery(query)).toEqual(
        normalizeQuery(`
    {
        user(id: "1") ${selector}
    }
    `),
    );
});

test('generates query w/ object params', () => {
    const params = {
        id: '2',
    };
    const query = toGraphQL('user', params, selectUser);
    expect(normalizeQuery(query)).toEqual(
        normalizeQuery(`
    {
        user(id: "2") ${selector}
    }
    `),
    );
});

test('generates query w/ comlex object params', () => {
    const params = {
        p1: '2',
        p2: true,
        p3: null,
        p4: undefined,
        p5: 1,
        p6: () => undefined,
        p7: [1, '2', false],
        p8: {
            p1: '2',
            p2: true,
            p3: null,
            p4: undefined,
            p5: 1,
            p6: () => undefined,
            p7: [1, '2', false],
            p8: {
                p1: true,
            },
        },
    };
    const query = toGraphQL('user', params, selectUser);
    expect(normalizeQuery(query)).toEqual(
        normalizeQuery(`
    {
        user(
            p1:"2",
            p2:true,
            p3:null,
            p4:null,
            p5:1,
            p7:[
                1,
                "2",
                false
            ],
            p8:{
                p1:"2",
                p2:true,
                p3:null,
                p4:null,
                p5:1,
                p7:[
                    1,
                    "2",
                    false
                ],
                p8:{
                    p1:true
                }
            }
        ) ${selector}
    }
    `),
    );
});

test('generates query w/o $ params when it is a string', () => {
    const params = {
        $: '2',
    };
    const query = toGraphQL('user', params, selectUser);
    expect(normalizeQuery(query)).toEqual(
        normalizeQuery(`
    {
        user ${selector}
    }
    `),
    );
});

test('generates query w/ $ params when it is an object', () => {
    const params = {
        $: {
            id: '$paramId',
            value: '$something',
        },
    };
    const query = toGraphQL('user', params, selectUser);
    expect(normalizeQuery(query)).toEqual(
        normalizeQuery(`
    {
        user(id: $paramId, value: $something) ${selector}
    }
    `),
    );
});

test('throws when values of $ param do not start with $', () => {
    const params = {
        $: {
            id: 'paramId',
        },
    };
    expect(() => toGraphQL('user', params, selectUser)).toThrow();
});

test('combines string queries with aliases', () => {
    const query = toGraphQL(
        toGraphQL('u1:user', selectUser),
        toGraphQL('u2:user', selectUser),
        true as any,
        null as any,
        undefined as any,
        123 as any,
        {} as any,
    );
    expect(normalizeQuery(query)).toEqual(
        normalizeQuery(`
    {
        u1:user ${selector}
        u2:user ${selector}
    }
    `),
    );
});

test('generates nicer query with ngrxGraphqlPrefix', () => {
    (window as any).ngrxGraphqlPrefix = ' ';
    const params = {
        $: {
            id: '$paramId',
        },
        value: 'valueString',
    };
    let query = toGraphQL('user', params, selectUser);
    expect(query).toContain('user(value: "valueString", id: $paramId) {');

    (window as any).ngrxGraphqlPrefix = undefined;
    query = toGraphQL('user', params, selectUser);
    expect(query).toContain('user(value:"valueString",id:$paramId){');
});
