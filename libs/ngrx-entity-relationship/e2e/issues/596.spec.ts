import {FEATURE_SELECTOR, relatedEntitySelector, rootEntitySelector} from 'ngrx-entity-relationship';
import {toGraphQL} from 'ngrx-entity-relationship/graphql';

// A way to provide subset selectors
describe('issue-596', () => {
    const normalizeQuery = (query: string) => {
        return query.replace(/\s+/gim, ' ').replace(/\s*([\[\]{}():,])\s*/gim, '$1');
    };
    interface User {
        id: string;
        firstName: string;
        lastName: string;
        permissions: Array<{
            key: string;
            level: string;
        }>;
        company?: Company;
        companyId?: string;
    }
    interface Company {
        id: string;
        name: string;
        staff?: Array<User>;
        admin?: User;
        adminId?: string;
    }

    const userFeature: FEATURE_SELECTOR<any, User> = (() => undefined) as any;
    const companyFeature: FEATURE_SELECTOR<any, Company> = (() => undefined) as any;

    const user = rootEntitySelector(userFeature, {
        gqlFields: {
            id: '',
            firstName: '',
            lastName: '',
            permissions: '{key level}',
            company: '{id}', // will be ignored due to the selector
        },
    });
    const userCompany = relatedEntitySelector(companyFeature, 'companyId', 'company', {
        gqlFields: ['id', 'name'],
    });

    const selectUser = user(userCompany());

    afterEach(() => ((window as any).ngrxGraphqlPrefix = undefined));

    it('adds sub sets to the final query', () => {
        const query = toGraphQL('users', selectUser);
        expect(normalizeQuery(query)).toEqual(
            normalizeQuery(`
            {
                users {
                    companyId
                    company {
                        id
                        name
                    }
                    id
                    firstName
                    lastName
                    permissions {
                        key
                        level
                    }
                }
            }
        `),
        );
    });
});
