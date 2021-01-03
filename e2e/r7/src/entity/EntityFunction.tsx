import {HANDLER_ENTITIES, HANDLER_ENTITY, rootEntities, selectByIds} from 'ngrx-entity-relationship';
import React from 'react';
import {useSelector} from 'react-redux';

import {Company} from './store/company/company.model';
import {EntityService} from './store/entity.service';
import {
    sAddressCompany,
    sCompany,
    sCompanyAddress,
    sCompanyAdmin,
    sCompanyStaff,
    selectCurrentUsersIds,
    sUser,
    sUserCompany,
    sUserEmployees,
    sUserManager,
} from './store/reducers';
import {User} from './store/user/user.model';

// prettier-ignore
const companyWithCrazyData: HANDLER_ENTITY<Company> = sCompany(
    sCompanyAddress(),
    sCompanyAdmin(
        sUserEmployees(),
    ),
    sCompanyStaff(
        sUserCompany(
            sCompanyAddress(
                sAddressCompany(),
            ),
        ),
    ),
);

// prettier-ignore
const users: HANDLER_ENTITIES<User> = rootEntities(
    sUser(
        sUserEmployees(
            sUserManager(),
        ),
        sUserManager(),
    ),
);

export function EntityFunction({service}: {service: EntityService}): JSX.Element {
    const selectedCompany: Company | undefined = useSelector(selectByIds(companyWithCrazyData, 'company3'));
    const selectedUsers: Array<User> = useSelector(selectByIds(users, selectCurrentUsersIds));

    return (
        <div>
            <h1>EntityFunction</h1>
            <button onClick={() => service.changeUser('user1')} role='user1'>
                Change user1
            </button>
            <button onClick={() => service.changeUser('user2')} role='user2'>
                Change user2
            </button>
            <button onClick={() => service.changeUser('user3')} role='user3'>
                Change user3
            </button>
            <button onClick={() => service.changeUser('user4')} role='user4'>
                Change user4
            </button>
            <button onClick={() => service.changeUser('user5')} role='user5'>
                Change user5
            </button>
            <button onClick={() => service.changeUser('user6')} role='user6'>
                Change user6
            </button>
            <button onClick={() => service.changeCompany('company1')} role='company1'>
                Change company1
            </button>
            <button onClick={() => service.changeCompany('company2')} role='company2'>
                Change company2
            </button>
            <button onClick={() => service.changeCompany('company3')} role='company3'>
                Change company3
            </button>
            <button onClick={() => service.changeAddress('address1')} role='address1'>
                Change address1
            </button>
            <button onClick={() => service.changeAddress('address2')} role='address2'>
                Change address2
            </button>

            <section>
                <h2>Company</h2>
                <strong>selector</strong>
                <pre>
                    {`
const companyWithCrazyData: HANDLER_ENTITY<Company> = sCompany(
    sCompanyAddress(),
    sCompanyAdmin(
        sUserEmployees(),
    ),
    sCompanyStaff(
        sUserCompany(
            sCompanyAddress(
                sAddressCompany(),
            ),
        ),
    ),
);
                    `.trim()}
                </pre>
                <strong>usage</strong>
                <pre>
                    {`
const selectedCompany: Company | undefined = useSelector(selectByIds(companyWithCrazyData, 'company3'));
                `.trim()}
                </pre>
                <strong>
                    {`
{JSON.stringify(selectedCompany, null, 2)}
                `.trim()}
                </strong>
                <pre role='companies'>{JSON.stringify(selectedCompany, null, 2)}</pre>
            </section>

            <section>
                <h2>Users</h2>
                <strong>selector</strong>
                <pre>
                    {`
const users: HANDLER_ENTITIES<User> = rootEntities(
    sUser(
        sUserEmployees(
            sUserManager(),
        ),
        sUserManager(),
    ),
);
                    `.trim()}
                </pre>
                <strong>usage</strong>
                <pre>
                    {`
const selectedUsers: Array<User> = useSelector(selectByIds(users, selectCurrentUsersIds));
                `.trim()}
                </pre>
                <strong>
                    {`
{JSON.stringify(selectedUsers, null, 2)}
                `.trim()}
                </strong>
                <pre role='users'>{JSON.stringify(selectedUsers, null, 2)}</pre>
            </section>
        </div>
    );
}
